import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, IconButton, Menu, Divider } from 'react-native-paper';
import { useTheme } from '../contexts/ThemeContext';
import { CourseSection } from '../types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { sectionStyles, getSectionColors } from '../styles/sectionStyles';

type SectionTreeItemProps = {
  section: CourseSection;
  level?: number;
  onEdit: (section: CourseSection) => void;
  onDelete: (section: CourseSection) => void;
  onAddChild: (parentSection: CourseSection) => void;
  onDuplicate?: (section: CourseSection) => void;
  onManageTests?: (section: CourseSection) => void;
  onMoveUp?: (section: CourseSection) => void;
  onMoveDown?: (section: CourseSection) => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
};

export const SectionTreeItem: React.FC<SectionTreeItemProps> = ({
  section,
  level = 0,
  onEdit,
  onDelete,
  onAddChild,
  onDuplicate,
  onManageTests,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
}) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const colors = getSectionColors(theme);

  const hasChildren = section.children && section.children.length > 0;
  const indent = level * 24;

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
    <View style={styles.container}>
      <View
        style={[
          sectionStyles.treeItem,
          { backgroundColor: colors.cardBackground, marginLeft: indent },
        ]}
      >
        <View style={sectionStyles.treeItemLeftContent}>
          {hasChildren && (
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
              <MaterialCommunityIcons
                name={expanded ? 'chevron-down' : 'chevron-right'}
                size={24}
                color={colors.textColor}
              />
            </TouchableOpacity>
          )}
          {!hasChildren && <View style={sectionStyles.treeItemSpacer} />}

          <MaterialCommunityIcons
            name={hasChildren ? 'folder' : 'file-document-outline'}
            size={20}
            color={colors.iconColor}
            style={sectionStyles.treeItemIcon}
          />

          <View style={sectionStyles.treeItemTextContent}>
            <Text variant="titleSmall" numberOfLines={1}>
              {section.title}
            </Text>
            {section.content && (
              <Text
                variant="bodySmall"
                numberOfLines={1}
                style={{ color: colors.visitedTextColor }}
              >
                {section.content.substring(0, 50)}...
              </Text>
            )}
          </View>
        </View>

        <View style={sectionStyles.treeItemActions}>
          {canMoveUp && onMoveUp && (
            <IconButton
              icon="arrow-up"
              size={20}
              onPress={() => onMoveUp(section)}
            />
          )}
          {canMoveDown && onMoveDown && (
            <IconButton
              icon="arrow-down"
              size={20}
              onPress={() => onMoveDown(section)}
            />
          )}

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={20}
                onPress={() => setMenuVisible(true)}
              />
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
            {onDuplicate && (
              <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  onDuplicate(section);
                }}
                leadingIcon="content-copy"
                title="Dupliquer"
              />
            )}
            {onManageTests && (
              <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  onManageTests(section);
                }}
                leadingIcon="file-document-edit"
                title="Gérer les tests"
              />
            )}
            <Divider />
            <Menu.Item
              onPress={handleDelete}
              leadingIcon="delete"
              title="Supprimer"
              titleStyle={{ color: theme.colors.error }}
            />
          </Menu>
        </View>
      </View>

      {expanded && hasChildren && (
        <View>
          {section.children?.map((child, index) => (
            <SectionTreeItem
              key={child.id}
              section={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              onDuplicate={onDuplicate}
              onManageTests={onManageTests}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              canMoveUp={index > 0}
              canMoveDown={index < (section.children?.length || 0) - 1}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
  },
});
