import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type LightPackageCardProps = {
  package: {
    id: string;
    name: string;
    description: string;
    price: number;
    isActive: boolean;
    courses?: any[];
    _count?: {
      userPackages: number;
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
  onToggleActive: () => void;
};

const LightPackageCardComponent: React.FC<LightPackageCardProps> = ({
  package: pkg,
  themeColors,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const userPackagesCount = pkg?._count?.userPackages ?? 0;

  return (
    <View style={[styles.card, { backgroundColor: themeColors.cardBackground }]}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={[styles.title, { color: themeColors.onCardBackground }]} numberOfLines={1}>
            {typeof pkg.name === 'string' && pkg.name.trim() !== '' ? pkg.name : 'N/A'}
          </Text>
          <Text style={[styles.description, { color: themeColors.onCardBackground }]} numberOfLines={2}>
            {typeof pkg.description === 'string' && pkg.description.trim() !== '' ? pkg.description : 'N/A'}
          </Text>
          
          <View style={styles.chipContainer}>
            <View style={[styles.chip, { backgroundColor: themeColors.primary + '20' }]}>
              <Icon name="currency-eur" size={14} color={themeColors.primary} />
              <Text style={[styles.chipText, { color: themeColors.primary }]}>
                {typeof pkg.price === 'number' && !isNaN(pkg.price) ? `${pkg.price.toFixed(2)} €` : 'N/A'}
              </Text>
            </View>
            <View style={[styles.chip, { backgroundColor: themeColors.primary + '20' }]}>
              <Icon name="book-multiple" size={14} color={themeColors.primary} />
              <Text style={[styles.chipText, { color: themeColors.primary }]}>
                {Array.isArray(pkg.courses) ? `${pkg.courses.length} cours` : '0 cours'}
              </Text>
            </View>
            {userPackagesCount > 0 && (
              <View style={[styles.chip, { backgroundColor: themeColors.primary + '20' }]}>
                <Icon name="account-group" size={14} color={themeColors.primary} />
                <Text style={[styles.chipText, { color: themeColors.primary }]}>
                  {`${userPackagesCount} client${userPackagesCount > 1 ? 's' : ''}`}
                </Text>
              </View>
            )}
          </View>

          {pkg.courses && pkg.courses.length > 0 && (
            <View style={styles.coursesList}>
              <Text style={[styles.coursesLabel, { color: themeColors.onCardBackground }]}>
                Cours inclus :
              </Text>
              {pkg.courses.map((c: any, index: number) => (
                <Text key={c.id || `course-${index}`} style={[styles.courseItem, { color: themeColors.onCardBackground }]} numberOfLines={1}>
                  {`• ${typeof c?.course?.title === 'string' ? c.course.title : 'Sans titre'}`}
                </Text>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.activeButton,
              pkg.isActive 
                ? { borderColor: themeColors.outline, borderWidth: 1 }
                : { backgroundColor: themeColors.primary }
            ]}
            onPress={onToggleActive}
          >
            <Icon 
              name={pkg.isActive ? 'cancel' : 'check'} 
              size={16} 
              color={pkg.isActive ? themeColors.primary : '#FFFFFF'} 
            />
            <Text style={[styles.activeButtonText, { color: pkg.isActive ? themeColors.primary : '#FFFFFF' }]}>
              {pkg.isActive ? 'Désactiver' : 'Activer'}
            </Text>
          </TouchableOpacity>
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
  description: {
    fontSize: 14,
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
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  coursesList: {
    marginTop: 4,
    marginBottom: 8,
  },
  coursesLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  courseItem: {
    fontSize: 12,
    marginLeft: 8,
    marginBottom: 2,
  },
  activeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
    marginTop: 4,
  },
  activeButtonText: {
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
const arePropsEqual = (prevProps: LightPackageCardProps, nextProps: LightPackageCardProps) => {
  return (
    prevProps.package.id === nextProps.package.id &&
    prevProps.package.name === nextProps.package.name &&
    prevProps.package.description === nextProps.package.description &&
    prevProps.package.price === nextProps.package.price &&
    prevProps.package.isActive === nextProps.package.isActive &&
    prevProps.package.courses?.length === nextProps.package.courses?.length &&
    prevProps.package._count?.userPackages === nextProps.package._count?.userPackages
  );
};

export const LightPackageCard = memo(LightPackageCardComponent, arePropsEqual);
