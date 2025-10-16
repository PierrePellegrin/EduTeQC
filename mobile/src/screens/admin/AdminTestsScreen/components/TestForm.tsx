import React from 'react';
import { View } from 'react-native';
import { Card, Text, TextInput, Button, Menu } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { styles } from '../styles';

type TestFormProps = {
  formData: {
    title: string;
    description: string;
    courseId: string;
    duration: string;
    passingScore: string;
    imageUrl: string;
  };
  courses: any[];
  courseMenuVisible: boolean;
  isEditing: boolean;
  isLoading: boolean;
  onFormChange: (data: any) => void;
  onCourseMenuToggle: (visible: boolean) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export const TestForm: React.FC<TestFormProps> = ({
  formData,
  courses,
  courseMenuVisible,
  isEditing,
  isLoading,
  onFormChange,
  onCourseMenuToggle,
  onSubmit,
  onCancel,
}) => {
  const { theme } = useTheme();

  return (
    <Card style={[styles.formCard, { backgroundColor: theme.colors.cardBackground }]}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.formTitle}>
          {isEditing ? 'Modifier le test' : 'Créer un nouveau test'}
        </Text>

        <TextInput
          label="Titre du test"
          value={formData.title}
          onChangeText={(text) => onFormChange({ ...formData, title: text })}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Description"
          value={formData.description}
          onChangeText={(text) => onFormChange({ ...formData, description: text })}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <Menu
          visible={courseMenuVisible}
          onDismiss={() => onCourseMenuToggle(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => onCourseMenuToggle(true)}
              style={styles.input}
              contentStyle={styles.dropdownButton}
              icon="chevron-down"
            >
              {formData.courseId && courses?.find((c: any) => c.id === formData.courseId)
                ? courses.find((c: any) => c.id === formData.courseId).title
                : 'Sélectionner un cours'}
            </Button>
          }
        >
          {courses?.map((course: any) => (
            <Menu.Item
              key={course.id}
              onPress={() => {
                onFormChange({ ...formData, courseId: course.id });
                onCourseMenuToggle(false);
              }}
              title={course.title}
              leadingIcon={formData.courseId === course.id ? 'check' : undefined}
            />
          ))}
        </Menu>

        <TextInput
          label="Durée (minutes)"
          value={formData.duration}
          onChangeText={(text) => onFormChange({ ...formData, duration: text })}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          label="Score minimum (%)"
          value={formData.passingScore}
          onChangeText={(text) => onFormChange({ ...formData, passingScore: text })}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          label="Image (URL)"
          value={formData.imageUrl}
          onChangeText={(text) => onFormChange({ ...formData, imageUrl: text })}
          mode="outlined"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          style={styles.input}
        />

        {formData.imageUrl ? (
          <Card style={[styles.previewCard, { backgroundColor: theme.colors.cardBackground }]}>
            <Card.Cover source={{ uri: formData.imageUrl }} />
            <Card.Content>
              <Text variant="bodySmall" style={{ opacity: 0.7, marginTop: 8 }}>
                Aperçu de l'image
              </Text>
            </Card.Content>
          </Card>
        ) : null}

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
