import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Searchbar, FAB } from 'react-native-paper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CourseForm, CoursesList, EmptyState } from './components';
import { styles } from './styles';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const AdminCoursesScreen = ({ navigation }: Props) => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // Use refactored CRUD mutations hook
  const { useCourseMutations } = require('./consts');
  const { createMutation, updateMutation, deleteMutation, togglePublishMutation } = useCourseMutations(resetForm, setShowCreateForm, setEditingCourse);

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

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingCourse(null);
    resetForm();
  };

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
          <CourseForm
            formData={formData}
            isEditing={!!editingCourse}
            isLoading={createMutation.isPending || updateMutation.isPending}
            onFormChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
          />
        )}

        {!showCreateForm && filteredCourses.length > 0 && (
          <CoursesList
            courses={filteredCourses}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onTogglePublish={handleTogglePublish}
          />
        )}

        {!filteredCourses.length && !showCreateForm && (
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

