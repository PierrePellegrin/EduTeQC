import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    marginBottom: 8,
    fontWeight: '600',
  },
  description: {
    marginBottom: 12,
    opacity: 0.8,
  },
  coursesCount: {
    marginBottom: 8,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  accordion: {
    marginBottom: 8,
  },
  courseCard: {
    marginBottom: 12,
    marginLeft: 16,
    marginRight: 0,
  },
  cover: {
    height: 120,
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 8,
  },
  courseTitle: {
    marginBottom: 6,
    fontWeight: '500',
  },
  courseDescription: {
    opacity: 0.7,
  },
});
