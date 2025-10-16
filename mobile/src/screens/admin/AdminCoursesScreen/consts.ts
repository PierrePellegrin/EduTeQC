// Constantes et handlers extraits de AdminCoursesScreen
import { adminApi } from '../../../services/api';
import { useCrudMutations } from '../../../hooks/useCrudMutations';

export function useCourseMutations(
  resetForm: () => void,
  setShowCreateForm: (v: boolean) => void,
  setEditingCourse: (v: any) => void
) {
  const { createMutation, updateMutation, deleteMutation, toggleMutation } = useCrudMutations({
    queryKeys: ['adminCourses', 'courses'],
    api: {
      create: adminApi.createCourse,
      update: adminApi.updateCourse,
      delete: adminApi.deleteCourse,
      toggle: adminApi.updateCourse,
    },
    messages: {
      createSuccess: 'Cours créé avec succès',
      updateSuccess: 'Cours mis à jour avec succès',
      deleteSuccess: 'Cours supprimé avec succès',
    },
    callbacks: {
      onCreateSuccess: () => {
        setShowCreateForm(false);
        resetForm();
      },
      onUpdateSuccess: () => {
        setEditingCourse(null);
        resetForm();
      },
    },
  });

  return { 
    createMutation, 
    updateMutation, 
    deleteMutation, 
    togglePublishMutation: toggleMutation 
  };
}
