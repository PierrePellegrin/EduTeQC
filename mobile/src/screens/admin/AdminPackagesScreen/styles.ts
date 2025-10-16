import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  content: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 80,
  },
  formCard: {
    marginBottom: 16,
  },
  formTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
  },
  checkbox: {
    paddingVertical: 4,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    marginHorizontal: -4,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  packagesList: {
    // marginBottom: 12, // handled by packageCard
  },
  packageCard: {
    marginBottom: 12,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  packageInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  packageTitleText: {
    flex: 1,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  packageMeta: {
    marginTop: 4,
    opacity: 0.7,
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  chip: {
    marginHorizontal: 4,
    marginVertical: 4,
  },
  coursesLabel: {
    marginTop: 12,
    marginBottom: 4,
    opacity: 0.8,
  },
  courseItem: {
    marginLeft: 8,
    opacity: 0.7,
  },
  activeButton: {
    marginTop: 12,
  },
  packageActions: {
    flexDirection: 'column',
  },
  emptyCard: {
    marginTop: 32,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
