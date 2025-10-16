import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { styles } from '../styles';

type ProfileHeaderProps = {
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  } | null;
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const { theme } = useTheme();

  return (
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
  );
};
