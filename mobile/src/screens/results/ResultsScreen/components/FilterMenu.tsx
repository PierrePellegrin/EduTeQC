import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { IconButton, Chip, List } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { CustomSearchbar } from '../../../../components';
import { styles } from './styles';

export type ResultsFilterState = {
  search: string;
  category: string | null;
  course: string | null;
};

type FilterMenuProps = {
  filters: ResultsFilterState;
  onFiltersChange: (filters: ResultsFilterState) => void;
  categories: string[];
  courses: string[];
};

export const FilterMenu: React.FC<FilterMenuProps> = ({
  filters,
  onFiltersChange,
  categories,
  courses,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'category' | 'course' | null>(null);

  const handleSearchChange = (text: string) => {
    onFiltersChange({ ...filters, search: text });
  };

  const handleCategorySelect = (category: string) => {
    const newCategory = filters.category === category ? null : category;
    onFiltersChange({ ...filters, category: newCategory });
  };

  const handleCourseSelect = (course: string) => {
    const newCourse = filters.course === course ? null : course;
    onFiltersChange({ ...filters, course: newCourse });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      category: null,
      course: null,
    });
  };

  const hasActiveFilters = filters.category || filters.course;

  return (
    <View style={styles.filterContainer}>
      {/* Search bar and toggle button */}
      <View style={styles.searchRow}>
        <CustomSearchbar
          placeholder="Rechercher un résultat"
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
              title={`Cours (${courses.length})`}
              expanded={openAccordion === 'course'}
              onPress={() => setOpenAccordion(openAccordion === 'course' ? null : 'course')}
              left={(props) => <List.Icon {...props} icon="school" />}
              style={{ paddingVertical: 0, marginVertical: 0 }}
              titleStyle={{ fontSize: 14 }}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {courses.map((course) => (
                  <Chip
                    key={course}
                    selected={filters.course === course}
                    onPress={() => handleCourseSelect(course)}
                    style={styles.chip}
                    mode={filters.course === course ? 'flat' : 'outlined'}
                    textStyle={styles.chipText}
                  >
                    {course}
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
