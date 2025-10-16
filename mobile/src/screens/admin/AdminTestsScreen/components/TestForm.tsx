import React from 'react';
import { View, Image } from 'react-native';
import { Card, Text, TextInput, Button, Menu, Icon } from 'react-native-paper';
import { Slider } from '@rneui/themed';
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

        <View style={styles.input}>
          <Text variant="labelLarge" style={{ marginBottom: 8 }}>
            Durée: {formData.duration || 0} minutes
          </Text>
          <Slider
            style={{ width: '100%' }}
            minimumValue={0}
            maximumValue={60}
            step={5}
            value={parseInt(formData.duration) || 0}
            onValueChange={(value) => onFormChange({ ...formData, duration: Math.round(value).toString() })}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.surfaceVariant}
            thumbTintColor={theme.colors.primary}
            thumbStyle={{ height: 20, width: 20 }}
            trackStyle={{ height: 4 }}
          />
        </View>

        <View style={styles.input}>
          <Text variant="labelLarge" style={{ marginBottom: 8 }}>
            Score minimum: {formData.passingScore || 0}%
          </Text>
          <Slider
            style={{ width: '100%' }}
            minimumValue={0}
            maximumValue={100}
            step={5}
            value={parseInt(formData.passingScore) || 0}
            onValueChange={(value) => onFormChange({ ...formData, passingScore: Math.round(value).toString() })}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.surfaceVariant}
            thumbTintColor={theme.colors.primary}
            thumbStyle={{ height: 20, width: 20 }}
            trackStyle={{ height: 4 }}
          />
        </View>

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

        {formData.imageUrl && formData.imageUrl.trim() !== '' ? (
          <View style={{ marginBottom: 12, alignItems: 'center' }}>
            <Image
              source={{ uri: formData.imageUrl }}
              style={{ width: 120, height: 120, borderRadius: 8 }}
              resizeMode="cover"
            />
            <Text variant="bodySmall" style={{ marginTop: 4, opacity: 0.7 }}>
              Aperçu de l'image
            </Text>
          </View>
        ) : (
          <View style={{ marginBottom: 12, alignItems: 'center', padding: 16 }}>
            <Icon source="image-off-outline" size={48} color={theme.colors.outline} />
            <Text variant="bodySmall" style={{ marginTop: 8, opacity: 0.6 }}>
              Aucune image
            </Text>
          </View>
        )}

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
