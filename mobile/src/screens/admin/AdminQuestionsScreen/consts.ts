import { adminApi } from '../../../services/api';
import { useCrudMutations } from '../../../hooks/useCrudMutations';

export function useQuestionMutations(
  testId: string,
  resetForm: () => void,
  setShowCreateForm: (show: boolean) => void,
  setEditingQuestion: (question: any) => void
) {
  const { createMutation, updateMutation, deleteMutation } = useCrudMutations({
    queryKeys: ['adminTest', testId],
    api: {
      create: adminApi.createQuestion,
      update: adminApi.updateQuestion,
      delete: adminApi.deleteQuestion,
    },
    messages: {
      createSuccess: 'Question créée avec succès',
      updateSuccess: 'Question mise à jour avec succès',
      deleteSuccess: 'Question supprimée avec succès',
    },
    callbacks: {
      onCreateSuccess: () => {
        setShowCreateForm(false);
        resetForm();
      },
      onUpdateSuccess: () => {
        setEditingQuestion(null);
        resetForm();
      },
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
