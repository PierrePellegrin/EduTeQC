import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Searchbar, FAB } from 'react-native-paper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PackageForm, PackagesList, EmptyState } from './components';
import { styles } from './styles';

// Type
type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const AdminPackagesScreen = ({ navigation }: Props) => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      imageUrl: '',
    });
    setSelectedCourses([]);
  };

  // Use refactored CRUD mutations hook
  const { usePackageMutations } = require('./consts');
  const { createMutation, updateMutation, deleteMutation, toggleActiveMutation } = usePackageMutations(resetForm, setShowCreateForm, setEditingPackage);

  const handleToggleActive = (id: string, isActive: boolean, name: string) => {
    toggleActiveMutation.mutate({ id, isActive: !isActive });
    Alert.alert('Succès', `Le package "${name}" a été ${isActive ? 'désactivé' : 'activé'}.`);
  };

  const handleEdit = (pkg: any) => {
    setEditingPackage(pkg);
    setShowCreateForm(true);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price.toString(),
      imageUrl: pkg.imageUrl || '',
    });
    setSelectedCourses(pkg.courses?.map((c: any) => c.course.id) || []);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Confirmation',
      `Supprimer le package "${name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
      ]
    );
  };

  const handleSubmit = () => {
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
      updateMutation.mutate({ id: editingPackage.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const toggleCourse = (courseId: string) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingPackage(null);
    resetForm();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const filteredPackages = packages?.packages?.filter((pkg: any) =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Éliminer les doublons de cours par ID
  const uniqueCourses = courses?.courses?.reduce((acc: any[], course: any) => {
    if (!acc.find(c => c.id === course.id)) {
      acc.push(course);
    }
    return acc;
  }, []) || [];

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Rechercher"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {showCreateForm && (
          <PackageForm
            formData={formData}
            selectedCourses={selectedCourses}
            availableCourses={uniqueCourses}
            isEditing={!!editingPackage}
            isLoading={createMutation.isPending || updateMutation.isPending}
            onFormChange={setFormData}
            onToggleCourse={toggleCourse}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
          />
        )}

        {!showCreateForm && filteredPackages.length > 0 && (
          <PackagesList
            packages={filteredPackages}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
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

