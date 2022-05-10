import React, { useEffect, useRef, useState } from 'react'
import { request } from 'lib/request';

export function useFetchData<T>({
  path, config, onSuccess, onError
}: {
  path: string,
  config?: Record<string, any>,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void
}) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<Date>(new Date());
  const pathUrl = useRef<string>(path)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await fetchData()
        setData(res.data)
        onSuccess && onSuccess(res.data)
      } catch (error) {
        onError && onError(error as string)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [path, reload])

  const refetch = (refetchPath?: string) => {
    if (refetchPath) {
      pathUrl.current = refetchPath
    }
    setReload(new Date())
  }

  const fetchData = async () => {
    setLoading(true)
    return await request.get(pathUrl.current, config);
  }

  return { data, loading, refetch };
}
