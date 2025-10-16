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
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
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
  previewCard: {
    marginBottom: 12,
  },
  dropdownButton: {
    justifyContent: 'flex-start',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginHorizontal: -4,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  testsList: {
    // gap not supported in RN StyleSheet
  },
  testCard: {
    marginBottom: 12,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  testInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  testTitleText: {
    flex: 1,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  testMeta: {
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
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    marginHorizontal: -4,
  },
  questionsButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  publishButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  testActions: {
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
