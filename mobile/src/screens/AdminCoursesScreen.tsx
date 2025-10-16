import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, TextInput, FAB, IconButton, Chip, Searchbar } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';
import { styles } from './adminCoursesScreen.styles';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const AdminCoursesScreen = ({ navigation }: Props) => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    content: '',
    imageUrl: '',
  });

  const { data: courses, isLoading } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: adminApi.getAllCourses,
  });


  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      content: '',
      imageUrl: '',
    });
  };

  // Import mutations from extracted hook
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useCourseMutations } = require('./adminCoursesScreen.consts');
  const { createMutation, updateMutation, deleteMutation, togglePublishMutation } = useCourseMutations(queryClient, resetForm, setShowCreateForm, setEditingCourse);

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.category || !formData.content) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const data = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      content: formData.content,
      imageUrl: formData.imageUrl || undefined,
    };

    if (editingCourse) {
      updateMutation.mutate({ id: editingCourse.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      category: course.category,
      content: course.content || '',
      imageUrl: course.imageUrl || '',
    });
    setShowCreateForm(true);
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Confirmer la suppression',
      `Voulez-vous vraiment supprimer le cours "${title}" ?\nCela supprimera également tous les tests associés.`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
      ]
    );
  };

  const handleTogglePublish = (id: string, currentStatus: boolean, title: string) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'publier' : 'dépublier';
    
    Alert.alert(
      'Confirmer',
      `Voulez-vous ${action} le cours "${title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: newStatus ? 'Publier' : 'Dépublier', 
          onPress: () => togglePublishMutation.mutate({ id, isPublished: newStatus })
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const filteredCourses = courses?.courses?.filter((course: any) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Rechercher un cours..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {showCreateForm && (
          <Card style={[styles.formCard, { backgroundColor: theme.colors.cardBackground }]}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.formTitle}>
                {editingCourse ? 'Modifier le cours' : 'Créer un nouveau cours'}
              </Text>

              <TextInput
                label="Titre du cours *"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
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
                label="Catégorie *"
                value={formData.category}
                onChangeText={(text) => setFormData({ ...formData, category: text })}
                mode="outlined"
                placeholder="Ex: Programmation, Mathématiques, Sciences..."
                style={styles.input}
              />

              <TextInput
                label="Contenu du cours *"
                value={formData.content}
                onChangeText={(text) => setFormData({ ...formData, content: text })}
                mode="outlined"
                multiline
                numberOfLines={6}
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

              <View style={styles.formActions}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setShowCreateForm(false);
                    setEditingCourse(null);
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
                  {editingCourse ? 'Mettre à jour' : 'Créer'}
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        <View style={styles.coursesList}>
          {filteredCourses.map((course: any) => (
            <Card key={course.id} style={[styles.courseCard, { backgroundColor: theme.colors.cardBackground }]}>
              <Card.Content>
                <View style={styles.courseHeader}>
                  <View style={styles.courseInfo}>
                    <View style={styles.titleRow}>
                      <Text variant="titleLarge" style={[styles.courseTitleText, { color: theme.colors.onCardBackground }]}>
                        {course.title}
                      </Text>
                    </View>
                    <Text variant="bodyMedium" style={[styles.courseMeta, { color: theme.colors.onCardBackground }]}>
                      {course.description}
                    </Text>
                    <View style={styles.chipContainer}>
                      <Chip icon="tag" compact style={styles.chip}>
                        {course.category}
                      </Chip>
                      {course._count?.tests > 0 && (
                        <Chip icon="file-document" compact style={styles.chip}>
                          {course._count.tests} test{course._count.tests > 1 ? 's' : ''}
                        </Chip>
                      )}
                    </View>
                    <Button
                      mode={course.isPublished ? 'outlined' : 'contained'}
                      icon={course.isPublished ? 'eye-off' : 'eye'}
                      onPress={() => handleTogglePublish(course.id, course.isPublished, course.title)}
                      style={styles.publishButton}
                      compact
                    >
                      {course.isPublished ? 'Dépublier' : 'Publier'}
                    </Button>
                  </View>
                  <View style={styles.courseActions}>
                    <IconButton
                      icon="pencil"
                      mode="contained-tonal"
                      onPress={() => handleEdit(course)}
                    />
                    <IconButton
                      icon="delete"
                      mode="contained-tonal"
                      iconColor={theme.colors.logoutColor}
                      onPress={() => handleDelete(course.id, course.title)}
                    />
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {!filteredCourses.length && !showCreateForm && (
          <Card style={[styles.emptyCard, { backgroundColor: theme.colors.cardBackground }]}>
            <Card.Content>
              <Text variant="bodyLarge" style={styles.emptyText}>
                {searchQuery 
                  ? 'Aucun cours trouvé pour cette recherche.'
                  : 'Aucun cours créé. Cliquez sur le bouton + pour commencer.'}
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

