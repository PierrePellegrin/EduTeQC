import { QueryClient, useMutation } from '@tanstack/react-query';
import { testsApi } from '../services/api';

export const useTestMutations = (
  testId: string,
  onSuccess: (data: any) => void
) => {
  const submitMutation = useMutation({
    mutationFn: (answers: Record<string, string[]>) =>
      testsApi.submit(testId, answers),
    onSuccess,
  });

  return { submitMutation };
};
