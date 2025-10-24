import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
  Text,
  Card,
  Checkbox,
  Button,
  ActivityIndicator,
  Chip,
  Divider,
  Searchbar,
} from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

type SectionTestsManagerProps = {
  sectionId: string;
  sectionTitle: string;
  courseId: string;
  onClose: () => void;
};

export const SectionTestsManager: React.FC<SectionTestsManagerProps> = ({
  sectionId,
  sectionTitle,
  courseId,
  onClose,
}) => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedTests, setSelectedTests] = useState<Set<string>>(new Set());

  // Récupérer tous les tests du cours
  const { data: allTests = [], isLoading } = useQuery({
    queryKey: ['course-tests', courseId],
    queryFn: async () => {
      const response = await adminApi.getAllTests();
      return response.tests.filter((t: any) => t.courseId === courseId || !t.courseId);
    },
  });

  // Récupérer les tests déjà associés à cette section
  const { data: sectionTests = [] } = useQuery({
    queryKey: ['section-tests', sectionId],
    queryFn: async () => {
      const response = await adminApi.getAllTests();
      const tests = response.tests.filter((t: any) => t.sectionId === sectionId);
      // Initialiser selectedTests après avoir récupéré les données
      setSelectedTests(new Set(tests.map((t: any) => t.id)));
      return tests;
    },
  });

  // Mutation pour associer/dissocier un test
  const updateTestMutation = useMutation({
    mutationFn: async ({ testId, associate }: { testId: string; associate: boolean }) => {
      return adminApi.updateTest(testId, {
        sectionId: associate ? sectionId : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section-tests', sectionId] });
      queryClient.invalidateQueries({ queryKey: ['course-tests', courseId] });
    },
  });

  const handleToggleTest = (testId: string) => {
    const newSelected = new Set(selectedTests);
    const isCurrentlySelected = newSelected.has(testId);

    if (isCurrentlySelected) {
      newSelected.delete(testId);
    } else {
      newSelected.add(testId);
    }

    setSelectedTests(newSelected);
    updateTestMutation.mutate({ testId, associate: !isCurrentlySelected });
  };

  const filteredTests = allTests.filter((test: any) =>
    test.title.toLowerCase().includes(search.toLowerCase())
  );

  const renderTest = ({ item }: { item: any }) => {
    const isSelected = selectedTests.has(item.id);
    const isFromThisSection = item.sectionId === sectionId;
    const isFromOtherSection = item.sectionId && item.sectionId !== sectionId;

    return (
      <Card
        style={[
          styles.testCard,
          {
            backgroundColor: isSelected
              ? theme.colors.primaryContainer
              : theme.colors.surface,
          },
        ]}
        onPress={() => !isFromOtherSection && handleToggleTest(item.id)}
      >
        <Card.Content>
          <View style={styles.testHeader}>
            <Checkbox
              status={isSelected ? 'checked' : 'unchecked'}
              onPress={() => !isFromOtherSection && handleToggleTest(item.id)}
              disabled={isFromOtherSection}
            />
            <View style={styles.testInfo}>
              <Text variant="titleMedium" numberOfLines={1}>
                {item.title}
              </Text>
              {item.description && (
                <Text
                  variant="bodySmall"
                  numberOfLines={2}
                  style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
                >
                  {item.description}
                </Text>
              )}
              <View style={styles.testMeta}>
                <Chip icon="clock-outline" compact style={styles.metaChip}>
                  {item.duration} min
                </Chip>
                <Chip icon="target" compact style={styles.metaChip}>
                  {item.passingScore}%
                </Chip>
                {isFromOtherSection && (
                  <Chip
                    icon="lock"
                    compact
                    style={[styles.metaChip, { backgroundColor: theme.colors.errorContainer }]}
                    textStyle={{ color: theme.colors.onErrorContainer }}
                  >
                    Autre section
                  </Chip>
                )}
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Chargement des tests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
          Associer des tests à :
        </Text>
        <Text variant="titleLarge" style={{ marginTop: 4, marginBottom: 16 }}>
          {sectionTitle}
        </Text>
        <Searchbar
          placeholder="Rechercher un test..."
          onChangeText={setSearch}
          value={search}
          style={styles.searchBar}
        />
        <Divider style={{ marginVertical: 16 }} />
      </View>

      <FlatList
        data={filteredTests}
        renderItem={renderTest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Card style={{ backgroundColor: theme.colors.surfaceVariant }}>
            <Card.Content>
              <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
                Aucun test disponible
              </Text>
            </Card.Content>
          </Card>
        }
      />

      <View style={styles.footer}>
        <Button mode="contained" onPress={onClose} style={styles.closeButton}>
          Fermer
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
  },
  searchBar: {
    elevation: 0,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  testCard: {
    marginBottom: 12,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  testInfo: {
    flex: 1,
    marginLeft: 8,
  },
  testMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 4,
  },
  metaChip: {
    marginRight: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  closeButton: {
    width: '100%',
  },
});
