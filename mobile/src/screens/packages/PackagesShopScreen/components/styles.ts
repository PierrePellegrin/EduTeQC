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
    minHeight: 36,
    fontSize: 14,
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
  filterGroup: {
    gap: 4,
    marginBottom: 2,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  chipScroll: {
    flexDirection: 'row',
    paddingVertical: 2,
    marginBottom: 2,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 4,
    overflow: 'scroll',
    maxHeight: 32,
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
  clearButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  clearButton: {
    height: 28,
    marginRight: 4,
    paddingHorizontal: 8,
    borderRadius: 14,
  },
});
