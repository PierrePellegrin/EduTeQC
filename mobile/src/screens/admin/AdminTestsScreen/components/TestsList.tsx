import React, { memo, useCallback, useState, useEffect } from 'react';
import { View } from 'react-native';
import { LightTestCard } from './LightTestCard';
import { styles } from '../styles';

type TestsListProps = {
  tests: any[];
  themeColors: {
    cardBackground: string;
    onCardBackground: string;
    logoutColor: string;
    primary: string;
    outline: string;
  };
  onEdit: (test: any) => void;
  onDelete: (id: string, title: string) => void;
  onTogglePublish: (id: string, currentStatus: boolean, title: string) => void;
  onNavigateToQuestions: (testId: string, testTitle: string) => void;
};

const TestsListComponent: React.FC<TestsListProps> = ({
  tests,
  themeColors,
  onEdit,
  onDelete,
  onTogglePublish,
  onNavigateToQuestions,
}) => {
  // Progressive rendering: render first 6 items immediately, then rest instantly
  const [itemsToRender, setItemsToRender] = useState(Math.min(6, tests.length));

  useEffect(() => {
    // Reset when tests change
    setItemsToRender(Math.min(6, tests.length));

    if (tests.length > 6) {
      // Immediate render for remaining items - no delay
      setItemsToRender(tests.length);
    }
  }, [tests]);

  const visibleTests = tests.slice(0, itemsToRender);

  return (
    <View style={styles.testsList}>
      {visibleTests.map((test: any) => (
        <MemoizedTestItem
          key={test.id}
          test={test}
          themeColors={themeColors}
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
  themeColors: {
    cardBackground: string;
    onCardBackground: string;
    logoutColor: string;
    primary: string;
    outline: string;
  };
  onEdit: (test: any) => void;
  onDelete: (id: string, title: string) => void;
  onTogglePublish: (id: string, currentStatus: boolean, title: string) => void;
  onNavigateToQuestions: (testId: string, testTitle: string) => void;
};

const TestItem: React.FC<TestItemProps> = ({ test, themeColors, onEdit, onDelete, onTogglePublish, onNavigateToQuestions }) => {
  const handleEdit = useCallback(() => onEdit(test), [test, onEdit]);
  const handleDelete = useCallback(() => onDelete(test.id, test.title), [test.id, test.title, onDelete]);
  const handleTogglePublish = useCallback(() => onTogglePublish(test.id, test.isPublished, test.title), [test.id, test.isPublished, test.title, onTogglePublish]);
  const handleNavigateToQuestions = useCallback(() => onNavigateToQuestions(test.id, test.title), [test.id, test.title, onNavigateToQuestions]);

  return (
    <LightTestCard
      test={test}
      themeColors={themeColors}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onTogglePublish={handleTogglePublish}
      onNavigateToQuestions={handleNavigateToQuestions}
    />
  );
};

const MemoizedTestItem = memo(TestItem);

export const TestsList = memo(TestsListComponent);
