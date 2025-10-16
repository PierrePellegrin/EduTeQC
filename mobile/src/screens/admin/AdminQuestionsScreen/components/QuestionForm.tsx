import React from 'react';
import { View } from 'react-native';
import { Card, Text, TextInput, Button, RadioButton, Divider, IconButton, Checkbox } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { styles } from '../styles';

type QuestionFormProps = {
  formData: {
    text: string;
    type: 'SINGLE' | 'MULTIPLE';
    points: string;
    order: string;
  };
  options: Array<{ text: string; isCorrect: boolean }>;
  isEditing: boolean;
  isLoading: boolean;
  onFormChange: (data: any) => void;
  onTypeChange: (type: 'SINGLE' | 'MULTIPLE') => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onUpdateOption: (index: number, field: 'text' | 'isCorrect', value: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export const QuestionForm: React.FC<QuestionFormProps> = ({
  formData,
  options,
  isEditing,
  isLoading,
  onFormChange,
  onTypeChange,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
  onSubmit,
  onCancel,
}) => {
  const { theme } = useTheme();

  return (
    <Card style={[styles.formCard, { backgroundColor: theme.colors.cardBackground }]}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.formTitle}>
          {isEditing ? 'Modifier la question' : 'Créer une nouvelle question'}
        </Text>

        <TextInput
          label="Question"
          value={formData.text}
          onChangeText={(text) => onFormChange({ ...formData, text })}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <Text variant="labelLarge" style={styles.label}>Type de question</Text>
        <RadioButton.Group
          onValueChange={(value) => onTypeChange(value as 'SINGLE' | 'MULTIPLE')}
          value={formData.type}
        >
          <View style={styles.radioRow}>
            <RadioButton.Item label="Choix unique" value="SINGLE" />
            <RadioButton.Item label="Choix multiple" value="MULTIPLE" />
          </View>
        </RadioButton.Group>

        <View style={styles.row}>
          <TextInput
            label="Points"
            value={formData.points}
            onChangeText={(text) => onFormChange({ ...formData, points: text })}
            mode="outlined"
            keyboardType="numeric"
            style={styles.halfInput}
          />
          <TextInput
            label="Ordre"
            value={formData.order}
            onChangeText={(text) => onFormChange({ ...formData, order: text })}
            mode="outlined"
            keyboardType="numeric"
            style={styles.halfInput}
          />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.optionsHeader}>
          <Text variant="titleMedium">Options de réponse</Text>
          <Button icon="plus" mode="outlined" onPress={onAddOption} compact>
            Ajouter
          </Button>
        </View>

        {options.map((option, index) => (
          <View key={index} style={styles.optionRow}>
            <View style={styles.optionInput}>
              <TextInput
                label={`Option ${index + 1}`}
                value={option.text}
                onChangeText={(text) => onUpdateOption(index, 'text', text)}
                mode="outlined"
                style={styles.input}
              />
              <View style={styles.optionControls}>
                {formData.type === 'SINGLE' ? (
                  <RadioButton
                    value={index.toString()}
                    status={option.isCorrect ? 'checked' : 'unchecked'}
                    onPress={() => onUpdateOption(index, 'isCorrect', true)}
                  />
                ) : (
                  <Checkbox
                    status={option.isCorrect ? 'checked' : 'unchecked'}
                    onPress={() => onUpdateOption(index, 'isCorrect', !option.isCorrect)}
                  />
                )}
                <Text variant="bodySmall">Correcte</Text>
                {options.length > 2 && (
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => onRemoveOption(index)}
                  />
                )}
              </View>
            </View>
          </View>
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
