import { StyleSheet } from 'react-native';

export const dashboardStyles = StyleSheet.create({
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
  subtitle: {
    marginBottom: 16,
    opacity: 0.7,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 16,
  },
  statCell: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  statCard: {
    width: '100%',
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    width: '100%',
  },
  statNumber: {
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 20,
  },
  statLabel: {
    textAlign: 'center',
    fontSize: 11,
    opacity: 0.8,
  },
  statSubtitle: {
    textAlign: 'center',
    fontSize: 10,
    opacity: 0.6,
    marginTop: 2,
  },
  sectionTitle: {
    marginBottom: 8,
    marginTop: 4,
    fontWeight: '600',
  },
  actionCard: {
    marginBottom: 6,
    elevation: 1,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontWeight: '500',
    fontSize: 14,
  },
  actionDescription: {
    fontSize: 11,
    opacity: 0.7,
    marginTop: 1,
  },
  recentSection: {
    marginTop: 8,
  },
  recentItem: {
    marginBottom: 8,
  },
  welcomeCard: {
    marginBottom: 24,
    elevation: 2,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeIcon: {
    marginRight: 16,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  emptyDescription: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 16,
  },
  // Activité récente
  activityCard: {
    marginBottom: 4,
    elevation: 2,
    borderRadius: 12,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  activityIcon: {
    marginRight: 8,
  },
  activityText: {
    flex: 1,
    marginRight: 6,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 1,
  },
  activitySubtitle: {
    fontSize: 11,
    opacity: 0.7,
  },
  activityTime: {
    fontSize: 10,
    opacity: 0.6,
  },
  // État vide pour activités
  emptyCard: {
    elevation: 1,
    borderRadius: 12,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  // En-tête dashboard
  header: {
    padding: 12,
    marginBottom: 6,
  },
  subText: {
    opacity: 0.8,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});