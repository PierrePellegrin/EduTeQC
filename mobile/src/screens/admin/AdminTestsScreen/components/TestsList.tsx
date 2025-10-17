import React, { memo, useCallback } from 'react';
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

const TestsListComponent: React.FC<TestsListProps> = ({
  tests,
  onEdit,
  onDelete,
  onTogglePublish,
  onNavigateToQuestions,
}) => {
  return (
    <View style={styles.testsList}>
      {tests.map((test: any) => (
        <MemoizedTestItem
          key={test.id}
          test={test}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePublish={onTogglePublish}
          onNavigateToQuestions={onNavigateToQuestions}
        />
      ))}
    </View>
  );
};

type TestItemProps = {
  test: any;
  onEdit: (test: any) => void;
  onDelete: (id: string, title: string) => void;
  onTogglePublish: (id: string, currentStatus: boolean, title: string) => void;
  onNavigateToQuestions: (testId: string, testTitle: string) => void;
};

const TestItem: React.FC<TestItemProps> = ({ test, onEdit, onDelete, onTogglePublish, onNavigateToQuestions }) => {
  const handleEdit = useCallback(() => onEdit(test), [test, onEdit]);
  const handleDelete = useCallback(() => onDelete(test.id, test.title), [test.id, test.title, onDelete]);
  const handleTogglePublish = useCallback(() => onTogglePublish(test.id, test.isPublished, test.title), [test.id, test.isPublished, test.title, onTogglePublish]);
  const handleNavigateToQuestions = useCallback(() => onNavigateToQuestions(test.id, test.title), [test.id, test.title, onNavigateToQuestions]);

  return (
    <TestCard
      test={test}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onTogglePublish={handleTogglePublish}
      onNavigateToQuestions={handleNavigateToQuestions}
    />
  );
};

const MemoizedTestItem = memo(TestItem);

export const TestsList = memo(TestsListComponent);
