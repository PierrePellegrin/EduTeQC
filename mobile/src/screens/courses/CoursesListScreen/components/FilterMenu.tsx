import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { IconButton, Chip, List } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { CustomSearchbar } from '../../../../components';
import { styles } from './styles';

export type CourseFilterState = {
  search: string;
  category: string | null;
  packageId: string | null;
};

type FilterMenuProps = {
  filters: CourseFilterState;
  onFiltersChange: (filters: CourseFilterState) => void;
  categories: string[];
  packages: Array<{ id: string; name: string }>;
};

export const FilterMenu: React.FC<FilterMenuProps> = ({
  filters,
  onFiltersChange,
  categories,
  packages,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'category' | 'package' | null>(null);

  const handleSearchChange = (text: string) => {
    onFiltersChange({ ...filters, search: text });
  };

  const handleCategorySelect = (category: string) => {
    const newCategory = filters.category === category ? null : category;
    onFiltersChange({ ...filters, category: newCategory });
  };

  const handlePackageSelect = (packageId: string) => {
    const newPackageId = filters.packageId === packageId ? null : packageId;
    onFiltersChange({ ...filters, packageId: newPackageId });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      category: null,
      packageId: null,
    });
  };

  const hasActiveFilters = filters.category || filters.packageId;

  return (
    <View style={styles.filterContainer}>
      {/* Search bar and toggle button */}
      <View style={styles.searchRow}>
        <CustomSearchbar
          placeholder="Rechercher un cours"
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
              title={`Forfait (${packages.length})`}
              expanded={openAccordion === 'package'}
              onPress={() => setOpenAccordion(openAccordion === 'package' ? null : 'package')}
              left={(props) => <List.Icon {...props} icon="package-variant" />}
              style={{ paddingVertical: 0, marginVertical: 0 }}
              titleStyle={{ fontSize: 14 }}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {packages.map((pkg) => (
                  <Chip
                    key={pkg.id}
                    selected={filters.packageId === pkg.id}
                    onPress={() => handlePackageSelect(pkg.id)}
                    style={styles.chip}
                    mode={filters.packageId === pkg.id ? 'flat' : 'outlined'}
                    textStyle={styles.chipText}
                  >
                    {pkg.name}
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
