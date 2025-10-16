import React from 'react';
import { Surface, Text, ProgressBar } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { styles } from '../styles';

type TestHeaderProps = {
  title: string;
  questionCount: number;
  duration: number;
  progress: number;
};

export const TestHeader: React.FC<TestHeaderProps> = ({
  title,
  questionCount,
  duration,
  progress,
}) => {
  const { theme } = useTheme();

  return (
    <Surface style={[styles.header, { backgroundColor: theme.colors.transparent }]} elevation={2}>
      <Text variant="titleLarge">{title}</Text>
      <Text variant="bodyMedium" style={styles.headerInfo}>
        {questionCount} questions • {duration} minutes
      </Text>
      <ProgressBar progress={progress} style={styles.progress} />
    </Surface>
  );
};
