import React, { useEffect, useState } from 'react'
import { request } from 'lib/request';

export function useFetchData<T>({
  path, params, onSuccess, onError
}: {
  path: string,
  params?: Record<string, undefined>,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void
}) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<Date>(new Date());

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchData()
        setData(res.data)
        onSuccess && onSuccess(res.data)
      } catch (error) {
        onError && onError(error as string)
      } finally {
        setLoading(false)
      }
    })()
  }, [path, reload])

  const refetch = () => {
    setReload(new Date())
  }

  const fetchData = async () => {
    setLoading(true)
    return await request.get(path, params);
  }

  return { data, loading, refetch };
}
