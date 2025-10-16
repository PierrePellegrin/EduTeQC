import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 4,
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
  label: {
    marginBottom: 8,
    marginTop: 8,
  },
  radioRow: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
  halfInput: {
    flex: 1,
    marginBottom: 12,
  },
  divider: {
    marginVertical: 16,
  },
  optionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionRow: {
    marginBottom: 8,
  },
  optionInput: {
    flex: 1,
  },
  optionControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
  questionsList: {
    // gap not supported in RN StyleSheet
  },
  questionCard: {
    marginBottom: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  questionInfo: {
    flex: 1,
  },
  questionText: {
    marginTop: 8,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  chip: {
    marginLeft: 4,
  },
  optionsLabel: {
    marginTop: 8,
    marginBottom: 4,
    opacity: 0.7,
  },
  optionItem: {
    paddingLeft: 8,
    paddingVertical: 2,
  },
  questionActions: {
    flexDirection: 'row',
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
