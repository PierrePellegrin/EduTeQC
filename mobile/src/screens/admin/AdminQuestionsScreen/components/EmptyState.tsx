import React from 'react';
import { Card, Text } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { styles } from '../styles';

export const EmptyState: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Card style={[styles.emptyCard, { backgroundColor: theme.colors.cardBackground }]}>
      <Card.Content>
        <Text variant="bodyLarge" style={styles.emptyText}>
          Aucune question créée. Cliquez sur le bouton + pour commencer.
        </Text>
      </Card.Content>
    </Card>
  );
};
