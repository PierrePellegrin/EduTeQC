import React from 'react';
import { View } from 'react-native';
import { TestCard } from './TestCard';
import { styles } from '../styles';

type TestsListProps = {
  tests: any[];
  onEdit: (test: any) => void;
  onDelete: (id: string, title: string) => void;
  onTogglePublish: (id: string, currentStatus: boolean, title: string) => void;
  onNavigateToQuestions: (testId: string, testTitle: string) => void;
};

export const TestsList: React.FC<TestsListProps> = ({
  tests,
  onEdit,
  onDelete,
  onTogglePublish,
  onNavigateToQuestions,
}) => {
  return (
    <View style={styles.testsList}>
      {tests.map((test: any) => (
        <TestCard
          key={test.id}
          test={test}
          onEdit={() => onEdit(test)}
          onDelete={() => onDelete(test.id, test.title)}
          onTogglePublish={() => onTogglePublish(test.id, test.isPublished, test.title)}
          onNavigateToQuestions={() => onNavigateToQuestions(test.id, test.title)}
        />
      ))}
    </View>
  );
};
