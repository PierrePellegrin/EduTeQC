import React from 'react';
import { View, ScrollView } from 'react-native';
import { List, IconButton, Divider, Text } from 'react-native-paper';
import { useTheme } from '../../../contexts/ThemeContext';
import { useSettings } from '../../../contexts/SettingsContext';
import { styles } from './styles';

const SettingsScreen = () => {
  const { theme } = useTheme();
  const { showImages, toggleShowImages } = useSettings();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Affichage
        </Text>
        
        <List.Item
          title="Afficher les images"
          description="Afficher les images sur les cartes de cours, forfaits, tests et résultats"
          left={(props) => <List.Icon {...props} icon="image-outline" />}
          right={() => (
            <IconButton
              icon={showImages ? 'toggle-switch' : 'toggle-switch-off-outline'}
              iconColor={showImages ? theme.colors.primary : theme.colors.outline}
              onPress={toggleShowImages}
            />
          )}
        />
      </View>

      <Divider />

      <View style={styles.section}>
        <Text variant="bodySmall" style={styles.helpText}>
          Désactiver les images peut améliorer les performances sur les appareils moins puissants
          et réduire la consommation de données mobiles.
        </Text>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
