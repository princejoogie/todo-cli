import { useCallback, useState } from "react";

export type UseMutationFunction = <T extends (...args: any) => Promise<any>>(
  mutationFn: T,
  options?: {
    onSuccess?: (data: Awaited<ReturnType<T>>) => void;
    onError?: (error: unknown) => void;
  }
) => {
  mutate: (...args: Parameters<T>) => void;
  isLoading: boolean;
  error: unknown | null;
};

export const useMutation: UseMutationFunction = (mutationFn, options) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const mutator = useCallback(
    (...args: any) => {
      setIsLoading(true);
      setError(null);

      mutationFn(...args)
        .then((data) => {
          options?.onSuccess?.(data);
          setIsLoading(false);
        })
        .catch((e) => {
          options?.onError?.(e);
          setError(e);
          setIsLoading(false);
        });
    },
    [mutationFn, options?.onSuccess, options?.onError]
  );

  return {
    mutate: mutator,
    isLoading,
    error,
  };
};
