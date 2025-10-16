import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { styles } from '../styles';

type ActionButtonsProps = {
  onManageCourses: () => void;
  onManageTests: () => void;
};

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onManageCourses, onManageTests }) => {
  return (
    <View style={styles.actions}>
      <Button
        mode="contained"
        onPress={onManageCourses}
        style={styles.actionButton}
        icon="book"
      >
        Gérer les cours
      </Button>

      <Button
        mode="contained"
        onPress={onManageTests}
        style={styles.actionButton}
        icon="file-document"
      >
        Gérer les tests
      </Button>
    </View>
  );
};
