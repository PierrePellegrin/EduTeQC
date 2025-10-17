import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  accordion: {
    marginBottom: 8,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  packageCard: {
    marginBottom: 12,
  },
  cover: {
    height: 120,
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 8,
  },
  packageTitle: {
    marginBottom: 4,
  },
  packageDesc: {
    marginBottom: 8,
    opacity: 0.8,
  },
  chipContainerWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    marginHorizontal: -4,
    flexWrap: 'wrap',
    flex: 1,
  },
  chip: {
    marginHorizontal: 4,
    marginVertical: 4,
  },
  buyIconButton: {
    marginLeft: 8,
    marginRight: 0,
  },
  buyButton: {
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
    marginBottom: 16,
  },
});
