import React, { useState, useMemo, useCallback } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Searchbar, FAB, SegmentedButtons, List } from 'react-native-paper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TestForm, TestsList, EmptyState } from './components';
import { styles } from './styles';
import { useTestMutations } from './consts';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

type GroupBy = 'none' | 'course' | 'niveau' | 'cycle';

export const AdminTestsScreen = ({ navigation }: Props) => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);
  const [courseMenuVisible, setCourseMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  
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
  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      courseId: '',
      duration: '',
      passingScore: '',
	  imageUrl: '',
    });
  }, []);

  // Use refactored CRUD mutations hook
  const { createMutation, updateMutation, deleteMutation, togglePublishMutation } = useTestMutations(resetForm, setShowCreateForm, setEditingTest);

  const handleSubmit = useCallback(() => {
    const data = {
      title: formData.title,
      description: formData.description,
      courseId: formData.courseId,
      duration: parseInt(formData.duration),
      passingScore: parseInt(formData.passingScore),
      imageUrl: formData.imageUrl || undefined,
    };

    if (editingTest) {
      updateMutation?.mutate({ id: editingTest.id, data });
    } else {
      createMutation?.mutate(data);
    }
  }, [formData, editingTest, createMutation, updateMutation]);

  const handleEdit = useCallback((test: any) => {
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
  }, []);

  const handleDelete = useCallback((id: string, title: string) => {
    Alert.alert(
      'Confirmer la suppression',
      `Voulez-vous vraiment supprimer le test "${title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => deleteMutation?.mutate(id) },
      ]
    );
  }, [deleteMutation]);

  const handleTogglePublish = useCallback((id: string, currentStatus: boolean, title: string) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'publier' : 'dépublier';
    
    Alert.alert(
      'Confirmer',
      `Voulez-vous ${action} le test "${title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: newStatus ? 'Publier' : 'Dépublier', 
          onPress: () => togglePublishMutation?.mutate({ id, data: { isPublished: newStatus } })
        },
      ]
    );
  }, [togglePublishMutation]);

  const handleNavigateToQuestions = useCallback((testId: string, testTitle: string) => {
    navigation.navigate('AdminQuestions', { testId, testTitle });
  }, [navigation]);

  const handleCancelForm = useCallback(() => {
    setShowCreateForm(false);
    setEditingTest(null);
    resetForm();
  }, [resetForm]);

  // Mémoriser le filtrage des tests
  const filteredTests = useMemo(() => {
    const allTests = tests?.tests || [];
    if (!searchQuery) return allTests;
    
    const query = searchQuery.toLowerCase();
    return allTests.filter((test: any) =>
      test.title.toLowerCase().includes(query) ||
      test.description?.toLowerCase().includes(query) ||
      test.course?.title?.toLowerCase().includes(query)
    );
  }, [tests?.tests, searchQuery]);

  // Regroupement des tests
  const groupedTests = useMemo(() => {
    if (groupBy === 'none') {
      return { 'all': filteredTests };
    }

    const groups: Record<string, any[]> = {};

    if (groupBy === 'course') {
      filteredTests.forEach((test: any) => {
        const key = test.course?.title || 'Sans cours';
        if (!groups[key]) groups[key] = [];
        groups[key].push(test);
      });
    } else if (groupBy === 'niveau') {
      filteredTests.forEach((test: any) => {
        const key = test.course?.niveau?.name || 'Sans niveau';
        if (!groups[key]) groups[key] = [];
        groups[key].push(test);
      });
    } else if (groupBy === 'cycle') {
      filteredTests.forEach((test: any) => {
        const key = test.course?.niveau?.cycle?.name || 'Sans cycle';
        if (!groups[key]) groups[key] = [];
        groups[key].push(test);
      });
    }

    return groups;
  }, [filteredTests, groupBy]);

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

  const renderTestsList = useCallback((testsToRender: any[]) => (
    <TestsList
      tests={testsToRender}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onTogglePublish={handleTogglePublish}
      onNavigateToQuestions={handleNavigateToQuestions}
    />
  ), [handleEdit, handleDelete, handleTogglePublish, handleNavigateToQuestions]);

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
              { value: 'course', label: 'Cours', icon: 'book-open-variant' },
              { value: 'niveau', label: 'Niveau', icon: 'school' },
              { value: 'cycle', label: 'Cycle', icon: 'repeat' },
            ]}
            style={styles.segmentedButtons}
          />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {showCreateForm && (
          <TestForm
            formData={formData}
            courses={courses?.courses || []}
            courseMenuVisible={courseMenuVisible}
            isEditing={!!editingTest}
            isLoading={(createMutation?.isPending || false) || (updateMutation?.isPending || false)}
            onFormChange={setFormData}
            onCourseMenuToggle={setCourseMenuVisible}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
          />
        )}

        {!showCreateForm && filteredTests.length > 0 && groupBy === 'none' && (
          renderTestsList(filteredTests)
        )}

        {!showCreateForm && filteredTests.length > 0 && groupBy !== 'none' && (
          <View>
            {Object.entries(groupedTests).map(([groupKey, groupTests]) => (
              <List.Accordion
                key={groupKey}
                title={`${groupKey} (${groupTests.length})`}
                left={props => <List.Icon {...props} icon={
                  groupBy === 'course' ? 'book-open-variant' :
                  groupBy === 'niveau' ? 'school' : 'repeat'
                } />}
                expanded={expandedGroups[groupKey] !== false}
                onPress={() => toggleGroup(groupKey)}
                style={styles.accordion}
              >
                {renderTestsList(groupTests)}
              </List.Accordion>
            ))}
          </View>
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

