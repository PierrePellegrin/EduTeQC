import React, { memo } from 'react';
import { Card, Text } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { styles } from '../styles';

type EmptyStateProps = {
  hasSearchQuery: boolean;
};

const EmptyStateComponent: React.FC<EmptyStateProps> = ({ hasSearchQuery }) => {
  const { theme } = useTheme();

  return (
    <Card style={[styles.emptyCard, { backgroundColor: theme.colors.cardBackground }]}>
      <Card.Content>
        <Text variant="bodyLarge" style={styles.emptyText}>
          {hasSearchQuery
            ? 'Aucun test trouvé pour cette recherche.'
            : 'Aucun test créé. Cliquez sur le bouton + pour commencer.'}
        </Text>
      </Card.Content>
    </Card>
  );
};

export const EmptyState = memo(EmptyStateComponent);
