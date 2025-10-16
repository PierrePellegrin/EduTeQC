import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../contexts/ThemeContext';
import { StatsGrid, ActionButtons } from './components';
import { styles } from './styles';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const AdminDashboardScreen = ({ navigation }: Props) => {
  const { data: stats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminApi.getStats,
  });
  const { theme } = useTheme();

  const handleManageCourses = () => navigation.navigate('CoursesAdminTab');
  const handleManageTests = () => navigation.navigate('TestsAdminTab');

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          Tableau de bord
        </Text>

        <StatsGrid
          courses={stats?.stats.courses || 0}
          tests={stats?.stats.tests || 0}
          users={stats?.stats.users || 0}
          results={stats?.stats.results || 0}
        />

        <ActionButtons
          onManageCourses={handleManageCourses}
          onManageTests={handleManageTests}
        />
      </ScrollView>
    </View>
  );
};
