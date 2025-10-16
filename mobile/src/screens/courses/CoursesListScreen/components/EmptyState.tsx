import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { styles } from '../styles';

type EmptyStateProps = {
  message?: string;
};

export const EmptyState: React.FC<EmptyStateProps> = ({ message = 'Aucun cours disponible' }) => {
  return (
    <View style={styles.centerContainer}>
      <Text>{message}</Text>
    </View>
  );
};
