import React, { useState, useMemo, useCallback, useEffect, useDeferredValue } from 'react';
import { View, ScrollView, FlatList, Alert, InteractionManager } from 'react-native';
import { Text, FAB, SegmentedButtons } from 'react-native-paper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CourseForm, CoursesList, EmptyState, AccordionGroup, FilterMenu, CourseAdminFilterState } from './components';
import { styles } from './styles';
import { useCourseMutations } from './consts';
import { useTheme } from '../../../contexts/ThemeContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

type GroupBy = 'none' | 'category' | 'niveau' | 'cycle';

export const AdminCoursesScreen = ({ navigation }: Props) => {
  // Performance tracking
  const renderStartTime = React.useRef(Date.now());
  
  const { theme } = useTheme(); // Extraire le theme une seule fois
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [filters, setFilters] = useState<CourseAdminFilterState>({
    search: '',
    category: null,
    cycle: null,
    niveau: null,
  });
  const deferredSearchQuery = useDeferredValue(filters.search); // React 18 optimization
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

    // Utiliser InteractionManager pour ne pas bloquer l'UI
    InteractionManager.runAfterInteractions(() => {
      if (editingCourse) {
        updateMutation?.mutate({ id: editingCourse.id, data });
      } else {
        createMutation?.mutate(data);
      }
    });
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
        { 
          text: 'Supprimer', 
          style: 'destructive', 
          onPress: () => {
            // Utiliser InteractionManager pour ne pas bloquer l'UI
            InteractionManager.runAfterInteractions(() => {
              deleteMutation?.mutate(id);
            });
          }
        },
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
          onPress: () => {
            // Utiliser InteractionManager pour ne pas bloquer l'UI
            InteractionManager.runAfterInteractions(() => {
              togglePublishMutation?.mutate({ id, data: { isPublished: newStatus } });
            });
          }
        },
      ]
    );
  }, [togglePublishMutation]);

  // Extraire catégories, cycles et niveaux uniques
  const categories = useMemo(() => {
    const cats = new Set<string>();
    (courses?.courses || []).forEach((course: any) => {
      if (course.category) cats.add(course.category);
    });
    return Array.from(cats).sort();
  }, [courses?.courses]);

  const cycles = useMemo(() => {
    const cyc = new Set<string>();
    (courses?.courses || []).forEach((course: any) => {
      if (course.niveau?.cycle?.name) cyc.add(course.niveau.cycle.name);
    });
    return Array.from(cyc).sort();
  }, [courses?.courses]);

  const niveaux = useMemo(() => {
    const niv = new Set<string>();
    (courses?.courses || []).forEach((course: any) => {
      if (course.niveau?.name) niv.add(course.niveau.name);
    });
    return Array.from(niv).sort();
  }, [courses?.courses]);

  // Mémoriser le filtrage des cours avec filtres avancés
  const filteredCourses = useMemo(() => {
    let filtered = courses?.courses || [];
    
    // Filtre recherche
    if (deferredSearchQuery) {
      const query = deferredSearchQuery.toLowerCase();
      filtered = filtered.filter((course: any) =>
        course.title.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query) ||
        course.category?.toLowerCase().includes(query)
      );
    }
    
    // Filtre catégorie
    if (filters.category) {
      filtered = filtered.filter((course: any) => course.category === filters.category);
    }
    
    // Filtre cycle
    if (filters.cycle) {
      filtered = filtered.filter((course: any) => course.niveau?.cycle?.name === filters.cycle);
    }
    
    // Filtre niveau
    if (filters.niveau) {
      filtered = filtered.filter((course: any) => course.niveau?.name === filters.niveau);
    }
    
    return filtered;
  }, [courses?.courses, deferredSearchQuery, filters.category, filters.cycle, filters.niveau]);

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
      themeColors={theme.colors}
    />
  ), [handleEdit, handleDelete, handleTogglePublish, theme.colors]);

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
        themeColors={theme.colors}
      >
        {renderCoursesList(groupCourses)}
      </AccordionGroup>
    );
  }, [expandedGroups, groupBy, toggleGroup, renderCoursesList, theme.colors]);

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

  // FlatList render functions - DOIVENT être avant tout return conditionnel
  
  // Pour les groupes d'accordéons
  const renderGroupItem = useCallback(({ item }: { item: [string, any[]] }) => {
    const [groupKey, groupCourses] = item;
    return renderAccordionGroup(groupKey, groupCourses);
  }, [renderAccordionGroup]);

  const keyExtractorGroup = useCallback((item: [string, any[]]) => item[0], []);

  // Optimisation: hauteur estimée pour chaque groupe accordéon
  const getItemLayoutGroup = useCallback((data: any, index: number) => ({
    length: 80, // Hauteur header de l'accordéon (fermé)
    offset: 80 * index,
    index,
  }), []);

  // Pour les cours individuels (mode "Tous")
  const renderCourseItem = useCallback(({ item }: { item: any }) => {
    const handleEditCourse = () => handleEdit(item);
    const handleDeleteCourse = () => handleDelete(item.id, item.title);
    const handleToggleCourse = () => handleTogglePublish(item.id, item.isPublished, item.title);
    
    return (
      <View style={{ paddingHorizontal: 16 }}>
        {/* Utilise le composant LightCourseCard directement */}
        <CoursesList
          courses={[item]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePublish={handleTogglePublish}
          themeColors={theme.colors}
        />
      </View>
    );
  }, [handleEdit, handleDelete, handleTogglePublish, theme.colors]);

  const keyExtractorCourse = useCallback((item: any) => item.id, []);

  // Hauteur estimée pour chaque carte de cours
  const getItemLayoutCourse = useCallback((data: any, index: number) => ({
    length: 200, // Hauteur estimée d'une carte
    offset: 200 * index,
    index,
  }), []);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text variant="titleLarge">Chargement des cours...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FilterMenu
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        cycles={cycles}
        niveaux={niveaux}
      />

      {!showCreateForm && filteredCourses.length > 0 && (
        <View style={styles.header}>
          <SegmentedButtons
            value={groupBy}
            onValueChange={handleGroupByChange}
            buttons={segmentedButtonsConfig}
            style={styles.segmentedButtons}
          />
        </View>
      )}

      {showCreateForm ? (
        <ScrollView contentContainerStyle={styles.content}>
          <CourseForm
            formData={formData}
            isEditing={!!editingCourse}
            isLoading={(createMutation?.isPending || false) || (updateMutation?.isPending || false)}
            onFormChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
          />
        </ScrollView>
      ) : filteredCourses.length > 0 && groupBy === 'none' ? (
        <FlatList
          data={filteredCourses}
          renderItem={renderCourseItem}
          keyExtractor={keyExtractorCourse}
          getItemLayout={getItemLayoutCourse}
          contentContainerStyle={styles.content}
          windowSize={5}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={true}
          initialNumToRender={10}
        />
      ) : filteredCourses.length > 0 && groupBy !== 'none' ? (
        <FlatList
          data={groupEntries}
          renderItem={renderGroupItem}
          keyExtractor={keyExtractorGroup}
          getItemLayout={getItemLayoutGroup}
          contentContainerStyle={styles.content}
          windowSize={5}
          maxToRenderPerBatch={3}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={true}
          initialNumToRender={3}
        />
      ) : (
        !showCreateForm && (
          <ScrollView contentContainerStyle={styles.content}>
            <EmptyState hasSearchQuery={!!filters.search} />
          </ScrollView>
        )
      )}

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

