import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Card, HelperText, Chip, SegmentedButtons } from 'react-native-paper';
import { useTheme } from '../contexts/ThemeContext';
import { CourseSection } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

type SectionEditorProps = {
  section?: CourseSection;
  parentSection?: CourseSection;
  onSave: (data: { title: string; content: string; parentId?: string }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
};

export const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  parentSection,
  onSave,
  onCancel,
  loading = false,
}) => {
  const { theme } = useTheme();
  const [title, setTitle] = useState(section?.title || '');
  const [content, setContent] = useState(section?.content || '');
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  const validate = () => {
    const newErrors: { title?: string; content?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    await onSave({
      title: title.trim(),
      content: content.trim(),
      parentId: parentSection?.id,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {parentSection && (
          <Card style={[styles.parentCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Card.Content>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Sous-section de :
              </Text>
              <Text variant="titleMedium" style={{ marginTop: 4 }}>
                {parentSection.title}
              </Text>
            </Card.Content>
          </Card>
        )}

        <View style={styles.field}>
          <TextInput
            label="Titre de la section *"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            error={!!errors.title}
            style={styles.input}
          />
          {errors.title && (
            <HelperText type="error" visible={!!errors.title}>
              {errors.title}
            </HelperText>
          )}
        </View>

        <View style={styles.field}>
          <SegmentedButtons
            value={viewMode}
            onValueChange={(value) => setViewMode(value as 'edit' | 'preview')}
            buttons={[
              { value: 'edit', label: 'Édition', icon: 'pencil' },
              { value: 'preview', label: 'Aperçu', icon: 'eye' },
            ]}
            style={styles.segmentedButtons}
          />
        </View>

        {viewMode === 'edit' ? (
          <>
            <View style={styles.field}>
              <TextInput
                label="Contenu (Markdown)"
                value={content}
                onChangeText={setContent}
                mode="outlined"
                multiline
                numberOfLines={12}
                style={styles.textArea}
                placeholder="# Titre du contenu&#10;&#10;Votre contenu ici...&#10;&#10;## Sous-titre&#10;&#10;- Liste&#10;- D'éléments"
              />
              <HelperText type="info">
                Utilisez la syntaxe Markdown pour formater le contenu (titres, listes, gras, etc.)
              </HelperText>
            </View>

            <Card style={[styles.previewCard, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Card.Content>
                <Text variant="labelMedium" style={{ marginBottom: 8 }}>
                  Aide Markdown :
                </Text>
                <View style={styles.markdownHelp}>
                  <Chip icon="format-header-1" compact style={styles.helpChip}>
                    # Titre 1
                  </Chip>
                  <Chip icon="format-header-2" compact style={styles.helpChip}>
                    ## Titre 2
                  </Chip>
                  <Chip icon="format-bold" compact style={styles.helpChip}>
                    **gras**
                  </Chip>
                  <Chip icon="format-italic" compact style={styles.helpChip}>
                    *italique*
                  </Chip>
                  <Chip icon="format-list-bulleted" compact style={styles.helpChip}>
                    - liste
                  </Chip>
                  <Chip icon="code-tags" compact style={styles.helpChip}>
                    `code`
                  </Chip>
                </View>
              </Card.Content>
            </Card>
          </>
        ) : (
          <Card style={[styles.previewCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text variant="labelMedium" style={{ marginBottom: 12, color: theme.colors.primary }}>
                📝 Aperçu du rendu
              </Text>
              {content.trim() ? (
                <MarkdownRenderer content={content} />
              ) : (
                <Text variant="bodyMedium" style={{ fontStyle: 'italic', color: theme.colors.onSurfaceVariant }}>
                  Aucun contenu à prévisualiser
                </Text>
              )}
            </Card.Content>
          </Card>
        )}

        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={onCancel}
            style={styles.button}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            {section ? 'Mettre à jour' : 'Créer'}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  parentCard: {
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'transparent',
  },
  textArea: {
    backgroundColor: 'transparent',
    minHeight: 200,
  },
  previewCard: {
    marginBottom: 16,
  },
  markdownHelp: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  helpChip: {
    marginRight: 4,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  button: {
    minWidth: 100,
  },
});
