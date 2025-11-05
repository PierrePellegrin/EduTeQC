import React from 'react';
import { View, FlatList } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { dashboardStyles as styles } from './dashboard/styles';

type ActivityItem = {
  id: string;
  type: 'course_completed' | 'lesson_started' | 'quiz_passed' | 'achievement';
  title: string;
  subtitle: string;
  timestamp: string;
  icon: string;
};

type RecentActivityProps = {
  activities: ActivityItem[];
  title?: string;
  maxItems?: number;
};

export const RecentActivity: React.FC<RecentActivityProps> = ({ 
  activities, 
  title = "Activité récente",
  maxItems = 5
}) => {
  const { theme } = useTheme();

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'course_completed':
        return '#4CAF50';
      case 'lesson_started':
        return theme.colors.primary;
      case 'quiz_passed':
        return '#2196F3';
      case 'achievement':
        return '#FF9800';
      default:
        return theme.colors.primary;
    }
  };

  const renderActivityItem = ({ item }: { item: ActivityItem }) => (
    <Card style={[styles.activityCard, { backgroundColor: theme.colors.cardBackground }]}>
      <Card.Content>
        <View style={styles.activityContent}>
          <Icon 
            name={item.icon} 
            size={24} 
            color={getActivityColor(item.type)}
            style={styles.activityIcon}
          />
          <View style={styles.activityText}>
            <Text variant="bodyLarge" style={[styles.activityTitle, { color: theme.colors.onCardBackground }]}>
              {item.title}
            </Text>
            <Text variant="bodySmall" style={[styles.activitySubtitle, { color: theme.colors.onCardBackground }]}>
              {item.subtitle}
            </Text>
          </View>
          <Text variant="bodySmall" style={[styles.activityTime, { color: theme.colors.onCardBackground }]}>
            Il y a {item.timestamp}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <View>
      <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
        {title}
      </Text>
      {displayedActivities.length > 0 ? (
        <FlatList
          data={displayedActivities}
          renderItem={renderActivityItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Card style={[styles.emptyCard, { backgroundColor: theme.colors.cardBackground }]}>
          <Card.Content>
            <View style={styles.emptyContent}>
              <Icon 
                name="history" 
                size={32} 
                color={theme.colors.onCardBackground} 
                style={styles.emptyIcon}
              />
              <Text variant="bodyMedium" style={[styles.emptyText, { color: theme.colors.onCardBackground }]}>
                Aucune activité récente
              </Text>
              <Text variant="bodySmall" style={[styles.emptySubtext, { color: theme.colors.onCardBackground }]}>
                Commencez un cours pour voir votre activité ici
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}
    </View>
  );
};