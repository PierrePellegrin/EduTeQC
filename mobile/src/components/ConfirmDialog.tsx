import React from 'react';
import { Alert } from 'react-native';
import { Dialog, Portal, Text, Button } from 'react-native-paper';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  destructive = false,
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel}>{cancelLabel}</Button>
          <Button 
            onPress={onConfirm}
            textColor={destructive ? 'red' : undefined}
          >
            {confirmLabel}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

/**
 * Helper pour afficher un dialog de confirmation avec Alert
 */
export const showConfirmAlert = (
  title: string,
  message: string,
  onConfirm: () => void,
  options?: {
    confirmLabel?: string;
    cancelLabel?: string;
  }
) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: options?.cancelLabel || 'Annuler',
        style: 'cancel',
      },
      {
        text: options?.confirmLabel || 'Confirmer',
        onPress: onConfirm,
        style: 'destructive',
      },
    ]
  );
};
