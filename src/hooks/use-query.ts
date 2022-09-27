import { useState, useEffect, useCallback } from "react";

export type UseQueryKeys = Array<string | number>;

export type UseQueryResult<T extends () => Promise<any>> = {
  data: Awaited<ReturnType<T>> | null;
  isLoading: boolean;
  error: unknown | null;
  refetch: () => void;
};

export type UseQueryFunction = <T extends () => Promise<any>>(
  keys: UseQueryKeys,
  queryFn: T,
  options?: {
    onSuccess?: (data: Awaited<ReturnType<T>>) => void;
    onError?: (error: unknown) => void;
  }
) => UseQueryResult<T>;

export const queryCache = new Map();

export const setQueryData = (key: string, data: any) => {
  queryCache.set(key, data);
};

export const createQueryKey = (keys: UseQueryKeys) => {
  return keys.join("-");
};

export const useQuery: UseQueryFunction = (key, queryFn, options) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetcher = useCallback(() => {
    setIsLoading(true);
    setError(null);
    const queryKey = createQueryKey(key);

    queryFn()
      .then((data) => {
        options?.onSuccess?.(data);
        setQueryData(queryKey, data);
        setIsLoading(false);
      })
      .catch((e) => {
        options?.onError?.(e);
        setError(e);
        setIsLoading(false);
      });
  }, [key, queryFn, options?.onSuccess, options?.onError]);

  useEffect(() => {
    fetcher();
  }, []);

  return {
    data: queryCache.get(createQueryKey(key)) ?? null,
    isLoading,
    error,
    refetch: fetcher,
  };
};
