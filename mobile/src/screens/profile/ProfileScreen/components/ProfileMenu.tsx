import React from 'react';
import { List, IconButton, Divider } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';

type ProfileMenuProps = {
  user: any;
  isAdminMode: boolean;
  isDark: boolean;
  onToggleAdminMode: () => void;
  onToggleTheme: () => void;
  onLogout: () => void;
};

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  user,
  isAdminMode,
  isDark,
  onToggleAdminMode,
  onToggleTheme,
  onLogout,
}) => {
  const { theme } = useTheme();

  return (
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
                onPress={onToggleAdminMode}
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
            onPress={onToggleTheme}
          />
        )}
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
        titleStyle={{ color: theme.colors.logoutColor }}
        left={(props) => <List.Icon {...props} icon="logout" color={theme.colors.logoutColor} />}
        onPress={onLogout}
      />
    </List.Section>
  );
};
