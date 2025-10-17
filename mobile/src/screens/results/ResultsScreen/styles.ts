import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  title: {
    marginBottom: 16,
    fontWeight: '600',
  },
  searchBar: {
    marginBottom: 12,
    elevation: 2,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 12,
    fontWeight: '600',
    opacity: 0.8,
  },
  resultCard: {
    marginBottom: 16,
  },
  cardCover: {
    height: 180,
  },
  cardTitle: {
    marginBottom: 6,
  },
  courseInfo: {
    marginBottom: 8,
    opacity: 0.7,
  },
  chipContainer: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  chip: {
    margin: 4,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 32,
  },
});
