import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, IconButton, Menu, Divider, useTheme } from 'react-native-paper';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { CourseSection } from '../types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

type SectionTreeDraggableProps = {
  sections: CourseSection[];
  onEdit: (section: CourseSection) => void;
  onDelete: (section: CourseSection) => void;
  onAddChild: (parentSection: CourseSection) => void;
  onDuplicate: (section: CourseSection) => void;
  onManageTests: (section: CourseSection) => void;
  onReorder: (sections: CourseSection[]) => void;
};

export const SectionTreeDraggable: React.FC<SectionTreeDraggableProps> = ({
  sections,
  onEdit,
  onDelete,
  onAddChild,
  onDuplicate,
  onManageTests,
  onReorder,
}) => {
  const theme = useTheme();

  const renderSectionItem = ({ item, drag, isActive }: RenderItemParams<CourseSection>) => {
    return (
      <ScaleDecorator>
        <SectionDraggableItem
          section={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddChild={onAddChild}
          onDuplicate={onDuplicate}
          onManageTests={onManageTests}
          onDrag={drag}
          isActive={isActive}
          theme={theme}
        />
      </ScaleDecorator>
    );
  };

  const handleDragEnd = ({ data }: { data: CourseSection[] }) => {
    'worklet';
    runOnJS(onReorder)(data);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <DraggableFlatList
        data={sections}
        onDragEnd={handleDragEnd}
        keyExtractor={(item) => item.id}
        renderItem={renderSectionItem}
        containerStyle={styles.list}
      />
    </GestureHandlerRootView>
  );
};

type SectionDraggableItemProps = {
  section: CourseSection;
  onEdit: (section: CourseSection) => void;
  onDelete: (section: CourseSection) => void;
  onAddChild: (parentSection: CourseSection) => void;
  onDuplicate: (section: CourseSection) => void;
  onManageTests: (section: CourseSection) => void;
  onDrag: () => void;
  isActive: boolean;
  theme: any;
};

const SectionDraggableItem: React.FC<SectionDraggableItemProps> = ({
  section,
  onEdit,
  onDelete,
  onAddChild,
  onDuplicate,
  onManageTests,
  onDrag,
  isActive,
  theme,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const hasChildren = section.children && section.children.length > 0;

  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert(
      'Supprimer la section',
      `Voulez-vous vraiment supprimer "${section.title}" ${hasChildren ? 'et toutes ses sous-sections' : ''}?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => onDelete(section),
        },
      ]
    );
  };

  return (
    <View
      style={[
        styles.item,
        {
          backgroundColor: isActive ? theme.colors.primaryContainer : theme.colors.surface,
          elevation: isActive ? 8 : 2,
        },
      ]}
    >
      <TouchableOpacity onLongPress={onDrag} style={styles.dragHandle}>
        <MaterialCommunityIcons name="drag-horizontal-variant" size={24} color={theme.colors.onSurfaceVariant} />
      </TouchableOpacity>

      <MaterialCommunityIcons
        name={hasChildren ? 'folder' : 'file-document-outline'}
        size={20}
        color={theme.colors.primary}
        style={styles.icon}
      />

      <View style={styles.textContent}>
        <Text variant="titleSmall" numberOfLines={1}>
          {section.title}
        </Text>
        {section.content && (
          <Text
            variant="bodySmall"
            numberOfLines={1}
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            {section.content.substring(0, 50)}...
          </Text>
        )}
        {hasChildren && (
          <Text variant="bodySmall" style={{ color: theme.colors.primary, marginTop: 4 }}>
            {section.children?.length} sous-section{(section.children?.length || 0) > 1 ? 's' : ''}
          </Text>
        )}
      </View>

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <IconButton icon="dots-vertical" size={20} onPress={() => setMenuVisible(true)} />
        }
      >
        <Menu.Item
          onPress={() => {
            setMenuVisible(false);
            onEdit(section);
          }}
          leadingIcon="pencil"
          title="Modifier"
        />
        <Menu.Item
          onPress={() => {
            setMenuVisible(false);
            onAddChild(section);
          }}
          leadingIcon="folder-plus"
          title="Ajouter sous-section"
        />
        <Menu.Item
          onPress={() => {
            setMenuVisible(false);
            onDuplicate(section);
          }}
          leadingIcon="content-copy"
          title="Dupliquer"
        />
        <Menu.Item
          onPress={() => {
            setMenuVisible(false);
            onManageTests(section);
          }}
          leadingIcon="file-document-edit"
          title="Gérer les tests"
        />
        <Divider />
        <Menu.Item
          onPress={handleDelete}
          leadingIcon="delete"
          title="Supprimer"
          titleStyle={{ color: theme.colors.error }}
        />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dragHandle: {
    padding: 8,
    marginRight: 8,
  },
  icon: {
    marginHorizontal: 8,
  },
  textContent: {
    flex: 1,
    marginRight: 8,
  },
});
