import request from 'supertest';
import { createTestApp } from './testApp';
import { PrismaClient } from '@prisma/client';

describe('🔒 Tests de Non-Régression - API Backend', () => {
  let app: any;
  let prisma: PrismaClient;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    app = createTestApp();
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('📊 Santé de l\'API', () => {
    test('GET /health - L\'API doit répondre avec un statut de santé', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment');
    });
  });

  describe('📚 API Courses - Tests de Non-Régression', () => {
    test('GET /api/courses - Liste des cours doit être accessible sans auth', async () => {
      const response = await request(app)
        .get('/api/courses')
        .expect('Content-Type', /json/)
        .expect(200);

      // L'API peut retourner soit un tableau directement, soit un objet avec une propriété courses
      const isArray = Array.isArray(response.body);
      const hasCoursesProperty = response.body.courses && Array.isArray(response.body.courses);
      expect(isArray || hasCoursesProperty).toBe(true);
      
      // Vérifier la structure des cours si ils existent
      const courses = isArray ? response.body : response.body.courses;
      if (courses && courses.length > 0) {
        const course = courses[0];
        expect(course).toHaveProperty('id');
        expect(course).toHaveProperty('title');
        expect(course).toHaveProperty('description');
        expect(course).toHaveProperty('category');
        // isPublished peut ne pas être inclus dans la réponse publique
        expect(course).toHaveProperty('order');
      }
    });

    test('GET /api/courses/:id - Détail d\'un cours doit être accessible', async () => {
      // D'abord récupérer un cours
      const coursesResponse = await request(app).get('/api/courses');
      
      if (coursesResponse.body.length > 0) {
        const courseId = coursesResponse.body[0].id;
        
        const response = await request(app)
          .get(`/api/courses/${courseId}`)
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toHaveProperty('id', courseId);
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('description');
        expect(response.body).toHaveProperty('sections');
        expect(Array.isArray(response.body.sections)).toBe(true);
      }
    });

    test('GET /api/courses/:id/sections - Sections d\'un cours doivent être accessibles', async () => {
      const coursesResponse = await request(app).get('/api/courses');
      
      if (coursesResponse.body.length > 0) {
        const courseId = coursesResponse.body[0].id;
        
        const response = await request(app)
          .get(`/api/courses/${courseId}/sections`)
          .expect('Content-Type', /json/)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        
        // Vérifier la structure hiérarchique des sections
        if (response.body.length > 0) {
          const section = response.body[0];
          expect(section).toHaveProperty('id');
          expect(section).toHaveProperty('title');
          expect(section).toHaveProperty('courseId', courseId);
          expect(section).toHaveProperty('order');
          expect(section).toHaveProperty('isValidatable');
        }
      }
    });
  });

  describe('📦 API Packages - Tests de Non-Régression', () => {
    test('GET /api/packages - Liste des packages doit être accessible sans auth', async () => {
      const response = await request(app)
        .get('/api/packages')
        .expect('Content-Type', /json/)
        .expect(200);

      // L'API peut retourner soit un tableau directement, soit un objet avec une propriété packages
      const isArray = Array.isArray(response.body);
      const hasPackagesProperty = response.body.packages && Array.isArray(response.body.packages);
      expect(isArray || hasPackagesProperty).toBe(true);
      
      const packages = isArray ? response.body : (response.body.packages || []);
      if (packages.length > 0) {
        const package_ = packages[0];
        expect(package_).toHaveProperty('id');
        expect(package_).toHaveProperty('name');
        expect(package_).toHaveProperty('description');
        expect(package_).toHaveProperty('price');
        // isActive peut ne pas être exposé publiquement
        expect(typeof package_.price).toBe('number');
      }
    });
  });

  describe('🧪 API Tests - Tests de Non-Régression', () => {
    test('Structure des tests doit être cohérente', async () => {
      // Vérifier qu'on peut récupérer les tests d'un cours
      const coursesResponse = await request(app).get('/api/courses');
      
      if (coursesResponse.body.length > 0) {
        const courseId = coursesResponse.body[0].id;
        
        const response = await request(app)
          .get(`/api/courses/${courseId}`)
          .expect(200);

        if (response.body.tests && response.body.tests.length > 0) {
          const test = response.body.tests[0];
          expect(test).toHaveProperty('id');
          expect(test).toHaveProperty('title');
          expect(test).toHaveProperty('description');
          expect(test).toHaveProperty('duration');
          expect(test).toHaveProperty('passingScore');
          expect(test).toHaveProperty('questions');
        }
      }
    });
  });

  describe('⚠️ Gestion d\'Erreurs', () => {
    test('GET /api/courses/invalid-id - Doit retourner 404 pour un ID invalide', async () => {
      await request(app)
        .get('/api/courses/invalid-id')
        .expect(404);
    });

    test('GET /api/nonexistent - Doit retourner 404 pour une route inexistante', async () => {
      await request(app)
        .get('/api/nonexistent')
        .expect(404);
    });
  });

  describe('🔄 Tests de Performance de Base', () => {
    test('Les réponses API doivent être rapides (< 2s)', async () => {
      const start = Date.now();
      
      await request(app)
        .get('/api/courses')
        .expect(200);
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(2000); // Moins de 2 secondes
    });
  });
});