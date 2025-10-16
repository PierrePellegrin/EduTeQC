import React from 'react';
import { View } from 'react-native';
import { StatCard } from './StatCard';
import { styles } from '../styles';

type StatsGridProps = {
  courses: number;
  tests: number;
  users: number;
  results: number;
};

export const StatsGrid: React.FC<StatsGridProps> = ({ courses, tests, users, results }) => {
  return (
    <View style={styles.statsGrid}>
      <StatCard value={courses} label="Cours" />
      <StatCard value={tests} label="Tests" />
      <StatCard value={users} label="Utilisateurs" />
      <StatCard value={results} label="Résultats" />
    </View>
  );
};
