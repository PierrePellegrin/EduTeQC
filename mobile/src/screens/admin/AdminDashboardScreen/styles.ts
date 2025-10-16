import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statCell: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  statCard: {
    width: '100%',
  },
  statNumber: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actions: {
    marginTop: 16,
  },
  actionButton: {
    marginBottom: 12,
    paddingVertical: 8,
  },
});
