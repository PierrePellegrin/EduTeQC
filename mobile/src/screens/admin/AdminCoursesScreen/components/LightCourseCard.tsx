import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type LightCourseCardProps = {
  course: {
    id: string;
    title: string;
    description: string;
    category: string;
    isPublished: boolean;
    _count?: {
      tests: number;
    };
  };
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
  themeColors: any;
};

const LightCourseCardComponent: React.FC<LightCourseCardProps> = ({
  course,
  onEdit,
  onDelete,
  onTogglePublish,
  themeColors,
}) => {

  return (
    <View style={[styles.card, { backgroundColor: themeColors.cardBackground }]}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={[styles.title, { color: themeColors.onCardBackground }]} numberOfLines={2}>
            {course.title}
          </Text>
          <Text style={[styles.description, { color: themeColors.onCardBackground }]} numberOfLines={1}>
            {course.description}
          </Text>
          
          <View style={styles.chips}>
            <View style={[styles.chip, { backgroundColor: themeColors.primary + '20' }]}>
              <Icon name="tag" size={14} color={themeColors.primary} />
              <Text style={[styles.chipText, { color: themeColors.primary }]}>{course.category}</Text>
            </View>
            
            {course._count?.tests && course._count.tests > 0 && (
              <View style={[styles.chip, { backgroundColor: themeColors.primary + '20' }]}>
                <Icon name="file-document" size={14} color={themeColors.primary} />
                <Text style={[styles.chipText, { color: themeColors.primary }]}>
                  {course._count.tests} test{course._count.tests > 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.publishButton,
              { 
                backgroundColor: course.isPublished ? 'transparent' : themeColors.primary,
                borderColor: themeColors.primary,
              }
            ]}
            onPress={onTogglePublish}
            activeOpacity={0.7}
          >
            <Icon 
              name={course.isPublished ? 'eye-off' : 'eye'} 
              size={16} 
              color={course.isPublished ? themeColors.primary : '#fff'} 
            />
            <Text style={[
              styles.publishButtonText,
              { color: course.isPublished ? themeColors.primary : '#fff' }
            ]}>
              {course.isPublished ? 'Dépublier' : 'Publier'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: themeColors.primary + '20' }]}
            onPress={onEdit}
            activeOpacity={0.7}
          >
            <Icon name="pencil" size={20} color={themeColors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: themeColors.logoutColor + '20' }]}
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <Icon name="delete" size={20} color={themeColors.logoutColor} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  publishButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actions: {
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Custom memo comparator - ne re-render que si les données du cours changent vraiment
const arePropsEqual = (prevProps: LightCourseCardProps, nextProps: LightCourseCardProps) => {
  return (
    prevProps.course.id === nextProps.course.id &&
    prevProps.course.title === nextProps.course.title &&
    prevProps.course.description === nextProps.course.description &&
    prevProps.course.category === nextProps.course.category &&
    prevProps.course.isPublished === nextProps.course.isPublished &&
    prevProps.course._count?.tests === nextProps.course._count?.tests &&
    prevProps.themeColors === nextProps.themeColors
  );
};

export const LightCourseCard = memo(LightCourseCardComponent, arePropsEqual);
