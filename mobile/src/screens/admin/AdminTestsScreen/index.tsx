import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Searchbar, FAB } from 'react-native-paper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TestForm, TestsList, EmptyState } from './components';
import { styles } from './styles';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const AdminTestsScreen = ({ navigation }: Props) => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);
  const [courseMenuVisible, setCourseMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    duration: '',
    passingScore: '',
    imageUrl: '',
  });

  const { data: tests, isLoading } = useQuery({
    queryKey: ['adminTests'],
    queryFn: adminApi.getAllTests,
  });

  const { data: courses } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: adminApi.getAllCourses,
  });

  // ...existing code...
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      courseId: '',
      duration: '',
      passingScore: '',
	  imageUrl: '',
    });
  };

  // Use refactored CRUD mutations hook
  const { useTestMutations } = require('./consts');
  const { createMutation, updateMutation, deleteMutation, togglePublishMutation } = useTestMutations(resetForm, setShowCreateForm, setEditingTest);

  const handleSubmit = () => {
    const data = {
      title: formData.title,
      description: formData.description,
      courseId: formData.courseId,
      duration: parseInt(formData.duration),
      passingScore: parseInt(formData.passingScore),
      imageUrl: formData.imageUrl || undefined,
    };

    if (editingTest) {
      updateMutation.mutate({ id: editingTest.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (test: any) => {
    setEditingTest(test);
    setFormData({
      title: test.title,
      description: test.description || '',
      courseId: test.courseId,
      duration: test.duration.toString(),
      passingScore: test.passingScore.toString(),
      imageUrl: test.imageUrl || '',
    });
    setShowCreateForm(true);
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Confirmer la suppression',
      `Voulez-vous vraiment supprimer le test "${title}" ?`,
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
      `Voulez-vous ${action} le test "${title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: newStatus ? 'Publier' : 'Dépublier', 
          onPress: () => togglePublishMutation.mutate({ id, isPublished: newStatus })
        },
      ]
    );
  };

  const handleNavigateToQuestions = (testId: string, testTitle: string) => {
    navigation.navigate('AdminQuestions', { testId, testTitle });
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingTest(null);
    resetForm();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const filteredTests = tests?.tests?.filter((test: any) =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.course?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Rechercher un test..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {showCreateForm && (
          <TestForm
            formData={formData}
            courses={courses?.courses || []}
            courseMenuVisible={courseMenuVisible}
            isEditing={!!editingTest}
            isLoading={createMutation.isPending || updateMutation.isPending}
            onFormChange={setFormData}
            onCourseMenuToggle={setCourseMenuVisible}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
          />
        )}

        {filteredTests.length > 0 && (
          <TestsList
            tests={filteredTests}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onTogglePublish={handleTogglePublish}
            onNavigateToQuestions={handleNavigateToQuestions}
          />
        )}

        {!filteredTests.length && !showCreateForm && (
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

