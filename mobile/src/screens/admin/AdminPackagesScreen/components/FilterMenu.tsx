import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { IconButton, Chip, List } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { CustomSearchbar } from '../../../../components';
import { styles } from './styles';

export type PackageAdminFilterState = {
  search: string;
  category: string | null;
  cycle: string | null;
  niveau: string | null;
};

type FilterMenuProps = {
  filters: PackageAdminFilterState;
  onFiltersChange: (filters: PackageAdminFilterState) => void;
  categories: string[];
  cycles: string[];
  niveaux: string[];
};

export const FilterMenu: React.FC<FilterMenuProps> = ({
  filters,
  onFiltersChange,
  categories,
  cycles,
  niveaux,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'category' | 'cycle' | 'niveau' | null>(null);

  const handleSearchChange = (text: string) => {
    onFiltersChange({ ...filters, search: text });
  };

  const handleCategorySelect = (category: string) => {
    const newCategory = filters.category === category ? null : category;
    onFiltersChange({ ...filters, category: newCategory });
  };

  const handleCycleSelect = (cycle: string) => {
    const newCycle = filters.cycle === cycle ? null : cycle;
    // Reset niveau when cycle changes
    onFiltersChange({
      ...filters,
      cycle: newCycle,
      niveau: newCycle ? filters.niveau : null,
    });
  };

  const handleNiveauSelect = (niveau: string) => {
    const newNiveau = filters.niveau === niveau ? null : niveau;
    onFiltersChange({ ...filters, niveau: newNiveau });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      category: null,
      cycle: null,
      niveau: null,
    });
  };

  const hasActiveFilters = filters.category || filters.cycle || filters.niveau;

  return (
    <View style={styles.filterContainer}>
      {/* Search bar and toggle button */}
      <View style={styles.searchRow}>
        <CustomSearchbar
          placeholder="Rechercher un package"
          onChangeText={handleSearchChange}
          value={filters.search}
          style={[styles.searchbar, { flex: 1 }]}
        />
        <IconButton
          icon={isExpanded ? 'filter-off' : 'filter'}
          size={22}
          iconColor={hasActiveFilters ? theme.colors.primary : theme.colors.onBackground}
          onPress={() => setIsExpanded(!isExpanded)}
          style={styles.filterToggle}
        />
      </View>

      {/* Expandable filters section */}
      {isExpanded && (
        <View style={{ position: 'relative' }}>
          {/* Bouton suppression flottant en haut à droite */}
          {hasActiveFilters && (
            <View style={styles.floatingClearButton}>
              <IconButton
                icon="close-circle"
                size={28}
                onPress={handleClearFilters}
                iconColor={theme.colors.error}
              />
            </View>
          )}

          <View style={styles.filtersSection}>
            <List.Accordion
              title={`Matière (${categories.length})`}
              expanded={openAccordion === 'category'}
              onPress={() => setOpenAccordion(openAccordion === 'category' ? null : 'category')}
              left={(props) => <List.Icon {...props} icon="book" />}
              style={{ paddingVertical: 0, marginVertical: 0 }}
              titleStyle={{ fontSize: 14 }}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {categories.map((category) => (
                  <Chip
                    key={category}
                    selected={filters.category === category}
                    onPress={() => handleCategorySelect(category)}
                    style={styles.chip}
                    mode={filters.category === category ? 'flat' : 'outlined'}
                    textStyle={styles.chipText}
                  >
                    {category}
                  </Chip>
                ))}
              </ScrollView>
            </List.Accordion>

            <List.Accordion
              title={`Cycle (${cycles.length})`}
              expanded={openAccordion === 'cycle'}
              onPress={() => setOpenAccordion(openAccordion === 'cycle' ? null : 'cycle')}
              left={(props) => <List.Icon {...props} icon="school" />}
              style={{ paddingVertical: 0, marginVertical: 0 }}
              titleStyle={{ fontSize: 14 }}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {cycles.map((cycle) => (
                  <Chip
                    key={cycle}
                    selected={filters.cycle === cycle}
                    onPress={() => handleCycleSelect(cycle)}
                    style={styles.chip}
                    mode={filters.cycle === cycle ? 'flat' : 'outlined'}
                    textStyle={styles.chipText}
                  >
                    {cycle}
                  </Chip>
                ))}
              </ScrollView>
            </List.Accordion>

            {filters.cycle && (
              <List.Accordion
                title={`Année (${niveaux.length})`}
                expanded={openAccordion === 'niveau'}
                onPress={() => setOpenAccordion(openAccordion === 'niveau' ? null : 'niveau')}
                left={(props) => <List.Icon {...props} icon="calendar" />}
                style={{ paddingVertical: 0, marginVertical: 0 }}
                titleStyle={{ fontSize: 14 }}
              >
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {niveaux.map((niveau) => (
                    <Chip
                      key={niveau}
                      selected={filters.niveau === niveau}
                      onPress={() => handleNiveauSelect(niveau)}
                      style={styles.chip}
                      mode={filters.niveau === niveau ? 'flat' : 'outlined'}
                      textStyle={styles.chipText}
                    >
                      {niveau}
                    </Chip>
                  ))}
                </ScrollView>
              </List.Accordion>
            )}
          </View>
        </View>
      )}
    </View>
  );
};
