import api from './api';
import { CourseSection } from '../types';

export const sectionService = {
  // Récupérer toutes les sections d'un cours
  async getCourseSections(courseId: string, rootOnly: boolean = false): Promise<CourseSection[]> {
    const params = rootOnly ? '?rootOnly=true' : '';
    const response = await api.get(`/courses/${courseId}/sections${params}`);
    return response.data.sections;
  },

  // Récupérer les sections racines uniquement
  async getRootSections(courseId: string): Promise<CourseSection[]> {
    return this.getCourseSections(courseId, true);
  },

  // Récupérer une section par ID
  async getSectionById(sectionId: string): Promise<CourseSection> {
    const response = await api.get(`/sections/${sectionId}`);
    return response.data.section;
  },

  // Récupérer le fil d'Ariane d'une section
  async getSectionBreadcrumb(sectionId: string): Promise<Array<{ id: string; title: string }>> {
    const response = await api.get(`/sections/${sectionId}/breadcrumb`);
    return response.data.breadcrumb;
  },

  // Récupérer la section suivante
  async getNextSection(sectionId: string): Promise<CourseSection | null> {
    const response = await api.get(`/sections/${sectionId}/next`);
    return response.data.nextSection;
  },

  // Récupérer la section précédente
  async getPreviousSection(sectionId: string): Promise<CourseSection | null> {
    const response = await api.get(`/sections/${sectionId}/previous`);
    return response.data.previousSection;
  },

  // ADMIN: Créer une nouvelle section
  async createSection(data: {
    courseId: string;
    parentId?: string;
    title: string;
    content?: string;
    order?: number;
  }): Promise<CourseSection> {
    const response = await api.post(`/courses/${data.courseId}/sections`, data);
    return response.data.section;
  },

  // ADMIN: Mettre à jour une section
  async updateSection(
    sectionId: string,
    data: {
      title?: string;
      content?: string;
      order?: number;
    }
  ): Promise<CourseSection> {
    const response = await api.put(`/sections/${sectionId}`, data);
    return response.data.section;
  },

  // ADMIN: Déplacer une section
  async moveSection(
    sectionId: string,
    data: {
      parentId?: string | null;
      order?: number;
    }
  ): Promise<CourseSection> {
    const response = await api.patch(`/sections/${sectionId}/move`, data);
    return response.data.section;
  },

  // ADMIN: Réorganiser plusieurs sections
  async reorderSections(
    updates: Array<{
      id: string;
      order: number;
      parentId?: string | null;
    }>
  ): Promise<CourseSection[]> {
    const response = await api.post('/sections/reorder', { updates });
    return response.data.sections;
  },

  // ADMIN: Supprimer une section
  async deleteSection(sectionId: string): Promise<void> {
    await api.delete(`/sections/${sectionId}`);
  },
};
