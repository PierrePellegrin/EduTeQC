import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { TestCard } from './TestCard';
import { styles } from '../styles';

type TestsListProps = {
  tests: any[];
  onNavigateToTest: (testId: string) => void;
  sections?: any[]; // Ajouter les sections pour pouvoir afficher le numéro de section
};

export const TestsList: React.FC<TestsListProps> = ({ tests, onNavigateToTest, sections = [] }) => {
  if (!tests || tests.length === 0) {
    return (
      <View style={{ paddingVertical: 32, alignItems: 'center' }}>
        <Text variant="bodyLarge" style={{ opacity: 0.6 }}>
          Aucun test disponible pour ce cours
        </Text>
      </View>
    );
  }

  // Fonction pour trouver la section associée à un test
  const findSectionForTest = (testId: string, sectionsArray: any[]): any => {
    for (const section of sectionsArray) {
      if (section.tests && section.tests.some((test: any) => test.id === testId)) {
        return section;
      }
      if (section.children && section.children.length > 0) {
        const found = findSectionForTest(testId, section.children);
        if (found) return found;
      }
    }
    return null;
  };

  return (
    <>
      <Text variant="titleLarge" style={styles.sectionTitle}>
        Tests disponibles ({tests.length})
      </Text>

      {tests.map((test: any, index: number) => {
        const associatedSection = findSectionForTest(test.id, sections);
        
        return (
          <TestCard
            key={test.id}
            test={test}
            onPress={() => onNavigateToTest(test.id)}
            associatedSection={associatedSection}
            testNumber={index + 1}
          />
        );
      })}
    </>
  );
};
