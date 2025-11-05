import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { dashboardStyles as styles } from './dashboard/styles';

type QuickAction = {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
  color?: string;
};

type DashboardQuickActionsProps = {
  actions: QuickAction[];
  title?: string;
};

export const DashboardQuickActions: React.FC<DashboardQuickActionsProps> = ({ 
  actions, 
  title = "Actions rapides" 
}) => {
  const { theme } = useTheme();

  return (
    <View>
      <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
        {title}
      </Text>
      {actions.map((action, index) => (
        <Card 
          key={index}
          style={[styles.actionCard, { backgroundColor: theme.colors.cardBackground }]}
          onPress={action.onPress}
        >
          <Card.Content>
            <View style={styles.actionContent}>
              <Icon 
                name={action.icon} 
                size={24} 
                color={action.color || theme.colors.primary}
                style={styles.actionIcon}
              />
              <View style={styles.actionText}>
                <Text variant="bodyLarge" style={[styles.actionTitle, { color: theme.colors.onCardBackground }]}>
                  {action.title}
                </Text>
                <Text variant="bodySmall" style={[styles.actionDescription, { color: theme.colors.onCardBackground }]}>
                  {action.description}
                </Text>
              </View>
              <Icon 
                name="chevron-right" 
                size={20} 
                color={theme.colors.onCardBackground}
              />
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
};