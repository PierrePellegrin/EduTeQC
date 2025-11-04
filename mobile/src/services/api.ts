import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { getApiUrl } from '../config/api.config';

// Utiliser la configuration centralisée pour l'URL de l'API
const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    // Si token expiré, déconnecter l'utilisateur
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('token');
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      console.log('API: Envoi de la requête de connexion...');
      const response = await api.post('/auth/login', { email, password });
      console.log('API: Réponse reçue:', response.status);
      
      if (response.data.token) {
        console.log('API: Sauvegarde du token...');
        await SecureStore.setItemAsync('token', response.data.token);
        console.log('API: Token sauvegardé');
      }
      
      return response.data;
    } catch (error) {
      console.error('API: Erreur lors de la connexion:', error);
      throw error;
    }
  },

  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      await SecureStore.setItemAsync('token', response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('token');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Courses API
export const coursesApi = {
  getAll: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  getByCategory: async (category: string) => {
    const response = await api.get(`/courses/category/${category}`);
    return response.data;
  },
};

// Tests API
export const testsApi = {
  getById: async (id: string) => {
    const response = await api.get(`/tests/${id}`);
    return response.data;
  },

  submit: async (id: string, answers: Record<string, string[]>) => {
    const response = await api.post(`/tests/${id}/submit`, { answers });
    return response.data;
  },

  getAllResultsForUser: async () => {
    const response = await api.get('/tests/results');
    return response.data;
  },
};

// Admin API
export const adminApi = {
  // Client Packages
  getUserPackages: async () => {
    const response = await api.get('/packages/mine');
    // Always return an array, even if undefined or missing
    return Array.isArray(response.data.userPackages) ? response.data.userPackages : [];
  },

  buyPackage: async (packageId: string) => {
    const response = await api.post(`/packages/buy`, { packageId });
    return response.data;
  },
  // Courses
  getAllCourses: async () => {
    const response = await api.get('/admin/courses');
    return response.data;
  },

  createCourse: async (data: any) => {
    const response = await api.post('/admin/courses', data);
    return response.data;
  },

  updateCourse: async (id: string, data: any) => {
    const response = await api.put(`/admin/courses/${id}`, data);
    return response.data;
  },

  deleteCourse: async (id: string) => {
    const response = await api.delete(`/admin/courses/${id}`);
    return response.data;
  },

  checkCourseGlobalTests: async (id: string) => {
    const response = await api.get(`/admin/courses/${id}/global-tests`);
    return response.data;
  },

  // Tests
  getAllTests: async () => {
    const response = await api.get('/admin/tests');
    return response.data;
  },

  createTest: async (data: any) => {
    const response = await api.post('/admin/tests', data);
    return response.data;
  },

  updateTest: async (id: string, data: any) => {
    const response = await api.put(`/admin/tests/${id}`, data);
    return response.data;
  },

  deleteTest: async (id: string) => {
    const response = await api.delete(`/admin/tests/${id}`);
    return response.data;
  },

  // Questions
  createQuestion: async (data: any) => {
    const response = await api.post('/admin/questions', data);
    return response.data;
  },

  updateQuestion: async (id: string, data: any) => {
    const response = await api.put(`/admin/questions/${id}`, data);
    return response.data;
  },

  deleteQuestion: async (id: string) => {
    const response = await api.delete(`/admin/questions/${id}`);
    return response.data;
  },

  // Stats
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Packages
  getAllPackages: async () => {
    const response = await api.get('/admin/packages');
    return response.data;
  },

  createPackage: async (data: any) => {
    const response = await api.post('/admin/packages', data);
    return response.data;
  },

  updatePackage: async (id: string, data: any) => {
    const response = await api.put(`/admin/packages/${id}`, data);
    return response.data;
  },

  deletePackage: async (id: string) => {
    const response = await api.delete(`/admin/packages/${id}`);
    return response.data;
  },

  // Sections (Admin)
  getCourseSections: async (courseId: string) => {
    const response = await api.get(`/courses/${courseId}/sections`);
    return response.data.sections || [];
  },

  createSection: async (courseId: string, data: {
    title: string;
    content?: string;
    parentId?: string;
    order: number;
  }) => {
    const response = await api.post(`/courses/${courseId}/sections`, data);
    return response.data;
  },

  updateSection: async (sectionId: string, data: {
    title?: string;
    content?: string;
    order?: number;
  }) => {
    const response = await api.put(`/sections/${sectionId}`, data);
    return response.data;
  },

  deleteSection: async (sectionId: string) => {
    const response = await api.delete(`/sections/${sectionId}`);
    return response.data;
  },

  reorderSections: async (sections: { id: string; order: number; parentId?: string | null }[]) => {
    const response = await api.post(`/sections/reorder`, { updates: sections });
    return response.data;
  },
};

// Cycles API
export const cyclesApi = {
  getAllCycles: async () => {
    const response = await api.get('/cycles');
    return response.data;
  },

  getAllNiveaux: async () => {
    const response = await api.get('/niveaux');
    return response.data;
  },

  getNiveauxByCycle: async (cycleId: string) => {
    const response = await api.get(`/cycles/${cycleId}/niveaux`);
    return response.data;
  },
};

export default api;

