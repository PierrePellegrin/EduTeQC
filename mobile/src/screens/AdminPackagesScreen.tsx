import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, TextInput, FAB, IconButton, Chip, Searchbar, Checkbox } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';

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

  const createMutation = useMutation({
    mutationFn: adminApi.createPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPackages'] });
      setShowCreateForm(false);
      resetForm();
      Alert.alert('Succès', 'Package créé avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la création');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => adminApi.updatePackage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPackages'] });
      setEditingPackage(null);
      resetForm();
      Alert.alert('Succès', 'Package mis à jour avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deletePackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPackages'] });
      Alert.alert('Succès', 'Package supprimé avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      adminApi.updatePackage(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPackages'] });
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la modification');
    },
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

  const handleEdit = (pkg: any) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description || '',
      price: pkg.price.toString(),
      imageUrl: pkg.imageUrl || '',
    });
    setSelectedCourses(pkg.courses?.map((c: any) => c.courseId) || []);
    setShowCreateForm(true);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Confirmer la suppression',
      `Voulez-vous vraiment supprimer le package "${name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
      ]
    );
  };

  const handleToggleActive = (id: string, currentStatus: boolean, name: string) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'activer' : 'désactiver';
    
    Alert.alert(
      'Confirmer',
      `Voulez-vous ${action} le package "${name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: newStatus ? 'Activer' : 'Désactiver', 
          onPress: () => toggleActiveMutation.mutate({ id, isActive: newStatus })
        },
      ]
    );
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

              {courses?.courses?.map((course: any) => (
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
                      <Chip 
                        icon={pkg.isActive ? 'check-circle' : 'cancel'}
                        style={[
                          styles.statusChip,
                          { backgroundColor: pkg.isActive ? theme.colors.successContainer : theme.colors.errorContainer }
                        ]}
                        textStyle={{ 
                          color: pkg.isActive ? theme.colors.onSuccessContainer : theme.colors.onErrorContainer 
                        }}
                        compact
                      >
                        {pkg.isActive ? 'Actif' : 'Inactif'}
                      </Chip>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  content: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 80,
  },
  formCard: {
    marginBottom: 16,
  },
  formTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
  },
  checkbox: {
    paddingVertical: 4,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
  packagesList: {
    gap: 12,
  },
  packageCard: {
    marginBottom: 12,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  packageInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  packageTitleText: {
    flex: 1,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  packageMeta: {
    marginTop: 4,
    opacity: 0.7,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  chip: {
    marginLeft: 4,
  },
  coursesLabel: {
    marginTop: 12,
    marginBottom: 4,
    opacity: 0.8,
  },
  courseItem: {
    marginLeft: 8,
    opacity: 0.7,
  },
  activeButton: {
    marginTop: 12,
  },
  packageActions: {
    flexDirection: 'row',
    gap: 4,
  },
  emptyCard: {
    marginTop: 32,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
