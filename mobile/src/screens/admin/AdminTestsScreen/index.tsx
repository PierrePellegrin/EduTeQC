import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, TextInput, FAB, List, IconButton, Chip, Menu, Searchbar } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, coursesApi } from '../../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../contexts/ThemeContext';
import { styles } from './styles';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const AdminTestsScreen = ({ navigation }: Props) => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);
  const [courseMenuVisible, setCourseMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    duration: '',
    passingScore: '',
  });

  const { data: tests, isLoading } = useQuery({
    queryKey: ['adminTests'],
    queryFn: adminApi.getAllTests,
  });

  const { data: courses } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: adminApi.getAllCourses,
  });

  // ...existing code...
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      courseId: '',
      duration: '',
      passingScore: '',
    });
  };

  // Import mutations from extracted hook
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useTestMutations } = require('./consts');
  const { createMutation, updateMutation, deleteMutation, togglePublishMutation } = useTestMutations(queryClient, resetForm, setShowCreateForm, setEditingTest);

  const handleSubmit = () => {
    const data = {
      title: formData.title,
      description: formData.description,
      courseId: formData.courseId,
      duration: parseInt(formData.duration),
      passingScore: parseInt(formData.passingScore),
    };

    if (editingTest) {
      updateMutation.mutate({ id: editingTest.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (test: any) => {
    setEditingTest(test);
    setFormData({
      title: test.title,
      description: test.description || '',
      courseId: test.courseId,
      duration: test.duration.toString(),
      passingScore: test.passingScore.toString(),
    });
    setShowCreateForm(true);
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Confirmer la suppression',
      `Voulez-vous vraiment supprimer le test "${title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
      ]
    );
  };

  const handleTogglePublish = (id: string, currentStatus: boolean, title: string) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'publier' : 'dépublier';
    
    Alert.alert(
      'Confirmer',
      `Voulez-vous ${action} le test "${title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: newStatus ? 'Publier' : 'Dépublier', 
          onPress: () => togglePublishMutation.mutate({ id, isPublished: newStatus })
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const filteredTests = tests?.tests?.filter((test: any) =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.course?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Rechercher un test..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {showCreateForm && (
          <Card style={[styles.formCard, { backgroundColor: theme.colors.cardBackground }]}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.formTitle}>
                {editingTest ? 'Modifier le test' : 'Créer un nouveau test'}
              </Text>

              <TextInput
                label="Titre du test"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Description"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
              />

              <Menu
                visible={courseMenuVisible}
                onDismiss={() => setCourseMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setCourseMenuVisible(true)}
                    style={styles.input}
                    contentStyle={styles.dropdownButton}
                    icon="chevron-down"
                  >
                    {formData.courseId && courses?.courses?.find((c: any) => c.id === formData.courseId)
                      ? courses.courses.find((c: any) => c.id === formData.courseId).title
                      : 'Sélectionner un cours'}
                  </Button>
                }
              >
                {courses?.courses?.map((course: any) => (
                  <Menu.Item
                    key={course.id}
                    onPress={() => {
                      setFormData({ ...formData, courseId: course.id });
                      setCourseMenuVisible(false);
                    }}
                    title={course.title}
                    leadingIcon={formData.courseId === course.id ? 'check' : undefined}
                  />
                ))}
              </Menu>

              <TextInput
                label="Durée (minutes)"
                value={formData.duration}
                onChangeText={(text) => setFormData({ ...formData, duration: text })}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />

              <TextInput
                label="Score minimum (%)"
                value={formData.passingScore}
                onChangeText={(text) => setFormData({ ...formData, passingScore: text })}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />

              <View style={styles.formActions}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setShowCreateForm(false);
                    setEditingTest(null);
                    resetForm();
                  }}
                  style={styles.actionButton}
                >
                  Annuler
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={createMutation.isPending || updateMutation.isPending}
                  style={styles.actionButton}
                >
                  {editingTest ? 'Mettre à jour' : 'Créer'}
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        <View style={styles.testsList}>
          {filteredTests.map((test: any) => (
            <Card key={test.id} style={[styles.testCard, { backgroundColor: theme.colors.cardBackground }]}>
              <Card.Content>
                <View style={styles.testHeader}>
                  <View style={styles.testInfo}>
                    <View style={styles.titleRow}>
                      <Text variant="titleLarge" style={styles.testTitleText}>{test.title}</Text>
                    </View>
                    <Text variant="bodyMedium" style={styles.testMeta}>
                      Durée: {test.duration} min • Score min: {test.passingScore}%
                    </Text>
                    <View style={styles.chipContainer}>
                      <Chip icon="book" compact style={styles.chip}>
                        {test.course?.title || 'Cours non trouvé'}
                      </Chip>
                      <Chip icon="help-circle" compact style={styles.chip}>
                        {test.questions?.length || 0} {test.questions?.length === 1 ? 'question' : 'questions'}
                      </Chip>
                    </View>
                    <View style={styles.buttonRow}>
                      <Button
                        mode="outlined"
                        icon="format-list-checks"
                        onPress={() => navigation.navigate('AdminQuestions', { 
                          testId: test.id, 
                          testTitle: test.title 
                        })}
                        style={styles.questionsButton}
                        compact
                      >
                        Questions
                      </Button>
                      <Button
                        mode={test.isPublished ? 'outlined' : 'contained'}
                        icon={test.isPublished ? 'eye-off' : 'eye'}
                        onPress={() => handleTogglePublish(test.id, test.isPublished, test.title)}
                        style={styles.publishButton}
                        compact
                      >
                        {test.isPublished ? 'Dépublier' : 'Publier'}
                      </Button>
                    </View>
                  </View>
                  <View style={styles.testActions}>
                    <IconButton
                      icon="pencil"
                      mode="contained-tonal"
                      onPress={() => handleEdit(test)}
                    />
                    <IconButton
                      icon="delete"
                      mode="contained-tonal"
                      iconColor={theme.colors.logoutColor}
                      onPress={() => handleDelete(test.id, test.title)}
                    />
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {!filteredTests.length && !showCreateForm && (
          <Card style={[styles.emptyCard, { backgroundColor: theme.colors.cardBackground }]}>
            <Card.Content>
              <Text variant="bodyLarge" style={styles.emptyText}>
                {searchQuery 
                  ? 'Aucun test trouvé pour cette recherche.'
                  : 'Aucun test créé. Cliquez sur le bouton + pour commencer.'}
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {!showCreateForm && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setShowCreateForm(true)}
        />
      )}
    </View>
  );
};

