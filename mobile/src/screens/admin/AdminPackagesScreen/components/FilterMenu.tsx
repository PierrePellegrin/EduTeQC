import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { IconButton, Chip, List } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { CustomSearchbar } from '../../../../components';
import { styles } from './styles';

export type PackageAdminFilterState = {
  search: string;
  type: string | null;
};

type FilterMenuProps = {
  filters: PackageAdminFilterState;
  onFiltersChange: (filters: PackageAdminFilterState) => void;
  types: string[];
};

export const FilterMenu: React.FC<FilterMenuProps> = ({
  filters,
  onFiltersChange,
  types,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'type' | null>(null);

  const handleSearchChange = (text: string) => {
    onFiltersChange({ ...filters, search: text });
  };

  const handleTypeSelect = (type: string) => {
    const newType = filters.type === type ? null : type;
    onFiltersChange({ ...filters, type: newType });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      type: null,
    });
  };

  const hasActiveFilters = filters.type;

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
              title={`Type (${types.length})`}
              expanded={openAccordion === 'type'}
              onPress={() => setOpenAccordion(openAccordion === 'type' ? null : 'type')}
              left={(props) => <List.Icon {...props} icon="shape" />}
              style={{ paddingVertical: 0, marginVertical: 0 }}
              titleStyle={{ fontSize: 14 }}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {types.map((type) => (
                  <Chip
                    key={type}
                    selected={filters.type === type}
                    onPress={() => handleTypeSelect(type)}
                    style={styles.chip}
                    mode={filters.type === type ? 'flat' : 'outlined'}
                    textStyle={styles.chipText}
                  >
                    {type}
                  </Chip>
                ))}
              </ScrollView>
            </List.Accordion>
          </View>
        </View>
      )}
    </View>
  );
};
