import api from './api';

export const progressApi = {
  // Récupérer la progression d'un cours
  getCourseProgress: async (courseId: string) => {
    const response = await api.get(`/progress/courses/${courseId}`);
    return response.data;
  },

  // Récupérer la progression détaillée des sections d'un cours
  getCourseSectionProgress: async (courseId: string) => {
    const response = await api.get(`/progress/courses/${courseId}/sections`);
    return response.data;
  },

  // Marquer une section comme visitée ou non visitée
  toggleSectionVisited: async (sectionId: string, visited: boolean) => {
    const response = await api.post(`/progress/sections/${sectionId}/visit`, {
      visited,
    });
    return response.data;
  },

  // Marquer une section comme visitée (rétrocompatibilité)
  markSectionVisited: async (sectionId: string) => {
    const response = await api.post(`/progress/sections/${sectionId}/visit`, {
      visited: true,
    });
    return response.data;
  },

  // Mettre à jour le pourcentage de complétion (calculé automatiquement par le backend)
  updateCourseProgress: async (courseId: string, lastSectionId?: string) => {
    const response = await api.put(`/progress/courses/${courseId}`, {
      lastSectionId,
    });
    return response.data;
  },

  // Réinitialiser la progression d'un cours
  resetCourseProgress: async (courseId: string) => {
    const response = await api.delete(`/progress/courses/${courseId}`);
    return response.data;
  },

  // Récupérer toutes les progressions de l'utilisateur
  getAllProgress: async () => {
    const response = await api.get('/progress');
    return response.data;
  },
};
