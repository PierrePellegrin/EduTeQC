import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, List, IconButton, Divider } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export const ProfileScreen = () => {
  const { user, logout, isAdminMode, toggleAdminMode } = useAuth();
  const { isDark, toggleTheme, theme } = useTheme();

  const [showResults, setShowResults] = React.useState(false);
  const { data: results, isLoading: loadingResults } = useAuth().user?.role === 'CLIENT'
    ? require('@tanstack/react-query').useQuery({
        queryKey: ['myResults'],
        queryFn: async () => {
          const res = await require('../services/api').adminApi.getUserResults();
          return res;
        },
      })
    : { data: null, isLoading: false };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text variant="bodyLarge" style={styles.email}>
          {user?.email}
        </Text>
        {user?.role === 'ADMIN' && (
          <Text variant="labelLarge" style={[styles.badge, { backgroundColor: theme.colors.badgeBackground }]}> 
            Administrateur
          </Text>
        )}
      </View>

      <Divider />

      <List.Section>
        {user?.role === 'ADMIN' && (
          <>
            <List.Item
              title="Mode administrateur"
              description={isAdminMode ? "Vue administration" : "Vue utilisateur"}
              left={(props) => <List.Icon {...props} icon="shield-account" />}
              right={() => (
                <IconButton
                  icon={isAdminMode ? 'toggle-switch' : 'toggle-switch-off-outline'}
                  onPress={toggleAdminMode}
                />
              )}
            />

            <Divider />
          </>
        )}

        <List.Item
          title="Thème sombre"
          left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => (
            <IconButton
              icon={isDark ? 'toggle-switch' : 'toggle-switch-off-outline'}
              onPress={toggleTheme}
            />
          )}
        />

        <Divider />

        {(user?.role === 'CLIENT' || (user?.role === 'ADMIN' && !isAdminMode)) && (
          <>
            <List.Item
              title="Mes résultats"
              left={(props) => <List.Icon {...props} icon="chart-line" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setShowResults(true)}
            />
            <Divider />
          </>
        )}

        <List.Item
          title="Paramètres"
          left={(props) => <List.Icon {...props} icon="cog" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />

        <Divider />

        <List.Item
          title="À propos"
          left={(props) => <List.Icon {...props} icon="information" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />

        <Divider />

        <List.Item
          title="Déconnexion"
          titleStyle={[styles.logoutText, { color: theme.colors.logoutColor }]}
          left={(props) => <List.Icon {...props} icon="logout" color={theme.colors.logoutColor} />}
          onPress={logout}
        />
      </List.Section>

      {/* Modal d'affichage des résultats */}
      {showResults && (
        <View style={{ position: 'absolute', top: 80, left: 0, right: 0, backgroundColor: theme.colors.cardBackground, padding: 16, borderRadius: 12, elevation: 4 }}>
          <Text variant="titleLarge" style={{ marginBottom: 12 }}>Mes résultats</Text>
          {loadingResults ? (
            <Text>Chargement...</Text>
          ) : results && results.length > 0 ? (
            results.map((r: any) => (
              <View key={r.id} style={{ marginBottom: 8 }}>
                <Text>{r.test?.title || 'Test'} : {r.score} % {r.passed ? '✅' : '❌'}</Text>
              </View>
            ))
          ) : (
            <Text>Aucun résultat disponible.</Text>
          )}
          <IconButton icon="close" onPress={() => setShowResults(false)} style={{ alignSelf: 'flex-end' }} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  name: {
    fontWeight: '600',
    marginBottom: 8,
  },
  email: {
    opacity: 0.7,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    color: 'white',
    overflow: 'hidden',
  },
  logoutText: {
    // Color will be set dynamically from theme
  },
});
