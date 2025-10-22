import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { IconButton, Chip, List } from 'react-native-paper';
import { CustomSearchbar } from '../../../../components';
import { useTheme } from '../../../../contexts/ThemeContext';
import { styles } from './styles';

export type FilterState = {
  search: string;
  cycleId: string | null;
  category: string | null;
  niveauId: string | null;
};

type FilterMenuProps = {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  cycles: any[];
  niveaux: any[];
  categories: string[];
  filteredPackagesCount: number;
};

export const FilterMenu: React.FC<FilterMenuProps> = ({
  filters,
  onFiltersChange,
  cycles,
  niveaux,
  categories,
  filteredPackagesCount,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'cycle' | 'category' | 'niveau' | null>(null);

  // Filter niveaux based on selected cycle
  const filteredNiveaux = filters.cycleId
    ? niveaux.filter((n) => n.cycleId === filters.cycleId)
    : niveaux;

  const handleSearchChange = (text: string) => {
    onFiltersChange({ ...filters, search: text });
  };

  const handleCycleSelect = (cycleId: string) => {
    const newCycleId = filters.cycleId === cycleId ? null : cycleId;
    onFiltersChange({
      ...filters,
      cycleId: newCycleId,
      niveauId: newCycleId ? filters.niveauId : null,
    });
  };

  const handleCategorySelect = (category: string) => {
    const newCategory = filters.category === category ? null : category;
    onFiltersChange({ ...filters, category: newCategory });
  };

  const handleNiveauSelect = (niveauId: string) => {
    const newNiveauId = filters.niveauId === niveauId ? null : niveauId;
    onFiltersChange({ ...filters, niveauId: newNiveauId });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      cycleId: null,
      category: null,
      niveauId: null,
    });
  };

  const hasActiveFilters = filters.cycleId || filters.category || filters.niveauId;

  return (
    <View style={styles.filterContainer}>
      {/* Search bar and toggle button */}
      <View style={styles.searchRow}>
        <CustomSearchbar
          placeholder="Rechercher un forfait"
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

          <View style={styles.filtersSection}>`n            <List.Accordion
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
            </List.Accordion>`n`n            <List.Accordion
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
                    key={cycle.id}
                    selected={filters.cycleId === cycle.id}
                    onPress={() => handleCycleSelect(cycle.id)}
                    style={styles.chip}
                    mode={filters.cycleId === cycle.id ? 'flat' : 'outlined'}
                    textStyle={styles.chipText}
                  >
                    {cycle.name}
                  </Chip>
                ))}
              </ScrollView>
            </List.Accordion>

            {filters.cycleId && (
              <List.Accordion
                title={`Année (${filteredNiveaux.length})`}
                expanded={openAccordion === 'niveau'}
                onPress={() => setOpenAccordion(openAccordion === 'niveau' ? null : 'niveau')}
                left={(props) => <List.Icon {...props} icon="calendar" />}
                style={{ paddingVertical: 0, marginVertical: 0 }}
                titleStyle={{ fontSize: 14 }}
              >
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {filteredNiveaux.map((niveau) => (
                    <Chip
                      key={niveau.id}
                      selected={filters.niveauId === niveau.id}
                      onPress={() => handleNiveauSelect(niveau.id)}
                      style={styles.chip}
                      mode={filters.niveauId === niveau.id ? 'flat' : 'outlined'}
                      textStyle={styles.chipText}
                    >
                      {niveau.name}
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




