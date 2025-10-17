import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Searchbar, FAB, SegmentedButtons } from 'react-native-paper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CourseForm, CoursesList, EmptyState, AccordionGroup } from './components';
import { styles } from './styles';
import { useCourseMutations } from './consts';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

type GroupBy = 'none' | 'category' | 'niveau' | 'cycle';

export const AdminCoursesScreen = ({ navigation }: Props) => {
  // Performance tracking
  const renderStartTime = React.useRef(Date.now());
  
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    content: '',
    imageUrl: '',
  });

  const { data: courses, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: adminApi.getAllCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes - données considérées fraîches
    gcTime: 10 * 60 * 1000, // 10 minutes - garde en cache
  });

  // Log performance when data loads
  React.useEffect(() => {
    if (courses && !isLoading) {
      const renderTime = Date.now() - renderStartTime.current;
      console.log(`📊 AdminCoursesScreen: Data loaded in ${renderTime}ms`);
      console.log(`📚 Courses count: ${courses.courses?.length || 0}`);
    }
  }, [courses, isLoading]);

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

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Mémoriser le filtrage des cours
  const filteredCourses = useMemo(() => {
    const allCourses = courses?.courses || [];
    if (!debouncedSearchQuery) return allCourses;
    
    const query = debouncedSearchQuery.toLowerCase();
    return allCourses.filter((course: any) =>
      course.title.toLowerCase().includes(query) ||
      course.description?.toLowerCase().includes(query) ||
      course.category?.toLowerCase().includes(query)
    );
  }, [courses?.courses, debouncedSearchQuery]);

  // Regroupement des cours - optimisé
  const groupedCourses = useMemo(() => {
    if (groupBy === 'none') {
      return { 'all': filteredCourses };
    }

    const groups: Record<string, any[]> = {};
    
    // Utiliser reduce pour performance
    filteredCourses.reduce((acc: Record<string, any[]>, course: any) => {
      let key: string;
      
      switch (groupBy) {
        case 'category':
          key = course.category || 'Sans catégorie';
          break;
        case 'niveau':
          key = course.niveau?.name || 'Sans niveau';
          break;
        case 'cycle':
          key = course.niveau?.cycle?.name || 'Sans cycle';
          break;
        default:
          key = 'all';
      }
      
      if (!acc[key]) acc[key] = [];
      acc[key].push(course);
      return acc;
    }, groups);

    return groups;
  }, [filteredCourses, groupBy]);

  const toggleGroup = useCallback((groupKey: string) => {
    // Utiliser requestAnimationFrame pour smoother animation
    requestAnimationFrame(() => {
      setExpandedGroups(prev => ({
        ...prev,
        [groupKey]: !prev[groupKey]
      }));
    });
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

  // Mémoriser les entrées des groupes pour éviter re-calculs
  const groupEntries = useMemo(() => 
    Object.entries(groupedCourses),
    [groupedCourses]
  );

  const renderAccordionGroup = useCallback((groupKey: string, groupCourses: any[]) => {
    const isExpanded = expandedGroups[groupKey] === true;
    const icon = groupBy === 'category' ? 'folder' :
                 groupBy === 'niveau' ? 'school' : 'repeat';
    
    return (
      <AccordionGroup
        key={groupKey}
        groupKey={groupKey}
        groupCourses={groupCourses}
        isExpanded={isExpanded}
        onToggle={() => toggleGroup(groupKey)}
        icon={icon}
      >
        {renderCoursesList(groupCourses)}
      </AccordionGroup>
    );
  }, [expandedGroups, groupBy, toggleGroup, renderCoursesList]);

  const segmentedButtonsConfig = useMemo(() => [
    { value: 'none', label: 'Tous', icon: 'view-list' },
    { value: 'category', label: 'Matière', icon: 'folder' },
    { value: 'niveau', label: 'Niveau', icon: 'school' },
    { value: 'cycle', label: 'Cycle', icon: 'repeat' },
  ], []);

  const handleGroupByChange = useCallback((value: string) => {
    // Fermer tous les accordéons lors du changement de tab
    setExpandedGroups({});
    // Changer le groupBy après un court délai pour une transition plus smooth
    requestAnimationFrame(() => {
      setGroupBy(value as GroupBy);
    });
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text variant="titleLarge">Chargement des cours...</Text>
      </View>
    );
  }

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
            onValueChange={handleGroupByChange}
            buttons={segmentedButtonsConfig}
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
            {groupEntries.map(([groupKey, groupCourses]) => 
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

