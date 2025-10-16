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
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
  coursesList: {
    // gap not supported in RN StyleSheet
  },
  courseCard: {
    marginBottom: 12,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  courseInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  courseTitleText: {
    flex: 1,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  courseMeta: {
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
  publishButton: {
    marginTop: 12,
  },
  courseActions: {
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
