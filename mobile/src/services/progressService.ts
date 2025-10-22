import api from './api';
import { CourseProgress, SectionProgress } from '../types';

export const progressService = {
  // Récupérer la progression d'un utilisateur sur un cours
  async getCourseProgress(courseId: string): Promise<CourseProgress> {
    const response = await api.get(`/progress/courses/${courseId}`);
    return response.data.progress;
  },

  // Récupérer toutes les progressions de l'utilisateur
  async getUserProgress(): Promise<CourseProgress[]> {
    const response = await api.get('/progress');
    return response.data.progress;
  },

  // Récupérer les statistiques de progression
  async getUserStats(): Promise<{
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    averageCompletion: number;
    courses: CourseProgress[];
  }> {
    const response = await api.get('/progress/stats');
    return response.data.stats;
  },

  // Récupérer la progression sur toutes les sections d'un cours
  async getCourseSectionProgress(courseId: string): Promise<Array<{
    id: string;
    title: string;
    parentId?: string | null;
    progress: {
      visited: boolean;
      visitedAt: Date | null;
    };
  }>> {
    const response = await api.get(`/progress/courses/${courseId}/sections`);
    return response.data.sections;
  },

  // Marquer une section comme visitée
  async markSectionVisited(sectionId: string): Promise<SectionProgress> {
    const response = await api.post(`/progress/sections/${sectionId}/visit`);
    return response.data.sectionProgress;
  },

  // Réinitialiser la progression d'un cours
  async resetCourseProgress(courseId: string): Promise<void> {
    await api.delete(`/progress/courses/${courseId}`);
  },
};
