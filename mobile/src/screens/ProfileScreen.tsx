import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, List, IconButton, Divider } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export const ProfileScreen = () => {
  const { user, logout, isAdminMode, toggleAdminMode } = useAuth();
  const { isDark, toggleTheme, theme } = useTheme();

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

        <List.Item
          title="Mes résultats"
          left={(props) => <List.Icon {...props} icon="chart-line" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />

        <Divider />

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
