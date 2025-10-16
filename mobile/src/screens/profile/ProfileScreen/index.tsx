import React from 'react';
import { View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { ProfileHeader, ProfileMenu } from './components';
// import { ResultsModal } from './components/ResultsModal';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const { user, logout, isAdminMode, toggleAdminMode } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigation = useNavigation<any>();

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
  onShowResults={() => navigation.navigate('ResultsScreen')}
        onLogout={logout}
      />
    </View>
  );
}

export default ProfileScreen;
