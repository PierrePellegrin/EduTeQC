import React from 'react';
import { View } from 'react-native';
import { Card, Text, TextInput, Button, Checkbox } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { styles } from '../styles';

type PackageFormProps = {
  formData: {
    name: string;
    description: string;
    price: string;
    imageUrl: string;
  };
  selectedCourses: string[];
  availableCourses: any[];
  isEditing: boolean;
  isLoading: boolean;
  onFormChange: (data: any) => void;
  onToggleCourse: (courseId: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export const PackageForm: React.FC<PackageFormProps> = ({
  formData,
  selectedCourses,
  availableCourses,
  isEditing,
  isLoading,
  onFormChange,
  onToggleCourse,
  onSubmit,
  onCancel,
}) => {
  const { theme } = useTheme();

  return (
    <Card style={[styles.formCard, { backgroundColor: theme.colors.cardBackground }]}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.formTitle}>
          {isEditing ? 'Modifier le package' : 'Créer un nouveau package'}
        </Text>

        <TextInput
          label="Nom du package *"
          value={formData.name}
          onChangeText={(text) => onFormChange({ ...formData, name: text })}
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
          label="Prix (€) *"
          value={formData.price}
          onChangeText={(text) => onFormChange({ ...formData, price: text })}
          mode="outlined"
          keyboardType="decimal-pad"
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

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Cours inclus *
        </Text>

        {availableCourses.map((course: any) => (
          <Checkbox.Item
            key={course.id}
            label={course.title}
            status={selectedCourses.includes(course.id) ? 'checked' : 'unchecked'}
            onPress={() => onToggleCourse(course.id)}
            style={styles.checkbox}
          />
        ))}

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
