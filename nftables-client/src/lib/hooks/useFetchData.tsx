import React, { useCallback, useEffect, useRef, useState } from 'react'
import { request } from 'lib/request';

export function useFetchData<T>({
  path, config, onSuccess, onError, isFetch = true
}: {
  path: string,
  config?: Record<string, any>,
  isFetch?: boolean,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void
}) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(false);
  const pathRef = useRef<string>(path)

  useEffect(() => {
    if (isFetch) {
      fetch()
    }
  }, [path])

  const fetch = async () => {
    try {
      load()
      const res = await request.get(pathRef.current, config);
      setData(res.data)
      onSuccess && onSuccess(res.data)
      return res.data;
    } catch (error) {
      onError && onError(error as string)
    } finally {
      setLoading(false)
    }
  }

  const load = () => {
    setLoading(true)
  }

  const refetch = async (newPath?: string) => {
    if (newPath) {
      pathRef.current = newPath
    }

    return await fetch()
  }

  return { data, loading, refetch };
}
