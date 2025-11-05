import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { DashboardStatsGrid } from '../../components/DashboardStatsGrid';
import { DashboardQuickActions } from '../../components/DashboardQuickActions';
import { RecentActivity } from '../../components/RecentActivity';
import { clientApi } from '../../services/api';
import { dashboardStyles as styles } from '../../components/dashboard/styles';

type DashboardStats = {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalHours: number;
  weeklyProgress: number;
  streak: number;
};

type RecentActivityItem = {
  id: string;
  type: 'course_completed' | 'lesson_started' | 'quiz_passed' | 'achievement';
  title: string;
  subtitle: string;
  timestamp: string;
  icon: string;
};

export const ClientDashboardScreen = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      // Chargement des statistiques client
      const statsResponse = await clientApi.getStats();
      setStats(statsResponse);

      // Chargement de l'activité récente
      const activityResponse = await clientApi.getRecentActivity();
      setRecentActivity(activityResponse);
    } catch (error) {
      console.error('Erreur lors du chargement des données dashboard:', error);
      // Données de fallback pour la démo
      setStats({
        totalCourses: 12,
        completedCourses: 5,
        inProgressCourses: 3,
        totalHours: 24,
        weeklyProgress: 75,
        streak: 7
      });
      setRecentActivity([
        {
          id: '1',
          type: 'course_completed',
          title: 'Mathématiques Niveau 1',
          subtitle: 'Cours terminé avec succès',
          timestamp: '2 heures',
          icon: 'check-circle'
        },
        {
          id: '2',
          type: 'lesson_started',
          title: 'Les fractions',
          subtitle: 'Nouvelle leçon commencée',
          timestamp: '1 jour',
          icon: 'play-circle'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'Continuer l\'apprentissage',
      description: 'Reprendre où vous vous êtes arrêté',
      icon: 'play-circle',
      onPress: () => {
        // Navigation vers l'onglet des cours
        navigation.navigate('CoursesTab');
      },
      color: theme.colors.primary
    },
    {
      title: 'Explorer les cours',
      description: 'Découvrir de nouveaux contenus',
      icon: 'compass',
      onPress: () => {
        // Navigation vers l'onglet des forfaits pour explorer
        navigation.navigate('PackagesTab');
      },
      color: theme.colors.secondary
    },
    {
      title: 'Mes résultats',
      description: 'Voir votre progression détaillée',
      icon: 'chart-line',
      onPress: () => {
        // Navigation vers l'onglet résultats
        navigation.navigate('ResultsTab');
      },
      color: '#FF6B6B'
    }
  ];

  const statsItems = stats ? [
    {
      title: 'Total des cours',
      subtitle: 'Cours disponibles dans vos forfaits',
      value: stats.totalCourses.toString(),
      icon: 'book-open-variant',
      color: theme.colors.primary,
      onPress: () => navigation.navigate('PackagesTab')
    },
    {
      title: 'Cours réussis',
      subtitle: 'Cours terminés avec succès',
      value: stats.completedCourses.toString(),
      icon: 'check-circle',
      color: '#4CAF50',
      onPress: () => navigation.navigate('ResultsTab')
    },
    {
      title: 'Cours actifs',
      subtitle: 'Cours commencés en progression',
      value: stats.inProgressCourses.toString(),
      icon: 'play-circle',
      color: '#FF9800',
      onPress: () => navigation.navigate('CoursesTab')
    },
    {
      title: 'Temps d\'étude',
      subtitle: 'Heures totales d\'apprentissage',
      value: `${stats.totalHours}h`,
      icon: 'clock-time-four',
      color: '#9C27B0',
      onPress: () => navigation.navigate('ResultsTab')
    },
    {
      title: 'Progrès semaine',
      subtitle: 'Avancement cette semaine',
      value: `${stats.weeklyProgress}%`,
      icon: 'chart-line',
      color: '#2196F3',
      onPress: () => navigation.navigate('ResultsTab')
    },
    {
      title: 'Série quotidienne',
      subtitle: 'Jours consécutifs d\'activité',
      value: `${stats.streak} jours`,
      icon: 'fire',
      color: '#FF5722',
      onPress: () => navigation.navigate('ResultsTab')
    }
  ] : [];

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text>Chargement...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text variant="headlineMedium" style={[styles.welcomeText, { color: theme.colors.onBackground }]}>
          Bonjour {user?.firstName || 'Étudiant'} !
        </Text>
        <Text variant="bodyLarge" style={[styles.subText, { color: theme.colors.onBackground }]}>
          Prêt à continuer votre apprentissage ?
        </Text>
      </View>

      <View style={styles.section}>
        <DashboardStatsGrid stats={statsItems} />
      </View>

      <View style={styles.section}>
        <DashboardQuickActions actions={quickActions} />
      </View>

      {recentActivity.length > 0 && (
        <View style={styles.section}>
          <RecentActivity 
            activities={recentActivity}
            title="Activité récente"
          />
        </View>
      )}
    </ScrollView>
  );
};