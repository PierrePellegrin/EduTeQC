import React, { memo, useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Animated } from 'react-native';
import { Card, Text, TextInput, Button, Icon, Menu } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useAccordionRotation } from '../../../../components/useAccordionRotation';
import { accordionStyles } from '../../../../components/accordionStyles';
import { styles } from '../styles';
import { useQuery } from '@tanstack/react-query';
import { cyclesApi } from '../../../../services/api';

type CourseFormProps = {
  formData: {
    title: string;
    description: string;
    category: string;
    content: string;
    imageUrl: string;
    niveauId: string;
  };
  isEditing: boolean;
  isLoading: boolean;
  courseId?: string;
  onFormChange: (data: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onEditSections?: (courseId: string, courseTitle: string) => void;
};


// Composant Accordéon réutilisable
type AccordionSectionProps = {
  title: string;
  icon: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  themeColors: any;
};

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
  themeColors,
}) => {
  const rotateInterpolation = useAccordionRotation(isExpanded);

  return (
    <View style={{ marginBottom: 8 }}>
      <TouchableOpacity
        style={[
          accordionStyles.header,
          { 
            backgroundColor: themeColors.surfaceVariant,
            paddingVertical: 12,
          }
        ]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={accordionStyles.leftContent}>
          <Icon source={icon} size={24} color={themeColors.primary} />
          <Text 
            variant="titleMedium" 
            style={[
              accordionStyles.title, 
              { color: themeColors.onSurface, marginLeft: 12 }
            ]}
          >
            {title}
          </Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
          <Icon source="chevron-down" size={24} color={themeColors.onSurface} />
        </Animated.View>
      </TouchableOpacity>
      {isExpanded && (
        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
          {children}
        </View>
      )}
    </View>
  );
};

const CourseFormComponent: React.FC<CourseFormProps> = ({
  formData,
  isEditing,
  isLoading,
  courseId,
  onFormChange,
  onSubmit,
  onCancel,
  onEditSections,
}) => {
  const { theme } = useTheme();

  // États pour les accordéons - tous fermés par défaut
  const [expandedSections, setExpandedSections] = useState({
    general: false,
    classification: false,
    image: false,
  });

  // États pour les menus déroulants
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [cycleMenuVisible, setCycleMenuVisible] = useState(false);
  const [niveauMenuVisible, setNiveauMenuVisible] = useState(false);

  // État local pour le cycle sélectionné (pour filtrer les niveaux)
  const [selectedCycleId, setSelectedCycleId] = useState<string>('');

  // Récupérer les cycles
  const { data: cyclesData } = useQuery({
    queryKey: ['cycles'],
    queryFn: cyclesApi.getAllCycles,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Récupérer tous les niveaux
  const { data: niveauxData } = useQuery({
    queryKey: ['niveaux'],
    queryFn: cyclesApi.getAllNiveaux,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Filtrer les niveaux par cycle
  const filteredNiveaux = selectedCycleId && niveauxData?.niveaux
    ? niveauxData.niveaux.filter((n: any) => n.cycleId === selectedCycleId)
    : niveauxData?.niveaux || [];

  // Trouver le cycle du niveau sélectionné au chargement
  useEffect(() => {
    if (formData.niveauId && niveauxData?.niveaux) {
      const niveau = niveauxData.niveaux.find((n: any) => n.id === formData.niveauId);
      if (niveau?.cycleId) {
        setSelectedCycleId(niveau.cycleId);
      }
    }
  }, [formData.niveauId, niveauxData]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Catégories prédéfinies
  const categories = [
    'Mathématiques',
    'Français',
    'Sciences',
    'Histoire',
    'Géographie',
    'Anglais',
    'Informatique',
    'Arts',
    'Éducation physique',
  ];

  const handleCycleSelect = (cycleId: string) => {
    setSelectedCycleId(cycleId);
    // Réinitialiser le niveau si on change de cycle
    onFormChange({ ...formData, niveauId: '' });
    setCycleMenuVisible(false);
  };

  const handleNiveauSelect = (niveauId: string) => {
    onFormChange({ ...formData, niveauId });
    setNiveauMenuVisible(false);
  };

  const handleCategorySelect = (category: string) => {
    onFormChange({ ...formData, category });
    setCategoryMenuVisible(false);
  };

  // Trouver les noms affichés
  const selectedCycleName = cyclesData?.cycles?.find((c: any) => c.id === selectedCycleId)?.name || 'Sélectionner un cycle';
  const selectedNiveauName = niveauxData?.niveaux?.find((n: any) => n.id === formData.niveauId)?.name || 'Sélectionner un niveau';

  return (
    <Card style={[styles.formCard, { backgroundColor: theme.colors.cardBackground }]}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.formTitle}>
          {isEditing ? 'Modifier le cours' : 'Créer un nouveau cours'}
        </Text>

        {/* Section: Informations générales */}
        <AccordionSection
          title="Informations générales"
          icon="information-outline"
          isExpanded={expandedSections.general}
          onToggle={() => toggleSection('general')}
          themeColors={theme.colors}
        >
          <TextInput
            label="Titre du cours *"
            value={formData.title}
            onChangeText={(text) => onFormChange({ ...formData, title: text })}
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
        </AccordionSection>

        {/* Section: Classification */}
        <AccordionSection
          title="Classification"
          icon="tag-outline"
          isExpanded={expandedSections.classification}
          onToggle={() => toggleSection('classification')}
          themeColors={theme.colors}
        >
          {/* Catégorie */}
          <Menu
            visible={categoryMenuVisible}
            onDismiss={() => setCategoryMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setCategoryMenuVisible(true)}>
                <TextInput
                  label="Catégorie *"
                  value={formData.category}
                  mode="outlined"
                  editable={false}
                  right={<TextInput.Icon icon="chevron-down" />}
                  style={styles.input}
                />
              </TouchableOpacity>
            }
          >
            {categories.map((cat) => (
              <Menu.Item
                key={cat}
                onPress={() => handleCategorySelect(cat)}
                title={cat}
              />
            ))}
          </Menu>

          {/* Cycle */}
          <Menu
            visible={cycleMenuVisible}
            onDismiss={() => setCycleMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setCycleMenuVisible(true)}>
                <TextInput
                  label="Cycle *"
                  value={selectedCycleName}
                  mode="outlined"
                  editable={false}
                  right={<TextInput.Icon icon="chevron-down" />}
                  style={styles.input}
                />
              </TouchableOpacity>
            }
          >
            {cyclesData?.cycles?.map((cycle: any) => (
              <Menu.Item
                key={cycle.id}
                onPress={() => handleCycleSelect(cycle.id)}
                title={cycle.name}
              />
            ))}
          </Menu>

          {/* Niveau */}
          <Menu
            visible={niveauMenuVisible}
            onDismiss={() => setNiveauMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setNiveauMenuVisible(true)}>
                <TextInput
                  label="Niveau *"
                  value={selectedNiveauName}
                  mode="outlined"
                  editable={false}
                  right={<TextInput.Icon icon="chevron-down" />}
                  style={styles.input}
                  disabled={!selectedCycleId}
                />
              </TouchableOpacity>
            }
          >
            {filteredNiveaux.map((niveau: any) => (
              <Menu.Item
                key={niveau.id}
                onPress={() => handleNiveauSelect(niveau.id)}
                title={niveau.name}
              />
            ))}
          </Menu>
        </AccordionSection>

        {/* Section: Image */}
        <AccordionSection
          title="Image"
          icon="image-outline"
          isExpanded={expandedSections.image}
          onToggle={() => toggleSection('image')}
          themeColors={theme.colors}
        >
          <TextInput
            label="URL de l'image (optionnel)"
            value={formData.imageUrl}
            onChangeText={(text) => onFormChange({ ...formData, imageUrl: text })}
            mode="outlined"
            placeholder="https://..."
            style={styles.input}
          />

          {formData.imageUrl && formData.imageUrl.trim() !== '' ? (
            <View style={{ marginTop: 12, alignItems: 'center' }}>
              <Image
                source={{ uri: formData.imageUrl }}
                style={{ 
                  width: '100%', 
                  height: 180, 
                  borderRadius: 8,
                  backgroundColor: theme.colors.surfaceVariant,
                }}
                resizeMode="cover"
              />
              <Text variant="bodySmall" style={{ marginTop: 8, opacity: 0.7 }}>
                Aperçu de l'image (format rectangle)
              </Text>
            </View>
          ) : (
            <View style={{ 
              marginTop: 12, 
              alignItems: 'center', 
              padding: 32,
              backgroundColor: theme.colors.surfaceVariant,
              borderRadius: 8,
            }}>
              <Icon source="image-off-outline" size={48} color={theme.colors.outline} />
              <Text variant="bodySmall" style={{ marginTop: 8, opacity: 0.6 }}>
                Aucune image
              </Text>
            </View>
          )}
        </AccordionSection>

        {/* Gestion des sections (uniquement en mode édition) */}
        {isEditing && courseId && onEditSections && (
          <Card style={{ marginTop: 16, backgroundColor: theme.colors.primaryContainer }}>
            <Card.Content>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Icon source="file-tree" size={24} color={theme.colors.onPrimaryContainer} />
                <Text variant="titleMedium" style={{ marginLeft: 8, color: theme.colors.onPrimaryContainer }}>
                  Sections du cours
                </Text>
              </View>
              <Text variant="bodyMedium" style={{ marginBottom: 12, color: theme.colors.onPrimaryContainer }}>
                Organisez le contenu en sections hiérarchiques avec du texte formaté.
              </Text>
              <Button
                mode="contained"
                icon="pencil"
                onPress={() => onEditSections(courseId, formData.title)}
                style={{ backgroundColor: theme.colors.primary }}
              >
                Gérer les sections
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Actions */}
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

// Memo avec custom comparator pour éviter re-renders inutiles
const arePropsEqual = (prevProps: CourseFormProps, nextProps: CourseFormProps) => {
  return (
    prevProps.formData.title === nextProps.formData.title &&
    prevProps.formData.description === nextProps.formData.description &&
    prevProps.formData.category === nextProps.formData.category &&
    prevProps.formData.content === nextProps.formData.content &&
    prevProps.formData.imageUrl === nextProps.formData.imageUrl &&
    prevProps.formData.niveauId === nextProps.formData.niveauId &&
    prevProps.isEditing === nextProps.isEditing &&
    prevProps.isLoading === nextProps.isLoading
  );
};

export const CourseForm = memo(CourseFormComponent, arePropsEqual);
