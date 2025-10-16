import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  name: {
    fontWeight: '600',
    marginBottom: 8,
  },
  email: {
    opacity: 0.7,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  logoutText: {
    fontWeight: '500',
  },
});
