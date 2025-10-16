import React from 'react';
import { View, ScrollView } from 'react-native';
import { Card, Text, Button, FAB } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';
import { styles } from './adminDashboardScreen.styles';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const AdminDashboardScreen = ({ navigation }: Props) => {
  const { data: stats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminApi.getStats,
  });
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          Tableau de bord
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCell}>
            <Card mode="contained" style={[styles.statCard, { backgroundColor: theme.colors.cardBackground }]}>
              <Card.Content>
                <Text variant="headlineLarge" style={[styles.statNumber, { color: theme.colors.onCardBackground }]}>
                  {stats?.stats.courses || 0}
                </Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.onCardBackground }}>Cours</Text>
              </Card.Content>
            </Card>
          </View>

          <View style={styles.statCell}>
            <Card mode="contained" style={[styles.statCard, { backgroundColor: theme.colors.cardBackground }]}>
              <Card.Content>
                <Text variant="headlineLarge" style={[styles.statNumber, { color: theme.colors.onCardBackground }]}>
                  {stats?.stats.tests || 0}
                </Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.onCardBackground }}>Tests</Text>
              </Card.Content>
            </Card>
          </View>

          <View style={styles.statCell}>
            <Card mode="contained" style={[styles.statCard, { backgroundColor: theme.colors.cardBackground }]}>
              <Card.Content>
                <Text variant="headlineLarge" style={[styles.statNumber, { color: theme.colors.onCardBackground }]}>
                  {stats?.stats.users || 0}
                </Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.onCardBackground }}>Utilisateurs</Text>
              </Card.Content>
            </Card>
          </View>

          <View style={styles.statCell}>
            <Card mode="contained" style={[styles.statCard, { backgroundColor: theme.colors.cardBackground }]}>
              <Card.Content>
                <Text variant="headlineLarge" style={[styles.statNumber, { color: theme.colors.onCardBackground }]}>
                  {stats?.stats.results || 0}
                </Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.onCardBackground }}>Résultats</Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('CoursesAdminTab')}
            style={styles.actionButton}
            icon="book"
          >
            Gérer les cours
          </Button>

          <Button
            mode="contained"
            onPress={() => navigation.navigate('TestsAdminTab')}
            style={styles.actionButton}
            icon="file-document"
          >
            Gérer les tests
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};
