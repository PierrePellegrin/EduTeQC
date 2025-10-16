import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  headerInfo: {
    marginTop: 4,
    opacity: 0.7,
  },
  progress: {
    marginTop: 12,
  },
  content: {
    padding: 16,
    paddingTop: 8,
  },
  questionCard: {
    marginBottom: 16,
    elevation: 2,
  },
  questionNumber: {
    fontWeight: '600',
    marginBottom: 8,
  },
  questionText: {
    marginBottom: 16,
    fontSize: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    flex: 1,
    marginLeft: 8,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
});
