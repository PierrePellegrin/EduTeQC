import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  filterContainer: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  searchbar: {
    elevation: 1,
  },
  filterToggle: {
    margin: 0,
  },
  floatingClearButton: {
    position: 'absolute',
    top: -16,
    left: '91%',
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  filtersSection: {
    marginTop: 4,
    gap: 8,
  },
  chipScroll: {
    flexDirection: 'row',
    paddingVertical: 2,
    marginBottom: 2,
  },
  chip: {
    height: 28,
    marginRight: 4,
    marginLeft: 4,
    marginVertical: 1,
    paddingHorizontal: 8,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
  },
});
