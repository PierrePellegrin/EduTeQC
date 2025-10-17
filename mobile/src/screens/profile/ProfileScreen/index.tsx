import React from 'react';
import { View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { ProfileHeader, ProfileMenu } from './components';
import { styles } from './styles';

const ProfileScreen = () => {
  const { user, logout, isAdminMode, toggleAdminMode } = useAuth();
  const { isDark, toggleTheme } = useTheme();

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
        onLogout={logout}
      />
    </View>
  );
}

export default ProfileScreen;
