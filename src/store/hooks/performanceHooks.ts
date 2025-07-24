// src/store/performanceHooks.ts - Custom hooks for performance optimization
import { createSelector } from '@reduxjs/toolkit'
import { useCallback, useMemo } from 'react'
import { useAppSelector } from './hooks'
import type { RootState } from './store'

// Hook for creating dynamic selectors with dependencies
export const useDynamicSelector = <T, Args extends any[]>(
  selectorFactory: (...args: Args) => (state: RootState) => T,
  dependencies: Args,
  dependencyArray: React.DependencyList = dependencies
) => {
  const selector = useMemo(
    () => selectorFactory(...dependencies),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencyArray
  )

  return useAppSelector(selector)
}

// Hook for memoized data transformations
export const useMemoizedTransform = <T, R>(
  data: T,
  transform: (data: T) => R,
  deps: React.DependencyList
) => {
  return useMemo(
    () => transform(data),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, ...deps]
  )
}

// Hook for creating parameterized selectors
export const useParameterizedSelector = <T, P>(
  baseSelector: (state: RootState) => T,
  parameterizer: (data: T, param: P) => any,
  parameter: P
) => {
  const selector = useMemo(
    () => createSelector([baseSelector, () => parameter], parameterizer),
    [baseSelector, parameterizer, parameter]
  )

  return useAppSelector(selector)
}

// Hook for debounced selectors (useful for search)
export const useDebouncedSelector = <T>(
  selector: (state: RootState) => T,
  delay: number = 300
) => {
  const value = useAppSelector(selector)
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook for comparing and memoizing selector results
export const useStableSelector = <T>(
  selector: (state: RootState) => T,
  isEqual?: (a: T, b: T) => boolean
) => {
  const defaultIsEqual = useCallback((a: T, b: T) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.length === b.length && a.every((item, index) => item === b[index])
    }
    if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
      const keysA = Object.keys(a)
      const keysB = Object.keys(b)
      return (
        keysA.length === keysB.length &&
        keysA.every((key) => (a as any)[key] === (b as any)[key])
      )
    }
    return a === b
  }, [])

  const compareFunction = isEqual || defaultIsEqual
  const currentValue = useAppSelector(selector)
  const [stableValue, setStableValue] = useState(currentValue)

  useEffect(() => {
    if (!compareFunction(currentValue, stableValue)) {
      setStableValue(currentValue)
    }
  }, [currentValue, stableValue, compareFunction])

  return stableValue
}

// Hook for tracking selector performance
export const usePerformanceSelector = <T>(
  selector: (state: RootState) => T,
  name: string = 'selector'
) => {
  const result = useAppSelector(selector)

  useEffect(() => {
    const startTime = performance.now()
    const endTime = performance.now()

    if (process.env.NODE_ENV === 'development') {
      console.log(`${name} execution time: ${endTime - startTime}ms`)
    }
  })

  return result
}

// Hook for batch selector updates
export const useBatchedSelectors = <T extends Record<string, any>>(selectors: {
  [K in keyof T]: (state: RootState) => T[K]
}) => {
  return useAppSelector(
    useMemo(
      () =>
        createSelector(Object.values(selectors) as any, (...results) => {
          const keys = Object.keys(selectors)
          return keys.reduce((acc, key, index) => {
            acc[key] = results[index]
            return acc
          }, {} as any)
        }),
      [selectors]
    )
  )
}

// Hook for conditional selectors
export const useConditionalSelector = <T, F>(
  condition: boolean,
  trueSelector: (state: RootState) => T,
  falseSelector: (state: RootState) => F
) => {
  const selector = useMemo(
    () => (condition ? trueSelector : falseSelector),
    [condition, trueSelector, falseSelector]
  )

  return useAppSelector(selector as any)
}

// Add missing imports at the top
import { useEffect, useState } from 'react'
