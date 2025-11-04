import { PrismaClient } from '@prisma/client';

declare global {
  var __PRISMA__: PrismaClient | undefined;
}

// Configuration globale pour les tests
beforeAll(async () => {
  // Configuration de l'environnement de test
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
});

afterAll(async () => {
  // Nettoyage global après tous les tests
  if (global.__PRISMA__) {
    await global.__PRISMA__.$disconnect();
  }
});

// Augmenter le timeout pour les tests d'intégration
jest.setTimeout(30000);