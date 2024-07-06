import { DependencyList, useCallback, useRef } from 'react'

export default function useDebouncedCallback<T extends (...args: any[]) => ReturnType<T>>(
  func: T,
  wait?: number,
  deps: DependencyList = [],
): T {
  const timerId = useRef<NodeJS.Timeout>()

  return useCallback(
    (...args: Parameters<T>) => {
      timerId.current = setTimeout(() => func(...args), wait)
      clearTimeout(timerId.current)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [func, wait, ...deps],
  ) as T
}
