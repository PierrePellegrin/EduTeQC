import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, FAB } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const AdminDashboardScreen = ({ navigation }: Props) => {
  const { data: stats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminApi.getStats,
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Tableau de bord
        </Text>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text variant="headlineLarge" style={styles.statNumber}>
                {stats?.stats.courses || 0}
              </Text>
              <Text variant="bodyLarge">Cours</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Text variant="headlineLarge" style={styles.statNumber}>
                {stats?.stats.tests || 0}
              </Text>
              <Text variant="bodyLarge">Tests</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Text variant="headlineLarge" style={styles.statNumber}>
                {stats?.stats.users || 0}
              </Text>
              <Text variant="bodyLarge">Utilisateurs</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Text variant="headlineLarge" style={styles.statNumber}>
                {stats?.stats.results || 0}
              </Text>
              <Text variant="bodyLarge">Résultats</Text>
            </Card.Content>
          </Card>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statCard: {
    width: '50%',
    padding: 8,
    marginBottom: 16,
  },
  statNumber: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actions: {
    marginTop: 16,
  },
  actionButton: {
    marginBottom: 12,
    paddingVertical: 8,
  },
});
