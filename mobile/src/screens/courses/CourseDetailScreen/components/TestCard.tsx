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
  associatedSection?: any; // Section associée au test
  testNumber?: number; // Numéro du test dans la liste
};

export const TestCard: React.FC<TestCardProps> = ({ test, onPress, associatedSection, testNumber }) => {
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
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Chip compact>{test.duration} min</Chip>
            {testNumber && (
              <Chip compact>Test #{testNumber}</Chip>
            )}
          </View>
        </View>
        
        {/* Afficher la section associée si elle existe */}
        {associatedSection && (
          <View style={{ marginBottom: 8 }}>
            <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '500' }}>
              📖 Section associée: {associatedSection.title}
            </Text>
          </View>
        )}
        
        {/* Si le test n'est pas associé à une section, indiquer qu'il est global */}
        {!associatedSection && (
          <View style={{ marginBottom: 8 }}>
            <Text variant="bodySmall" style={{ color: theme.colors.secondary, fontWeight: '500' }}>
              🌍 Test global du cours
            </Text>
          </View>
        )}
        
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
