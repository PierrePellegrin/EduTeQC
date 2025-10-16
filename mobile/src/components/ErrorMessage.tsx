import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Icon } from 'react-native-paper';
import { useTheme } from '../contexts/ThemeContext';

interface ErrorMessageProps {
  message?: string;
  icon?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message = 'Une erreur est survenue',
  icon = 'alert-circle-outline'
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Icon source={icon} size={64} color={theme.colors.error} />
      <Text 
        variant="bodyLarge" 
        style={[styles.text, { color: theme.colors.onBackground }]}
      >
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 16,
    textAlign: 'center',
  },
});
