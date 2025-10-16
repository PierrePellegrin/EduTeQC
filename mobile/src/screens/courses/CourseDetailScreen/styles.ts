import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cover: {
    height: 250,
  },
  content: {
    padding: 16,
  },
  chip: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  title: {
    marginBottom: 12,
    fontWeight: '600',
  },
  description: {
    marginBottom: 16,
    opacity: 0.8,
  },
  divider: {
    marginVertical: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  contentCard: {
    marginBottom: 16,
    elevation: 1,
  },
  testCard: {
    marginBottom: 12,
    elevation: 2,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  testTitle: {
    flex: 1,
    marginRight: 8,
    fontWeight: '500',
  },
  testDescription: {
    marginBottom: 8,
    opacity: 0.7,
  },
  testFooter: {
    marginTop: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
});
