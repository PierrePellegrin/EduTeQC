import React from 'react';
import { View } from 'react-native';
import { Text, Chip, Card } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { styles } from '../styles';

type TestCardProps = {
  test: {
    id: string;
    title: string;
    description?: string;
    duration: number;
    passingScore: number;
  };
  onPress: () => void;
};

export const TestCard: React.FC<TestCardProps> = ({ test, onPress }) => {
  const { theme } = useTheme();

  return (
    <Card
      style={[styles.testCard, { backgroundColor: theme.colors.cardBackground }]}
      onPress={onPress}
    >
      <Card.Content>
        <View style={styles.testHeader}>
          <Text variant="titleMedium" style={[styles.testTitle, { color: theme.colors.onCardBackground }]}>
            {test.title}
          </Text>
          <Chip compact>{test.duration} min</Chip>
        </View>
        {test.description && (
          <Text variant="bodyMedium" style={[styles.testDescription, { color: theme.colors.onCardBackground }]}>
            {test.description}
          </Text>
        )}
        <View style={styles.testFooter}>
          <Text variant="bodySmall" style={{ color: theme.colors.onCardBackground }}>
            Score minimum: {test.passingScore}%
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};
