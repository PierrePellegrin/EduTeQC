import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type LightTestCardProps = {
  test: {
    id: string;
    title: string;
    description?: string;
    duration: number;
    passingScore: number;
    isPublished: boolean;
    imageUrl?: string;
    course?: {
      title: string;
    };
    _count?: {
      questions: number;
    };
  };
  themeColors: {
    cardBackground: string;
    onCardBackground: string;
    logoutColor: string;
    primary: string;
    outline: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
  onNavigateToQuestions: () => void;
};

const LightTestCardComponent: React.FC<LightTestCardProps> = ({
  test,
  themeColors,
  onEdit,
  onDelete,
  onTogglePublish,
  onNavigateToQuestions,
}) => {
  const questionCount = test._count?.questions ?? 0;

  return (
    <View style={[styles.card, { backgroundColor: themeColors.cardBackground }]}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={[styles.title, { color: themeColors.onCardBackground }]} numberOfLines={1}>
            {test.title}
          </Text>
          <Text style={[styles.meta, { color: themeColors.onCardBackground }]} numberOfLines={1}>
            Durée: {test.duration} min • Score min: {test.passingScore}%
          </Text>

          <View style={styles.chipContainer}>
            <View style={[styles.chip, { backgroundColor: themeColors.primary + '20' }]}>
              <Icon name="book" size={14} color={themeColors.primary} />
              <Text style={[styles.chipText, { color: themeColors.primary }]} numberOfLines={1}>
                {test.course?.title || 'Cours non trouvé'}
              </Text>
            </View>
            <View style={[styles.chip, { backgroundColor: themeColors.primary + '20' }]}>
              <Icon name="help-circle" size={14} color={themeColors.primary} />
              <Text style={[styles.chipText, { color: themeColors.primary }]}>
                {questionCount} {questionCount === 1 ? 'question' : 'questions'}
              </Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.outlinedButton, { borderColor: themeColors.outline }]}
              onPress={onNavigateToQuestions}
            >
              <Icon name="format-list-checks" size={16} color={themeColors.primary} />
              <Text style={[styles.outlinedButtonText, { color: themeColors.primary }]}>
                Questions
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                test.isPublished
                  ? [styles.outlinedButton, { borderColor: themeColors.outline }]
                  : [styles.containedButton, { backgroundColor: themeColors.primary }]
              ]}
              onPress={onTogglePublish}
            >
              <Icon 
                name={test.isPublished ? 'eye-off' : 'eye'} 
                size={16} 
                color={test.isPublished ? themeColors.primary : '#FFFFFF'} 
              />
              <Text style={[
                styles.buttonText,
                { color: test.isPublished ? themeColors.primary : '#FFFFFF' }
              ]}>
                {test.isPublished ? 'Dépublier' : 'Publier'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: themeColors.primary + '20' }]}
            onPress={onEdit}
          >
            <Icon name="pencil" size={20} color={themeColors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: themeColors.logoutColor + '20' }]}
            onPress={onDelete}
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
    marginVertical: 6,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
  meta: {
    fontSize: 13,
    marginBottom: 8,
    opacity: 0.8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
    maxWidth: '48%',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  outlinedButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  containedButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  outlinedButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  buttonText: {
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

// Custom comparator to avoid re-renders
const arePropsEqual = (prevProps: LightTestCardProps, nextProps: LightTestCardProps) => {
  return (
    prevProps.test.id === nextProps.test.id &&
    prevProps.test.title === nextProps.test.title &&
    prevProps.test.duration === nextProps.test.duration &&
    prevProps.test.passingScore === nextProps.test.passingScore &&
    prevProps.test.isPublished === nextProps.test.isPublished &&
    prevProps.test._count?.questions === nextProps.test._count?.questions &&
    prevProps.test.course?.title === nextProps.test.course?.title
  );
};

export const LightTestCard = memo(LightTestCardComponent, arePropsEqual);
