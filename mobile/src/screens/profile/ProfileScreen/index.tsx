import React from 'react';
import { View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { ProfileHeader, ProfileMenu } from './components';
import { styles } from './styles';

export const ProfileScreen = () => {
  const { user, logout, isAdminMode, toggleAdminMode } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showResults, setShowResults] = React.useState(false);

  return (
    <View style={styles.container}>
      <ProfileHeader user={user} />

      <Divider />

      <ProfileMenu
        user={user}
        isAdminMode={isAdminMode}
        isDark={isDark}
        onToggleAdminMode={toggleAdminMode}
        onToggleTheme={toggleTheme}
        onShowResults={() => setShowResults(true)}
        onLogout={logout}
      />
    </View>
  );
};
