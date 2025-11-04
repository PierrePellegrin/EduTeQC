#!/usr/bin/env node

/**
 * Script de tests end-to-end pour EduTeQC
 * Vérifie les fonctionnalités critiques de bout en bout
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

class E2ETestSuite {
  constructor() {
    this.passedTests = 0;
    this.failedTests = 0;
    this.results = [];
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async test(name, testFn) {
    try {
      this.log(`🧪 Testing: ${name}`, 'blue');
      await testFn();
      this.passedTests++;
      this.results.push({ name, status: 'PASS' });
      this.log(`✅ PASS: ${name}`, 'green');
    } catch (error) {
      this.failedTests++;
      this.results.push({ name, status: 'FAIL', error: error.message });
      this.log(`❌ FAIL: ${name}`, 'red');
      this.log(`   Error: ${error.message}`, 'red');
    }
  }

  async expect(condition, message = 'Assertion failed') {
    if (!condition) {
      throw new Error(message);
    }
  }

  async apiGet(endpoint) {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response;
  }

  async apiPost(endpoint, data) {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
    return response;
  }

  async runTests() {
    this.log('🚀 Démarrage des tests E2E EduTeQC', 'blue');
    this.log('=' .repeat(50), 'blue');

    // Test 1: API Health Check
    await this.test('API Health Check', async () => {
      const response = await axios.get('http://localhost:3000/health');
      await this.expect(response.status === 200, 'API should be healthy');
      await this.expect(response.data.status === 'OK', 'Health status should be OK');
    });

    // Test 2: Courses Endpoint
    await this.test('Courses API disponible', async () => {
      const response = await this.apiGet('/courses');
      await this.expect(response.status === 200, 'Courses endpoint should return 200');
      await this.expect(response.data.courses && Array.isArray(response.data.courses), 'Courses should return an object with courses array');
    });

    // Test 3: Packages Endpoint
    await this.test('Packages API disponible', async () => {
      const response = await this.apiGet('/packages');
      await this.expect(response.status === 200, 'Packages endpoint should return 200');
      await this.expect(Array.isArray(response.data) || (response.data.packages && Array.isArray(response.data.packages)), 'Packages should return an array or object with packages array');
    });

    // Test 4: Course Detail Functionality
    await this.test('Course Detail fonctionnel', async () => {
      const coursesResponse = await this.apiGet('/courses');
      const courses = coursesResponse.data.courses || coursesResponse.data;
      
      if (courses.length > 0) {
        const courseId = courses[0].id;
        const courseResponse = await this.apiGet(`/courses/${courseId}`);
        
        await this.expect(courseResponse.status === 200, 'Course detail should return 200');
        const courseData = courseResponse.data.course || courseResponse.data;
        await this.expect(courseData.id === courseId, 'Course ID should match');
        await this.expect(courseData.sections !== undefined, 'Course should have sections property');
      }
    });

    // Test 5: Course Sections Functionality
    await this.test('Course Sections fonctionnelles', async () => {
      const coursesResponse = await this.apiGet('/courses');
      const courses = coursesResponse.data.courses || coursesResponse.data;
      
      if (courses.length > 0) {
        const courseId = courses[0].id;
        const sectionsResponse = await this.apiGet(`/courses/${courseId}/sections`);
        
        await this.expect(sectionsResponse.status === 200, 'Sections endpoint should return 200');
        const sectionsData = sectionsResponse.data.sections || sectionsResponse.data;
        await this.expect(Array.isArray(sectionsData), 'Sections should return an array');
        
        // Vérifier la structure hiérarchique
        if (sectionsData.length > 0) {
          const section = sectionsData[0];
          await this.expect(section.id, 'Section should have an ID');
          await this.expect(section.title, 'Section should have a title');
          await this.expect(section.courseId === courseId, 'Section should belong to the course');
        }
      }
    });

    // Test 6: Error Handling
    await this.test('Gestion d\'erreurs correcte', async () => {
      try {
        await this.apiGet('/courses/invalid-id');
        throw new Error('Should have thrown an error for invalid ID');
      } catch (error) {
        await this.expect(error.response?.status === 404, 'Invalid course ID should return 404');
      }
    });

    // Test 7: Performance Check
    await this.test('Performance acceptable', async () => {
      const startTime = Date.now();
      await this.apiGet('/courses');
      const duration = Date.now() - startTime;
      
      await this.expect(duration < 2000, `API should respond in less than 2s (took ${duration}ms)`);
    });

    // Test 8: Data Integrity
    await this.test('Intégrité des données', async () => {
      const coursesResponse = await this.apiGet('/courses');
      const courses = coursesResponse.data.courses || coursesResponse.data;
      
      if (courses.length > 0) {
        for (const course of courses.slice(0, 3)) { // Test only first 3 courses
          await this.expect(course.id, 'Course should have an ID');
          await this.expect(course.title, 'Course should have a title');
          await this.expect(course.description, 'Course should have a description');
          // isPublished n'est peut-être pas exposé publiquement dans cette API
          if (course.hasOwnProperty('isPublished')) {
            await this.expect(typeof course.isPublished === 'boolean', 'isPublished should be boolean if present');
          }
        }
      }
    });

    this.printResults();
  }

  printResults() {
    this.log('\n' + '=' .repeat(50), 'blue');
    this.log('📊 RÉSULTATS DES TESTS E2E', 'blue');
    this.log('=' .repeat(50), 'blue');
    
    this.log(`✅ Tests réussis: ${this.passedTests}`, 'green');
    this.log(`❌ Tests échoués: ${this.failedTests}`, 'red');
    this.log(`📈 Taux de réussite: ${Math.round((this.passedTests / (this.passedTests + this.failedTests)) * 100)}%`, 'yellow');
    
    if (this.failedTests > 0) {
      this.log('\n❌ TESTS ÉCHOUÉS:', 'red');
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(result => {
          this.log(`   - ${result.name}: ${result.error}`, 'red');
        });
    }
    
    this.log('\n' + '=' .repeat(50), 'blue');
    
    if (this.failedTests === 0) {
      this.log('🎉 TOUS LES TESTS E2E ONT RÉUSSI !', 'green');
      process.exit(0);
    } else {
      this.log('💥 CERTAINS TESTS E2E ONT ÉCHOUÉ !', 'red');
      process.exit(1);
    }
  }
}

// Exécution des tests
if (require.main === module) {
  const testSuite = new E2ETestSuite();
  testSuite.runTests().catch(error => {
    console.error('Erreur lors de l\'exécution des tests:', error);
    process.exit(1);
  });
}

module.exports = E2ETestSuite;