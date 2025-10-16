import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, TextInput, FAB, IconButton, Chip, Searchbar, Checkbox } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';
import { styles } from './adminPackagesScreen.styles';

// Type
type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const AdminPackagesScreen = ({ navigation }: Props) => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();
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

  // Import mutations from extracted hook
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { usePackageMutations } = require('./adminPackagesScreen.consts');
  const { createMutation, updateMutation, deleteMutation, toggleActiveMutation } = usePackageMutations(queryClient, resetForm, setShowCreateForm, setEditingPackage);

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
        placeholder="Rechercher un package..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {showCreateForm && (
          <Card style={[styles.formCard, { backgroundColor: theme.colors.cardBackground }]}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.formTitle}>
                {editingPackage ? 'Modifier le package' : 'Créer un nouveau package'}
              </Text>

              <TextInput
                label="Nom du package *"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Description *"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
              />

              <TextInput
                label="Prix (€) *"
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                mode="outlined"
                keyboardType="decimal-pad"
                style={styles.input}
              />

              <TextInput
                label="URL de l'image (optionnel)"
                value={formData.imageUrl}
                onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
                mode="outlined"
                placeholder="https://..."
                style={styles.input}
              />

              <Text variant="titleMedium" style={styles.sectionTitle}>
                Cours inclus *
              </Text>

              {uniqueCourses.map((course: any) => (
                <Checkbox.Item
                  key={course.id}
                  label={course.title}
                  status={selectedCourses.includes(course.id) ? 'checked' : 'unchecked'}
                  onPress={() => toggleCourse(course.id)}
                  style={styles.checkbox}
                />
              ))}

              <View style={styles.formActions}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setShowCreateForm(false);
                    setEditingPackage(null);
                    resetForm();
                  }}
                  style={styles.actionButton}
                >
                  Annuler
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={createMutation.isPending || updateMutation.isPending}
                  style={styles.actionButton}
                >
                  {editingPackage ? 'Mettre à jour' : 'Créer'}
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        <View style={styles.packagesList}>
          {filteredPackages.map((pkg: any) => (
            <Card key={pkg.id} style={[styles.packageCard, { backgroundColor: theme.colors.cardBackground }]}>
              <Card.Content>
                <View style={styles.packageHeader}>
                  <View style={styles.packageInfo}>
                    <View style={styles.titleRow}>
                      <Text variant="titleLarge" style={[styles.packageTitleText, { color: theme.colors.onCardBackground }]}>
                        {pkg.name}
                      </Text>
                    </View>
                    <Text variant="bodyMedium" style={[styles.packageMeta, { color: theme.colors.onCardBackground }]}>
                      {pkg.description}
                    </Text>
                    <View style={styles.chipContainer}>
                      <Chip icon="currency-eur" compact style={styles.chip}>
                        {pkg.price.toFixed(2)} €
                      </Chip>
                      <Chip icon="book-multiple" compact style={styles.chip}>
                        {pkg.courses?.length || 0} cours
                      </Chip>
                      {pkg._count?.userPackages > 0 && (
                        <Chip icon="account-group" compact style={styles.chip}>
                          {pkg._count.userPackages} client{pkg._count.userPackages > 1 ? 's' : ''}
                        </Chip>
                      )}
                    </View>
                    {pkg.courses && pkg.courses.length > 0 && (
                      <>
                        <Text variant="labelMedium" style={styles.coursesLabel}>
                          Cours inclus :
                        </Text>
                        {pkg.courses.map((c: any) => (
                          <Text key={c.id} variant="bodySmall" style={[styles.courseItem, { color: theme.colors.onCardBackground }]}>
                            • {c.course.title}
                          </Text>
                        ))}
                      </>
                    )}
                    <Button
                      mode={pkg.isActive ? 'outlined' : 'contained'}
                      icon={pkg.isActive ? 'cancel' : 'check'}
                      onPress={() => handleToggleActive(pkg.id, pkg.isActive, pkg.name)}
                      style={styles.activeButton}
                      compact
                    >
                      {pkg.isActive ? 'Désactiver' : 'Activer'}
                    </Button>
                  </View>
                  <View style={styles.packageActions}>
                    <IconButton
                      icon="pencil"
                      mode="contained-tonal"
                      onPress={() => handleEdit(pkg)}
                    />
                    <IconButton
                      icon="delete"
                      mode="contained-tonal"
                      iconColor={theme.colors.logoutColor}
                      onPress={() => handleDelete(pkg.id, pkg.name)}
                    />
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {!filteredPackages.length && !showCreateForm && (
          <Card style={[styles.emptyCard, { backgroundColor: theme.colors.cardBackground }]}>
            <Card.Content>
              <Text variant="bodyLarge" style={styles.emptyText}>
                {searchQuery 
                  ? 'Aucun package trouvé pour cette recherche.'
                  : 'Aucun package créé. Cliquez sur le bouton + pour commencer.'}
              </Text>
            </Card.Content>
          </Card>
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

