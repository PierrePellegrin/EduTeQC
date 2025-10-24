import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  FAB,
  Portal,
  Modal,
  ActivityIndicator,
  Button,
  Divider,
  Card,
  SegmentedButtons,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import { CourseSection } from '../../types';
import { SectionTreeItem } from '../../components/SectionTreeItem';
import { SectionEditor } from '../../components/SectionEditor';
import { SectionTestsManager } from '../../components/SectionTestsManager';
import { SectionTreeDraggable } from '../../components/SectionTreeDraggable';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { courseId: string; courseTitle: string } }, 'params'>;
};

export const CourseSectionsEditorScreen = ({ navigation, route }: Props) => {
  const { courseId, courseTitle } = route.params;
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  const [editorVisible, setEditorVisible] = useState(false);
  const [editingSection, setEditingSection] = useState<CourseSection | undefined>();
  const [parentSection, setParentSection] = useState<CourseSection | undefined>();
  const [testsManagerVisible, setTestsManagerVisible] = useState(false);
  const [managingTestsSection, setManagingTestsSection] = useState<CourseSection | undefined>();
  const [viewMode, setViewMode] = useState<'tree' | 'drag'>('tree');

  // Récupérer les sections
  const {
    data: sections = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-course-sections', courseId],
    queryFn: () => adminApi.getCourseSections(courseId),
  });

  // Mutation pour créer une section
  const createMutation = useMutation({
    mutationFn: (data: { title: string; content: string; parentId?: string }) =>
      adminApi.createSection(courseId, {
        ...data,
        order: 0, // Le backend calculera l'ordre approprié
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-course-sections', courseId] });
      setEditorVisible(false);
      setEditingSection(undefined);
      setParentSection(undefined);
      Alert.alert('Succès', 'Section créée avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la création');
    },
  });

  // Mutation pour mettre à jour une section
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title: string; content: string } }) =>
      adminApi.updateSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-course-sections', courseId] });
      setEditorVisible(false);
      setEditingSection(undefined);
      setParentSection(undefined);
      Alert.alert('Succès', 'Section mise à jour avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });

  // Mutation pour supprimer une section
  const deleteMutation = useMutation({
    mutationFn: (sectionId: string) => adminApi.deleteSection(sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-course-sections', courseId] });
      Alert.alert('Succès', 'Section supprimée avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });

  // Mutation pour dupliquer une section
  const duplicateMutation = useMutation({
    mutationFn: async (section: CourseSection) => {
      // Créer une copie de la section
      const duplicateData = {
        title: `${section.title} (copie)`,
        content: section.content || '',
        parentId: section.parentId || undefined,
        order: section.order + 1,
      };
      return adminApi.createSection(courseId, duplicateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-course-sections', courseId] });
      Alert.alert('Succès', 'Section dupliquée avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la duplication');
    },
  });

  const handleSave = async (data: { title: string; content: string; parentId?: string }) => {
    if (editingSection) {
      await updateMutation.mutateAsync({
        id: editingSection.id,
        data: { title: data.title, content: data.content },
      });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleEdit = (section: CourseSection) => {
    setEditingSection(section);
    setParentSection(undefined);
    setEditorVisible(true);
  };

  const handleDelete = (section: CourseSection) => {
    deleteMutation.mutate(section.id);
  };

  const handleAddChild = (parent: CourseSection) => {
    setEditingSection(undefined);
    setParentSection(parent);
    setEditorVisible(true);
  };

  const handleAddRoot = () => {
    setEditingSection(undefined);
    setParentSection(undefined);
    setEditorVisible(true);
  };

  const handleManageTests = (section: CourseSection) => {
    setManagingTestsSection(section);
    setTestsManagerVisible(true);
  };

  const handleDuplicate = (section: CourseSection) => {
    Alert.alert(
      'Dupliquer la section',
      `Voulez-vous dupliquer "${section.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Dupliquer',
          onPress: () => duplicateMutation.mutate(section),
        },
      ]
    );
  };

  const handleReorder = async (reorderedSections: CourseSection[]) => {
    // Mettre à jour l'ordre des sections
    const sectionsWithOrder = reorderedSections.map((section, index) => ({
      id: section.id,
      order: index,
      parentId: section.parentId || null,
    }));

    try {
      await adminApi.reorderSections(sectionsWithOrder);
      queryClient.invalidateQueries({ queryKey: ['admin-course-sections', courseId] });
    } catch (error: any) {
      Alert.alert('Erreur', 'Impossible de réorganiser les sections');
    }
  };

  const buildTree = (sections: CourseSection[]): CourseSection[] => {
    const map = new Map<string, CourseSection>();
    const roots: CourseSection[] = [];

    sections.forEach((section) => {
      map.set(section.id, { ...section, children: [] });
    });

    sections.forEach((section) => {
      const node = map.get(section.id)!;
      if (section.parentId) {
        const parent = map.get(section.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    const sortByOrder = (items: CourseSection[]) => {
      return items.sort((a, b) => a.order - b.order).map((item) => {
        if (item.children && item.children.length > 0) {
          item.children = sortByOrder(item.children);
        }
        return item;
      });
    };

    return sortByOrder(roots);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Chargement des sections...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text variant="titleMedium" style={{ color: theme.colors.error }}>
          Erreur lors du chargement
        </Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          Retour
        </Button>
      </View>
    );
  }

  const tree = buildTree(sections);

  return (
    <View style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Édition des sections de :
          </Text>
          <Text variant="titleLarge" style={{ marginTop: 4 }}>
            {courseTitle}
          </Text>
          <Divider style={{ marginVertical: 12 }} />
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Organisez le contenu de votre cours en sections et sous-sections. Chaque section peut
            contenir du texte formaté en Markdown.
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.viewModeToggle}>
        <SegmentedButtons
          value={viewMode}
          onValueChange={(value) => setViewMode(value as 'tree' | 'drag')}
          buttons={[
            { value: 'tree', label: 'Arbre', icon: 'file-tree' },
            { value: 'drag', label: 'Réorganiser', icon: 'drag' },
          ]}
        />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {tree.length === 0 ? (
          <Card style={[styles.emptyCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Card.Content>
              <Text variant="titleMedium" style={{ textAlign: 'center', marginBottom: 8 }}>
                Aucune section
              </Text>
              <Text
                variant="bodyMedium"
                style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}
              >
                Cliquez sur le bouton + pour créer la première section de ce cours
              </Text>
            </Card.Content>
          </Card>
        ) : viewMode === 'tree' ? (
          tree.map((section, index) => (
            <SectionTreeItem
              key={section.id}
              section={section}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddChild={handleAddChild}
              onDuplicate={handleDuplicate}
              onManageTests={handleManageTests}
              canMoveUp={index > 0}
              canMoveDown={index < tree.length - 1}
            />
          ))
        ) : (
          <SectionTreeDraggable
            sections={tree}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddChild={handleAddChild}
            onDuplicate={handleDuplicate}
            onManageTests={handleManageTests}
            onReorder={handleReorder}
          />
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddRoot}
        label="Nouvelle section"
      />

      <Portal>
        <Modal
          visible={editorVisible}
          onDismiss={() => {
            setEditorVisible(false);
            setEditingSection(undefined);
            setParentSection(undefined);
          }}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.background }]}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            {editingSection ? 'Modifier la section' : 'Nouvelle section'}
          </Text>
          <SectionEditor
            section={editingSection}
            parentSection={parentSection}
            onSave={handleSave}
            onCancel={() => {
              setEditorVisible(false);
              setEditingSection(undefined);
              setParentSection(undefined);
            }}
            loading={createMutation.isPending || updateMutation.isPending}
          />
        </Modal>

        <Modal
          visible={testsManagerVisible}
          onDismiss={() => {
            setTestsManagerVisible(false);
            setManagingTestsSection(undefined);
          }}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.background }]}
        >
          {managingTestsSection && (
            <SectionTestsManager
              sectionId={managingTestsSection.id}
              sectionTitle={managingTestsSection.title}
              courseId={courseId}
              onClose={() => {
                setTestsManagerVisible(false);
                setManagingTestsSection(undefined);
              }}
            />
          )}
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
  },
  viewModeToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 80,
  },
  emptyCard: {
    marginTop: 32,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  modal: {
    margin: 20,
    borderRadius: 8,
    maxHeight: '90%',
  },
  modalTitle: {
    padding: 16,
    paddingBottom: 8,
  },
});
