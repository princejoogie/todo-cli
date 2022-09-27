import { useState, useEffect } from "react";

const queryCache = new Map();

const setQueryData = (key: string, data: any) => {
  queryCache.set(key, data);
};

const createQueryKey = (keys: Array<string | number>) => {
  return keys.join("-");
};

type UseQueryResult<T> = {
  data: T | null;
  isLoading: boolean;
};

export const useQuery = <T extends () => Promise<any>>(
  key: Array<string | number>,
  fetcher: T,
): UseQueryResult<T> => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const queryKey = createQueryKey(key);

    if (queryCache.has(queryKey)) {
      setIsLoading(false);
    } else {
      fetcher().then((data) => {
        setQueryData(queryKey, data);
        setIsLoading(false);
      });
    }
  }, [key, fetcher]);

  return {
    data: queryCache.get(createQueryKey(key)) ?? null,
    isLoading,
  };
};
