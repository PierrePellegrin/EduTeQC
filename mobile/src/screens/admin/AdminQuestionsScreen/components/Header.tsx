import React from 'react';
import { View } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { styles } from '../styles';

type HeaderProps = {
  testTitle: string;
  onBack: () => void;
};

export const Header: React.FC<HeaderProps> = ({ testTitle, onBack }) => {
  return (
    <View style={styles.header}>
      <IconButton icon="arrow-left" onPress={onBack} />
      <View style={styles.headerText}>
        <Text variant="headlineMedium" style={styles.title}>
          Questions du test
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {testTitle}
        </Text>
      </View>
    </View>
  );
};
