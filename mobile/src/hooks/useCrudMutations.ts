import { useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

/**
 * Configuration pour les opérations CRUD
 */
export interface CrudConfig<T = any> {
  // Clé(s) de cache à invalider après les mutations
  queryKeys: string[];
  
  // Fonctions API pour les opérations CRUD
  api: {
    create?: (data: T) => Promise<any>;
    update?: (id: string, data: T) => Promise<any>;
    delete?: (id: string) => Promise<any>;
    toggle?: (id: string, data: any) => Promise<any>;
  };
  
  // Messages personnalisés
  messages?: {
    createSuccess?: string;
    updateSuccess?: string;
    deleteSuccess?: string;
    createError?: string;
    updateError?: string;
    deleteError?: string;
  };
  
  // Callbacks après succès
  callbacks?: {
    onCreateSuccess?: () => void;
    onUpdateSuccess?: () => void;
    onDeleteSuccess?: () => void;
  };
}

/**
 * Hook générique pour les opérations CRUD
 * Gère automatiquement les mutations create, update, delete avec invalidation du cache
 * 
 * @example
 * const { createMutation, updateMutation, deleteMutation } = useCrudMutations({
 *   queryKeys: ['adminCourses', 'courses'],
 *   api: {
 *     create: adminApi.createCourse,
 *     update: adminApi.updateCourse,
 *     delete: adminApi.deleteCourse,
 *   },
 *   messages: {
 *     createSuccess: 'Cours créé avec succès',
 *   },
 *   callbacks: {
 *     onCreateSuccess: () => {
 *       setShowCreateForm(false);
 *       resetForm();
 *     },
 *   },
 * });
 */
export function useCrudMutations<T = any>(config: CrudConfig<T>) {
  const queryClient = useQueryClient();
  
  const {
    queryKeys,
    api,
    messages = {},
    callbacks = {},
  } = config;

  // Fonction utilitaire pour invalider les queries
  const invalidateQueries = () => {
    queryKeys.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  };

  // CREATE mutation
  const createMutation = api.create
    ? useMutation({
        mutationFn: api.create,
        onSuccess: () => {
          invalidateQueries();
          callbacks.onCreateSuccess?.();
          Alert.alert(
            'Succès',
            messages.createSuccess || 'Création réussie'
          );
        },
        onError: (error: any) => {
          Alert.alert(
            'Erreur',
            error.response?.data?.message ||
              messages.createError ||
              'Erreur lors de la création'
          );
        },
      })
    : undefined;

  // UPDATE mutation
  const updateMutation = api.update
    ? useMutation({
        mutationFn: ({ id, data }: { id: string; data: T }) =>
          api.update!(id, data),
        onSuccess: () => {
          invalidateQueries();
          callbacks.onUpdateSuccess?.();
          Alert.alert(
            'Succès',
            messages.updateSuccess || 'Mise à jour réussie'
          );
        },
        onError: (error: any) => {
          Alert.alert(
            'Erreur',
            error.response?.data?.message ||
              messages.updateError ||
              'Erreur lors de la mise à jour'
          );
        },
      })
    : undefined;

  // DELETE mutation
  const deleteMutation = api.delete
    ? useMutation({
        mutationFn: api.delete,
        onSuccess: () => {
          invalidateQueries();
          callbacks.onDeleteSuccess?.();
          Alert.alert(
            'Succès',
            messages.deleteSuccess || 'Suppression réussie'
          );
        },
        onError: (error: any) => {
          Alert.alert(
            'Erreur',
            error.response?.data?.message ||
              messages.deleteError ||
              'Erreur lors de la suppression'
          );
        },
      })
    : undefined;

  // TOGGLE mutation (pour publish/active status)
  const toggleMutation = api.toggle
    ? useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
          api.toggle!(id, data),
        onSuccess: () => {
          invalidateQueries();
        },
        onError: (error: any) => {
          Alert.alert(
            'Erreur',
            error.response?.data?.message || 'Erreur lors du changement d\'état'
          );
        },
      })
    : undefined;

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    toggleMutation,
  };
}
