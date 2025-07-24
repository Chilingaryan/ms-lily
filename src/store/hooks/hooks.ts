// src/store/hooks.ts - Enhanced version with selector hooks
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import {
  selectAuthState,
  selectIsAdmin,
  selectIsAuthenticated,
  selectUserDisplayName,
  selectUserProfile,
} from '../selectors'
import type { AppDispatch, RootState } from '../store'

// Base hooks
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// Specialized selector hooks for common use cases
export const useAuth = () => useAppSelector(selectAuthState)
export const useUserDisplayName = () => useAppSelector(selectUserDisplayName)
export const useUserProfile = () => useAppSelector(selectUserProfile)
export const useIsAuthenticated = () => useAppSelector(selectIsAuthenticated)
export const useIsAdmin = () => useAppSelector(selectIsAdmin)

// Compound hooks for complex operations
export const useAuthOperations = () => {
  const dispatch = useAppDispatch()
  const authState = useAuth()

  return {
    ...authState,
    dispatch,
  }
}
