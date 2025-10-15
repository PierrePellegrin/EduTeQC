import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, List, IconButton, Divider } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

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
          <Text variant="labelLarge" style={styles.badge}>
            Administrateur
          </Text>
        )}
      </View>

      <Divider />

      <List.Section>
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
          titleStyle={styles.logoutText}
          left={(props) => <List.Icon {...props} icon="logout" color="#D32F2F" />}
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
    backgroundColor: '#6200EE',
    color: 'white',
    overflow: 'hidden',
  },
  logoutText: {
    color: '#D32F2F',
  },
});
