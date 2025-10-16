import React from 'react';
import { View } from 'react-native';
import { Card, Text, TextInput, Button } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { styles } from '../styles';

type CourseFormProps = {
  formData: {
    title: string;
    description: string;
    category: string;
    content: string;
    imageUrl: string;
  };
  isEditing: boolean;
  isLoading: boolean;
  onFormChange: (data: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export const CourseForm: React.FC<CourseFormProps> = ({
  formData,
  isEditing,
  isLoading,
  onFormChange,
  onSubmit,
  onCancel,
}) => {
  const { theme } = useTheme();

  return (
    <Card style={[styles.formCard, { backgroundColor: theme.colors.cardBackground }]}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.formTitle}>
          {isEditing ? 'Modifier le cours' : 'Créer un nouveau cours'}
        </Text>

        <TextInput
          label="Titre du cours *"
          value={formData.title}
          onChangeText={(text) => onFormChange({ ...formData, title: text })}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Description *"
          value={formData.description}
          onChangeText={(text) => onFormChange({ ...formData, description: text })}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <TextInput
          label="Catégorie *"
          value={formData.category}
          onChangeText={(text) => onFormChange({ ...formData, category: text })}
          mode="outlined"
          placeholder="Ex: Programmation, Mathématiques, Sciences..."
          style={styles.input}
        />

        <TextInput
          label="Contenu du cours *"
          value={formData.content}
          onChangeText={(text) => onFormChange({ ...formData, content: text })}
          mode="outlined"
          multiline
          numberOfLines={6}
          style={styles.input}
        />

        <TextInput
          label="URL de l'image (optionnel)"
          value={formData.imageUrl}
          onChangeText={(text) => onFormChange({ ...formData, imageUrl: text })}
          mode="outlined"
          placeholder="https://..."
          style={styles.input}
        />

        <View style={styles.formActions}>
          <Button
            mode="outlined"
            onPress={onCancel}
            style={styles.actionButton}
          >
            Annuler
          </Button>
          <Button
            mode="contained"
            onPress={onSubmit}
            loading={isLoading}
            style={styles.actionButton}
          >
            {isEditing ? 'Mettre à jour' : 'Créer'}
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};
