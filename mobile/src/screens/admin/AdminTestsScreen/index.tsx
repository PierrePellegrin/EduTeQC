import React, { useState, useMemo, useCallback, useDeferredValue } from 'react';
import { View, FlatList, InteractionManager } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../../services/api';
import { MemoizedSegmentedButtons, CustomSearchbar } from '../../../components';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../contexts/ThemeContext';
import { TestForm, TestsList, EmptyState, AccordionGroup, FilterMenu, TestAdminFilterState } from './components';
import { styles } from './styles';
import { useTestMutations } from './consts';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

type GroupBy = 'none' | 'course' | 'category';

export const AdminTestsScreen = ({ navigation }: Props) => {
  // Single useTheme() call at parent level
  const { theme } = useTheme();
  const themeColors = useMemo(() => ({
    cardBackground: theme.colors.cardBackground,
    onCardBackground: theme.colors.onCardBackground,
    logoutColor: theme.colors.logoutColor,
    primary: theme.colors.primary,
    outline: theme.colors.outline,
  }), [theme]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);
  const [courseMenuVisible, setCourseMenuVisible] = useState(false);
  const [filters, setFilters] = useState<TestAdminFilterState>({
    search: '',
    course: null,
    category: null,
  });
  const deferredSearchQuery = useDeferredValue(filters.search);
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  // Initialize all groups as CLOSED for performance
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
    queryKey: ['adminTests', 'v2'], // v2: Added category to course data
    queryFn: adminApi.getAllTests,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: courses } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: adminApi.getAllCourses,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

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

  const { createMutation, updateMutation, deleteMutation, togglePublishMutation } = useTestMutations(
    resetForm,
    setShowCreateForm,
    setEditingTest
  );

  // Wrap mutations with InteractionManager to prevent UI blocking
  const handleSubmit = useCallback(() => {
    const data = {
      title: formData.title,
      description: formData.description,
      courseId: formData.courseId,
      duration: parseInt(formData.duration),
      passingScore: parseInt(formData.passingScore),
      imageUrl: formData.imageUrl || undefined,
    };

    InteractionManager.runAfterInteractions(() => {
      if (editingTest) {
        updateMutation?.mutate({ id: editingTest.id, data });
      } else {
        createMutation?.mutate(data);
      }
    });
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
    InteractionManager.runAfterInteractions(() => {
      deleteMutation?.mutate(id);
    });
  }, [deleteMutation]);

  const handleTogglePublish = useCallback((id: string, currentStatus: boolean, title: string) => {
    const newStatus = !currentStatus;
    InteractionManager.runAfterInteractions(() => {
      togglePublishMutation?.mutate({ id, data: { isPublished: newStatus } });
    });
  }, [togglePublishMutation]);

  const handleNavigateToQuestions = useCallback((testId: string, testTitle: string) => {
    navigation.navigate('AdminQuestions', { testId, testTitle });
  }, [navigation]);

  const handleCancelForm = useCallback(() => {
    setShowCreateForm(false);
    setEditingTest(null);
    resetForm();
  }, [resetForm]);

  // Extract unique courses and categories for filters
  const { uniqueCourses, uniqueCategories } = useMemo(() => {
    const allTests = tests?.tests || [];
    const coursesSet = new Set<string>();
    const categoriesSet = new Set<string>();

    allTests.forEach((test: any) => {
      if (test.course?.title) {
        coursesSet.add(test.course.title);
      }
      if (test.course?.category) {
        categoriesSet.add(test.course.category);
      }
    });

    return {
      uniqueCourses: Array.from(coursesSet).sort(),
      uniqueCategories: Array.from(categoriesSet).sort(),
    };
  }, [tests?.tests]);

  // Filter tests (using deferred search query)
  const filteredTests = useMemo(() => {
    const allTests = tests?.tests || [];
    
    return allTests.filter((test: any) => {
      // Search filter
      if (deferredSearchQuery) {
        const query = deferredSearchQuery.toLowerCase();
        const matchesSearch =
          test.title.toLowerCase().includes(query) ||
          test.description?.toLowerCase().includes(query) ||
          test.course?.title?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Course filter
      if (filters.course && test.course?.title !== filters.course) {
        return false;
      }

      // Category filter
      if (filters.category && test.course?.category !== filters.category) {
        return false;
      }

      return true;
    });
  }, [tests?.tests, deferredSearchQuery, filters.course, filters.category]);

  // Group tests
  const groupedTests = useMemo(() => {
    if (groupBy === 'none') {
      return [{ key: 'all', title: 'Tous', data: filteredTests }];
    }

    const groups: Record<string, any[]> = {};

    if (groupBy === 'course') {
      filteredTests.forEach((test: any) => {
        const key = test.course?.title || 'Sans cours';
        if (!groups[key]) groups[key] = [];
        groups[key].push(test);
      });
    } else if (groupBy === 'category') {
      filteredTests.forEach((test: any) => {
        const key = test.course?.category || 'Sans matière';
        if (!groups[key]) groups[key] = [];
        groups[key].push(test);
      });
    }

    return Object.entries(groups).map(([key, data]) => ({ key, title: key, data }));
  }, [filteredTests, groupBy]);

  const toggleGroup = useCallback((groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  }, []);

  // FlatList render functions
  const renderTestItem = useCallback(({ item }: { item: any }) => (
    <TestsList
      tests={[item]}
      themeColors={themeColors}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onTogglePublish={handleTogglePublish}
      onNavigateToQuestions={handleNavigateToQuestions}
    />
  ), [themeColors, handleEdit, handleDelete, handleTogglePublish, handleNavigateToQuestions]);

  const renderGroupItem = useCallback(({ item }: { item: { key: string; title: string; data: any[] } }) => {
    if (groupBy === 'none') {
      return null; // Will use FlatList directly
    }

    const icon = 
      groupBy === 'course' ? 'book-open-variant' : 'shape';
    // Groups are CLOSED by default for performance
    const isExpanded = expandedGroups[item.key] === true;

    return (
      <AccordionGroup
        title={item.title}
        count={item.data.length}
        icon={icon}
        expanded={isExpanded}
        themeColors={themeColors}
        onToggle={() => toggleGroup(item.key)}
      >
        <TestsList
          tests={item.data}
          themeColors={themeColors}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePublish={handleTogglePublish}
          onNavigateToQuestions={handleNavigateToQuestions}
        />
      </AccordionGroup>
    );
  }, [groupBy, expandedGroups, themeColors, toggleGroup, handleEdit, handleDelete, handleTogglePublish, handleNavigateToQuestions]);

  const keyExtractor = useCallback((item: any, index: number) => {
    return item.id || item.key || index.toString();
  }, []);

  // Optimized getItemLayout for FlatList - enables instant scroll to any position
  const getItemLayout = useCallback((_: any, index: number) => ({
    length: 100, // Approximate item height
    offset: 100 * index,
    index,
  }), []);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text variant="titleLarge">Chargement des tests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FilterMenu
        filters={filters}
        onFiltersChange={setFilters}
        courses={uniqueCourses}
        categories={uniqueCategories}
      />

      {!showCreateForm && filteredTests.length > 0 && (
        <MemoizedSegmentedButtons
          value={groupBy}
          onValueChange={(value) => setGroupBy(value as GroupBy)}
          buttons={[
            { value: 'none', label: 'Tous', icon: 'view-list' },
            { value: 'course', label: 'Cours', icon: 'book-open-variant' },
            { value: 'category', label: 'Matière', icon: 'shape' },
          ]}
          style={styles.segmentedButtons}
        />
      )}

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
        <FlatList
          data={filteredTests}
          renderItem={renderTestItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          windowSize={5}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={true}
          initialNumToRender={8}
          contentContainerStyle={styles.content}
        />
      )}

      {!showCreateForm && filteredTests.length > 0 && groupBy !== 'none' && (
        <FlatList
          data={groupedTests}
          renderItem={renderGroupItem}
          keyExtractor={keyExtractor}
          windowSize={5}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={true}
          initialNumToRender={4}
          contentContainerStyle={styles.content}
        />
      )}

      {!showCreateForm && !filteredTests.length && (
        <EmptyState hasSearchQuery={!!deferredSearchQuery} />
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
