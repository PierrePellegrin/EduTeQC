import React, { useState, useMemo, useCallback } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Searchbar, FAB, SegmentedButtons, List } from 'react-native-paper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PackageForm, PackagesList, EmptyState } from './components';
import { styles } from './styles';
import { usePackageMutations } from './consts';

// Type
type Props = {
  navigation: NativeStackNavigationProp<any>;
};

type GroupBy = 'none' | 'price' | 'type';

export const AdminPackagesScreen = ({ navigation }: Props) => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
  });
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const { data: packages, isLoading } = useQuery({
    queryKey: ['adminPackages'],
    queryFn: adminApi.getAllPackages,
  });
  const { data: courses } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: adminApi.getAllCourses,
  });

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      description: '',
      price: '',
      imageUrl: '',
    });
    setSelectedCourses([]);
  }, []);

  // Use refactored CRUD mutations hook
  const { createMutation, updateMutation, deleteMutation, toggleActiveMutation } = usePackageMutations(resetForm, setShowCreateForm, setEditingPackage);

  const handleToggleActive = useCallback((id: string, isActive: boolean, name: string) => {
    toggleActiveMutation?.mutate({ id, data: { isActive: !isActive } });
    Alert.alert('Succès', `Le forfait "${name}" a été ${isActive ? 'désactivé' : 'activé'}.`);
  }, [toggleActiveMutation]);

  const handleEdit = useCallback((pkg: any) => {
    setEditingPackage(pkg);
    setShowCreateForm(true);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price.toString(),
      imageUrl: pkg.imageUrl || '',
    });
    setSelectedCourses(pkg.courses?.map((c: any) => c.course.id) || []);
  }, []);

  const handleDelete = useCallback((id: string, name: string) => {
    Alert.alert(
      'Confirmation',
      `Supprimer le forfait "${name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => deleteMutation?.mutate(id) },
      ]
    );
  }, [deleteMutation]);

  const handleSubmit = useCallback(() => {
    if (!formData.name || !formData.description || !formData.price) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }
    if (selectedCourses.length === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner au moins un cours');
      return;
    }
    const data = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      imageUrl: formData.imageUrl || undefined,
      courseIds: selectedCourses,
    };
    if (editingPackage) {
      updateMutation?.mutate({ id: editingPackage.id, data });
    } else {
      createMutation?.mutate(data);
    }
  }, [formData, selectedCourses, editingPackage, createMutation, updateMutation]);

  const toggleCourse = useCallback((courseId: string) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  }, [selectedCourses]);

  const handleCancelForm = useCallback(() => {
    setShowCreateForm(false);
    setEditingPackage(null);
    resetForm();
  }, [resetForm]);

  // Mémoriser le filtrage des packages
  const filteredPackages = useMemo(() => {
    const allPackages = packages?.packages || [];
    if (!searchQuery) return allPackages;
    
    const query = searchQuery.toLowerCase();
    return allPackages.filter((pkg: any) =>
      pkg.name.toLowerCase().includes(query) ||
      pkg.description?.toLowerCase().includes(query)
    );
  }, [packages?.packages, searchQuery]);

  // Regroupement des packages
  const groupedPackages = useMemo(() => {
    if (groupBy === 'none') {
      return { 'all': filteredPackages };
    }

    const groups: Record<string, any[]> = {};

    if (groupBy === 'price') {
      filteredPackages.forEach((pkg: any) => {
        let key = 'Gratuit';
        if (pkg.price > 0 && pkg.price < 40) key = 'Moins de 40€';
        else if (pkg.price >= 40 && pkg.price < 70) key = '40€ - 70€';
        else if (pkg.price >= 70) key = 'Plus de 70€';
        
        if (!groups[key]) groups[key] = [];
        groups[key].push(pkg);
      });
    } else if (groupBy === 'type') {
      filteredPackages.forEach((pkg: any) => {
        // Détecter le type de package par son nom
        let key = 'Autre';
        const name = pkg.name.toLowerCase();
        
        if (name.includes('primaire') || name.includes('collège') || name.includes('lycée')) {
          if (name.includes('français') || name.includes('mathématiques') || name.includes('histoire')) {
            key = 'Par cycle et matière';
          } else {
            key = 'Par cycle';
          }
        } else if (name.includes('cp') || name.includes('ce1') || name.includes('ce2') || 
                   name.includes('cm1') || name.includes('cm2') || name.includes('6ème') || 
                   name.includes('5ème') || name.includes('4ème') || name.includes('3ème') ||
                   name.includes('2nd') || name.includes('1ère') || name.includes('terminale')) {
          key = 'Par niveau';
        } else if (name.includes('français') || name.includes('mathématiques') || name.includes('histoire')) {
          key = 'Par matière';
        }
        
        if (!groups[key]) groups[key] = [];
        groups[key].push(pkg);
      });
    }

    return groups;
  }, [filteredPackages, groupBy]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const toggleGroup = useCallback((groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  }, []);

  // Éliminer les doublons de cours par ID
  const uniqueCourses = useMemo(() => 
    courses?.courses?.reduce((acc: any[], course: any) => {
      if (!acc.find(c => c.id === course.id)) {
        acc.push(course);
      }
      return acc;
    }, []) || []
  , [courses?.courses]);

  const renderPackagesList = useCallback((packagesToRender: any[]) => (
    <PackagesList
      packages={packagesToRender}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleActive={handleToggleActive}
    />
  ), [handleEdit, handleDelete, handleToggleActive]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Rechercher"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        {!showCreateForm && (
          <SegmentedButtons
            value={groupBy}
            onValueChange={(value) => setGroupBy(value as GroupBy)}
            buttons={[
              { value: 'none', label: 'Tous', icon: 'view-list' },
              { value: 'type', label: 'Type', icon: 'shape' },
              { value: 'price', label: 'Prix', icon: 'currency-eur' },
            ]}
            style={styles.segmentedButtons}
          />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {showCreateForm && (
          <PackageForm
            formData={formData}
            selectedCourses={selectedCourses}
            availableCourses={uniqueCourses}
            isEditing={!!editingPackage}
            isLoading={(createMutation?.isPending || false) || (updateMutation?.isPending || false)}
            onFormChange={setFormData}
            onToggleCourse={toggleCourse}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
          />
        )}

        {!showCreateForm && filteredPackages.length > 0 && groupBy === 'none' && (
          renderPackagesList(filteredPackages)
        )}

        {!showCreateForm && filteredPackages.length > 0 && groupBy !== 'none' && (
          <View>
            {Object.entries(groupedPackages).map(([groupKey, groupPackages]) => (
              <List.Accordion
                key={groupKey}
                title={`${groupKey} (${groupPackages.length})`}
                left={props => <List.Icon {...props} icon={
                  groupBy === 'type' ? 'shape' : 'currency-eur'
                } />}
                expanded={expandedGroups[groupKey] !== false}
                onPress={() => toggleGroup(groupKey)}
                style={styles.accordion}
              >
                {renderPackagesList(groupPackages)}
              </List.Accordion>
            ))}
          </View>
        )}

        {!filteredPackages.length && !showCreateForm && (
          <EmptyState hasSearchQuery={!!searchQuery} />
        )}
      </ScrollView>

      {!showCreateForm && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setShowCreateForm(true)}
        />
      )}
    </View>
  );
};

