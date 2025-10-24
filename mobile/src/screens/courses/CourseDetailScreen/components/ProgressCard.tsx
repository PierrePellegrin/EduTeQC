import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type ProgressCardProps = {
  completionPercent: number;
  visitedSectionsCount: number;
  totalSectionsCount: number;
  lastAccessedAt?: string;
};

export const ProgressCard: React.FC<ProgressCardProps> = ({
  completionPercent,
  visitedSectionsCount,
  totalSectionsCount,
  lastAccessedAt,
}) => {
  const { theme } = useTheme();

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Jamais';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getProgressColor = () => {
    if (completionPercent >= 100) return theme.colors.tertiary;
    if (completionPercent >= 70) return theme.colors.primary;
    if (completionPercent >= 30) return '#FFA726';
    return theme.colors.error;
  };

  const getProgressMessage = () => {
    if (completionPercent >= 100) return 'Cours terminé ! 🎉';
    if (completionPercent >= 70) return 'Excellent progrès ! 💪';
    if (completionPercent >= 30) return 'Bon départ ! 📚';
    if (completionPercent > 0) return 'Continuez comme ça ! 🚀';
    return 'Commencez votre apprentissage ! 📖';
  };

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.elevation.level4 }]}>
      <Card.Content>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="chart-line"
            size={24}
            color={theme.colors.primary}
          />
          <Text
            variant="titleLarge"
            style={[styles.title, { color: theme.colors.onSurface }]}
          >
            Votre progression
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <Text
            variant="displaySmall"
            style={[styles.percentage, { color: getProgressColor() }]}
          >
            {Math.round(completionPercent)}%
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurface, marginTop: 4 }}
          >
            {getProgressMessage()}
          </Text>
        </View>

        <ProgressBar
          progress={completionPercent / 100}
          color={getProgressColor()}
          style={styles.progressBar}
        />

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="book-open-page-variant"
              size={20}
              color={theme.colors.onSurface}
            />
            <Text
              variant="bodyMedium"
              style={[styles.statText, { color: theme.colors.onSurface }]}
            >
              {visitedSectionsCount} / {totalSectionsCount} sections visitées
            </Text>
          </View>

          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color={theme.colors.onSurface}
            />
            <Text
              variant="bodySmall"
              style={[styles.statText, { color: theme.colors.onSurface }]}
            >
              Dernière visite : {formatDate(lastAccessedAt)}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    marginLeft: 12,
    fontWeight: 'bold',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  percentage: {
    fontWeight: 'bold',
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  stats: {
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    flex: 1,
  },
});
