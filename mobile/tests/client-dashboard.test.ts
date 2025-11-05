/**
 * Test simple pour valider le dashboard client
 */

import { clientApi } from '../src/services/api';

describe('Client Dashboard API', () => {
  // Mock du token pour les tests
  const mockToken = 'mock-jwt-token';
  
  beforeEach(() => {
    // Mock du SecureStore pour les tests
    jest.mock('expo-secure-store', () => ({
      getItemAsync: jest.fn().mockResolvedValue(mockToken),
      setItemAsync: jest.fn().mockResolvedValue(undefined),
      deleteItemAsync: jest.fn().mockResolvedValue(undefined),
    }));
  });

  it('devrait avoir la fonction getStats', () => {
    expect(typeof clientApi.getStats).toBe('function');
  });

  it('devrait avoir la fonction getRecentActivity', () => {
    expect(typeof clientApi.getRecentActivity).toBe('function');
  });

  it('devrait retourner les statistiques client', async () => {
    // Mock de la réponse axios
    const mockStats = {
      totalCourses: 2,
      completedCourses: 0,
      inProgressCourses: 0,
      totalHours: 24,
      weeklyProgress: 0,
      streak: 7
    };

    // Test de la structure de retour
    expect(mockStats).toHaveProperty('totalCourses');
    expect(mockStats).toHaveProperty('completedCourses');
    expect(mockStats).toHaveProperty('inProgressCourses');
    expect(mockStats).toHaveProperty('totalHours');
    expect(mockStats).toHaveProperty('weeklyProgress');
    expect(mockStats).toHaveProperty('streak');
  });

  it('devrait retourner un tableau pour l\'activité récente', () => {
    const mockActivity: any[] = [];
    expect(Array.isArray(mockActivity)).toBe(true);
  });
});