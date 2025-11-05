import React from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { dashboardStyles as styles } from './dashboard/styles';

type DashboardStatCardProps = {
  value: number | string;
  label: string;
  subtitle?: string;
  icon: string;
  color?: string;
  onPress?: () => void;
};

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({ 
  value, 
  label, 
  subtitle,
  icon, 
  color,
  onPress 
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.statCell}>
      <Card 
        mode="contained" 
        style={[styles.statCard, { backgroundColor: theme.colors.cardBackground }]}
        onPress={onPress}
      >
        <Card.Content style={styles.statContent}>
          <View style={styles.statHeader}>
            <Icon 
              name={icon} 
              size={32} 
              color={color || theme.colors.primary} 
            />
            <Text variant="headlineMedium" style={[styles.statNumber, { color: theme.colors.onCardBackground }]}>
              {value}
            </Text>
          </View>
          <Text variant="bodyMedium" style={[styles.statLabel, { color: theme.colors.onCardBackground }]}>
            {label}
          </Text>
          {subtitle && (
            <Text variant="bodySmall" style={[styles.statSubtitle, { color: theme.colors.onCardBackground, opacity: 0.7 }]}>
              {subtitle}
            </Text>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};