import React, { useState, useMemo, useCallback } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Searchbar, FAB, SegmentedButtons, List } from 'react-native-paper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CourseForm, CoursesList, EmptyState } from './components';
import { styles } from './styles';
import { useCourseMutations } from './consts';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

type GroupBy = 'none' | 'category' | 'niveau' | 'cycle';

export const AdminCoursesScreen = ({ navigation }: Props) => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  
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

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      category: '',
      content: '',
      imageUrl: '',
    });
  }, []);

  // Use refactored CRUD mutations hook
  const { createMutation, updateMutation, deleteMutation, togglePublishMutation } = useCourseMutations(resetForm, setShowCreateForm, setEditingCourse);

  const handleSubmit = useCallback(() => {
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
      updateMutation?.mutate({ id: editingCourse.id, data });
    } else {
      createMutation?.mutate(data);
    }
  }, [formData, editingCourse, createMutation, updateMutation]);

  const handleEdit = useCallback((course: any) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      category: course.category,
      content: course.content || '',
      imageUrl: course.imageUrl || '',
    });
    setShowCreateForm(true);
  }, []);

  const handleDelete = useCallback((id: string, title: string) => {
    Alert.alert(
      'Confirmer la suppression',
      `Voulez-vous vraiment supprimer le cours "${title}" ?\nCela supprimera également tous les tests associés.`,
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
      `Voulez-vous ${action} le cours "${title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: newStatus ? 'Publier' : 'Dépublier', 
          onPress: () => togglePublishMutation?.mutate({ id, data: { isPublished: newStatus } })
        },
      ]
    );
  }, [togglePublishMutation]);

  // Mémoriser le filtrage des cours
  const filteredCourses = useMemo(() => {
    const allCourses = courses?.courses || [];
    if (!searchQuery) return allCourses;
    
    const query = searchQuery.toLowerCase();
    return allCourses.filter((course: any) =>
      course.title.toLowerCase().includes(query) ||
      course.description?.toLowerCase().includes(query) ||
      course.category?.toLowerCase().includes(query)
    );
  }, [courses?.courses, searchQuery]);

  // Regroupement des cours
  const groupedCourses = useMemo(() => {
    if (groupBy === 'none') {
      return { 'all': filteredCourses };
    }

    const groups: Record<string, any[]> = {};

    if (groupBy === 'category') {
      filteredCourses.forEach((course: any) => {
        const key = course.category || 'Sans catégorie';
        if (!groups[key]) groups[key] = [];
        groups[key].push(course);
      });
    } else if (groupBy === 'niveau') {
      filteredCourses.forEach((course: any) => {
        const key = course.niveau?.name || 'Sans niveau';
        if (!groups[key]) groups[key] = [];
        groups[key].push(course);
      });
    } else if (groupBy === 'cycle') {
      filteredCourses.forEach((course: any) => {
        const key = course.niveau?.cycle?.name || 'Sans cycle';
        if (!groups[key]) groups[key] = [];
        groups[key].push(course);
      });
    }

    return groups;
  }, [filteredCourses, groupBy]);

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

  const handleCancelForm = useCallback(() => {
    setShowCreateForm(false);
    setEditingCourse(null);
    resetForm();
  }, [resetForm]);

  const renderCoursesList = useCallback((coursesToRender: any[]) => (
    <CoursesList
      courses={coursesToRender}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onTogglePublish={handleTogglePublish}
    />
  ), [handleEdit, handleDelete, handleTogglePublish]);

  const renderAccordionGroup = useCallback((groupKey: string, groupCourses: any[]) => {
    const isExpanded = expandedGroups[groupKey] !== false;
    return (
      <List.Accordion
        key={groupKey}
        title={`${groupKey} (${groupCourses.length})`}
        left={props => <List.Icon {...props} icon={
          groupBy === 'category' ? 'folder' :
          groupBy === 'niveau' ? 'school' : 'repeat'
        } />}
        expanded={isExpanded}
        onPress={() => toggleGroup(groupKey)}
        style={styles.accordion}
      >
        {isExpanded && renderCoursesList(groupCourses)}
      </List.Accordion>
    );
  }, [expandedGroups, groupBy, toggleGroup, renderCoursesList]);

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
              { value: 'category', label: 'Matière', icon: 'folder' },
              { value: 'niveau', label: 'Niveau', icon: 'school' },
              { value: 'cycle', label: 'Cycle', icon: 'repeat' },
            ]}
            style={styles.segmentedButtons}
          />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {showCreateForm && (
          <CourseForm
            formData={formData}
            isEditing={!!editingCourse}
            isLoading={(createMutation?.isPending || false) || (updateMutation?.isPending || false)}
            onFormChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
          />
        )}

        {!showCreateForm && filteredCourses.length > 0 && groupBy === 'none' && (
          renderCoursesList(filteredCourses)
        )}

        {!showCreateForm && filteredCourses.length > 0 && groupBy !== 'none' && (
          <View>
            {Object.entries(groupedCourses).map(([groupKey, groupCourses]) => 
              renderAccordionGroup(groupKey, groupCourses)
            )}
          </View>
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

