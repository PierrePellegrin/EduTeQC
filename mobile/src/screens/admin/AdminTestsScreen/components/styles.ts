import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  filterContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchbar: {
    flex: 1,
  },
  filterToggle: {
    margin: 0,
  },
  filtersSection: {
    marginTop: 10,
  },
  floatingClearButton: {
    position: 'absolute',
    left: '91%',
    top: -16,
    zIndex: 10,
  },
  chipScroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chip: {
    marginRight: 8,
  },
  chipText: {
    fontSize: 12,
  },
});
