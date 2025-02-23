import { useQuery as useTanstackQuery, useMutation as useTanstackMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

export function useQuery<T>(
  key: string | readonly unknown[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
  return useTanstackQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn,
    ...options,
  });
}

export function useMutation<T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options?: Omit<UseMutationOptions<T, Error, V>, 'mutationFn'>
) {
  return useTanstackMutation({
    mutationFn,
    ...options,
  });
} 