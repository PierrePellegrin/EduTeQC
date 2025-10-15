import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, TextInput, FAB, List, IconButton, Chip } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const AdminTestsScreen = ({ navigation }: Props) => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    duration: '',
    passingScore: '',
  });

  const { data: tests, isLoading } = useQuery({
    queryKey: ['adminTests'],
    queryFn: adminApi.getAllTests,
  });

  const createMutation = useMutation({
    mutationFn: adminApi.createTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTests'] });
      setShowCreateForm(false);
      resetForm();
      Alert.alert('Succès', 'Test créé avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la création');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => adminApi.updateTest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTests'] });
      setEditingTest(null);
      resetForm();
      Alert.alert('Succès', 'Test mis à jour avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTests'] });
      Alert.alert('Succès', 'Test supprimé avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      courseId: '',
      duration: '',
      passingScore: '',
    });
  };

  const handleSubmit = () => {
    const data = {
      title: formData.title,
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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Gestion des Tests
        </Text>

        {showCreateForm && (
          <Card style={styles.formCard}>
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
                label="ID du cours"
                value={formData.courseId}
                onChangeText={(text) => setFormData({ ...formData, courseId: text })}
                mode="outlined"
                style={styles.input}
                placeholder="Copier l'ID depuis la liste des cours"
              />

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
          {tests?.tests?.map((test: any) => (
            <Card key={test.id} style={styles.testCard}>
              <Card.Content>
                <View style={styles.testHeader}>
                  <View style={styles.testInfo}>
                    <Text variant="titleLarge">{test.title}</Text>
                    <Text variant="bodyMedium" style={styles.testMeta}>
                      Durée: {test.duration} min • Score min: {test.passingScore}%
                    </Text>
                    <View style={styles.chipContainer}>
                      <Chip icon="book" compact>
                        {test.course?.title || 'Cours non trouvé'}
                      </Chip>
                      <Chip icon="help-circle" compact style={styles.chip}>
                        {test._count?.questions || 0} questions
                      </Chip>
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
                      iconColor="#D32F2F"
                      onPress={() => handleDelete(test.id, test.title)}
                    />
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {!tests?.tests?.length && !showCreateForm && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="bodyLarge" style={styles.emptyText}>
                Aucun test créé. Cliquez sur le bouton + pour commencer.
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  formCard: {
    marginBottom: 16,
  },
  formTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
  testsList: {
    gap: 12,
  },
  testCard: {
    marginBottom: 12,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  testInfo: {
    flex: 1,
  },
  testMeta: {
    marginTop: 4,
    opacity: 0.7,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  chip: {
    marginLeft: 4,
  },
  testActions: {
    flexDirection: 'row',
    gap: 4,
  },
  emptyCard: {
    marginTop: 32,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
