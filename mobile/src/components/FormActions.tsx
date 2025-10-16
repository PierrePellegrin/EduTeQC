import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

interface FormActionsProps {
  onSubmit: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  disabled?: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onSubmit,
  onCancel,
  submitLabel = 'Enregistrer',
  cancelLabel = 'Annuler',
  loading = false,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      {onCancel && (
        <Button
          mode="outlined"
          onPress={onCancel}
          disabled={loading}
          style={styles.button}
        >
          {cancelLabel}
        </Button>
      )}
      <Button
        mode="contained"
        onPress={onSubmit}
        loading={loading}
        disabled={disabled || loading}
        style={styles.button}
      >
        {submitLabel}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
  },
});
