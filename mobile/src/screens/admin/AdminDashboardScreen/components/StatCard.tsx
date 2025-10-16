import React from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { styles } from '../styles';

type StatCardProps = {
  value: number;
  label: string;
};

export const StatCard: React.FC<StatCardProps> = ({ value, label }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.statCell}>
      <Card mode="contained" style={[styles.statCard, { backgroundColor: theme.colors.cardBackground }]}>
        <Card.Content>
          <Text variant="headlineLarge" style={[styles.statNumber, { color: theme.colors.onCardBackground }]}>
            {value}
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onCardBackground }}>
            {label}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};
