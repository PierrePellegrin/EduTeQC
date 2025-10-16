import React from 'react';
import { View } from 'react-native';
import { Card, Text, Button, IconButton, Chip } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { styles } from '../styles';

type PackageCardProps = {
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
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
};

export const PackageCard: React.FC<PackageCardProps> = ({
  package: pkg,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const { theme } = useTheme();
  const userPackagesCount = pkg?._count?.userPackages ?? 0;

  return (
    <Card style={[styles.packageCard, { backgroundColor: theme.colors.cardBackground }]}>
      <Card.Content>
        <View style={styles.packageHeader}>
          <View style={styles.packageInfo}>
            <View style={styles.titleRow}>
              <Text variant="titleLarge" style={[styles.packageTitleText, { color: theme.colors.onCardBackground }]}>
                {typeof pkg.name === 'string' && pkg.name.trim() !== '' ? pkg.name : 'N/A'}
              </Text>
            </View>
            <Text variant="bodyMedium" style={[styles.packageMeta, { color: theme.colors.onCardBackground }]}>
              {typeof pkg.description === 'string' && pkg.description.trim() !== '' ? pkg.description : 'N/A'}
            </Text>
            <View style={styles.chipContainer}>
              <Chip icon="currency-eur" compact style={styles.chip}>
                <Text>{typeof pkg.price === 'number' && !isNaN(pkg.price) ? `${pkg.price.toFixed(2)} €` : 'N/A'}</Text>
              </Chip>
              <Chip icon="book-multiple" compact style={styles.chip}>
                <Text>{Array.isArray(pkg.courses) ? `${pkg.courses.length} cours` : '0 cours'}</Text>
              </Chip>
              {userPackagesCount > 0 && (
                <Chip icon="account-group" compact style={styles.chip}>
                  <Text>
                    {`${userPackagesCount} client${userPackagesCount > 1 ? 's' : ''}`}
                  </Text>
                </Chip>
              )}
            </View>
            {pkg.courses && pkg.courses.length > 0 && (
              <>
                <Text variant="labelMedium" style={styles.coursesLabel}>
                  Cours inclus :
                </Text>
                {pkg.courses.map((c: any) => (
                  <Text key={c.id} variant="bodySmall" style={[styles.courseItem, { color: theme.colors.onCardBackground }]}>
                    {`• ${typeof c?.course?.title === 'string' ? c.course.title : 'Sans titre'}`}
                  </Text>
                ))}
              </>
            )}
            <Button
              mode={pkg.isActive ? 'outlined' : 'contained'}
              icon={pkg.isActive ? 'cancel' : 'check'}
              onPress={onToggleActive}
              style={styles.activeButton}
              compact
            >
              {pkg.isActive ? 'Désactiver' : 'Activer'}
            </Button>
          </View>
          <View style={styles.packageActions}>
            <IconButton
              icon="pencil"
              mode="contained-tonal"
              onPress={onEdit}
            />
            <IconButton
              icon="delete"
              mode="contained-tonal"
              iconColor={theme.colors.logoutColor}
              onPress={onDelete}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};
