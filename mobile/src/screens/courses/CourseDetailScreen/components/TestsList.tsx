import React from 'react';
import { Text, Divider } from 'react-native-paper';
import { TestCard } from './TestCard';
import { styles } from '../styles';

type TestsListProps = {
  tests: any[];
  onNavigateToTest: (testId: string) => void;
};

export const TestsList: React.FC<TestsListProps> = ({ tests, onNavigateToTest }) => {
  if (!tests || tests.length === 0) return null;

  return (
    <>
      <Divider style={styles.divider} />

      <Text variant="titleLarge" style={styles.sectionTitle}>
        Tests disponibles
      </Text>

      {tests.map((test: any) => (
        <TestCard
          key={test.id}
          test={test}
          onPress={() => onNavigateToTest(test.id)}
        />
      ))}
    </>
  );
};
