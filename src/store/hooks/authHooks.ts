// src/store/authHooks.ts
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { LoginCredentials, RegisterData } from '../../service/apiService'
import {
  selectAuthLoading,
  selectAuthStatus,
  selectIsAdmin,
  selectUserDisplayName,
  selectUserProfile,
} from '../selectors'
import {
  checkAuthAsync,
  clearError,
  loginAsync,
  logoutAsync,
  registerAsync,
} from '../store'
import { useAppDispatch, useAppSelector } from './hooks'

// Hook for authentication state
export const useAuth = () => {
  const authStatus = useAppSelector(selectAuthStatus)
  const user = useAppSelector((state) => state.auth.user)
  const displayName = useAppSelector(selectUserDisplayName)
  const isAdmin = useAppSelector(selectIsAdmin)

  return { ...authStatus, user, displayName, isAdmin }
}

// Hook for login functionality
export const useLogin = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useAppSelector(selectAuthStatus)

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        await dispatch(loginAsync(credentials)).unwrap()
        navigate('/', { replace: true })
        return { success: true }
      } catch (error) {
        return { success: false, error }
      }
    },
    [dispatch, navigate]
  )

  const clearLoginError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  useEffect(() => {
    return () => {
      clearLoginError()
    }
  }, [clearLoginError])

  return {
    login,
    isLoading,
    error,
    clearError: clearLoginError,
  }
}

// Hook for logout functionality
export const useLogout = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isLoading = useAppSelector(selectAuthLoading)

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutAsync()).unwrap()
      navigate('/login', { replace: true })
    } catch (error) {
      // Even if logout fails, redirect to login
      navigate('/login', { replace: true })
    }
  }, [dispatch, navigate])

  return {
    logout,
    isLoading,
  }
}

// Hook for registration
export const useRegister = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useAppSelector(selectAuthStatus)

  const register = useCallback(
    async (userData: RegisterData) => {
      try {
        await dispatch(registerAsync(userData)).unwrap()
        navigate('/', { replace: true })
        return { success: true }
      } catch (error) {
        return { success: false, error }
      }
    },
    [dispatch, navigate]
  )

  const clearRegisterError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    register,
    isLoading,
    error,
    clearError: clearRegisterError,
  }
}

// Hook for user profile
export const useUserProfile = () => {
  const profile = useAppSelector(selectUserProfile)
  const isLoading = useAppSelector(selectAuthLoading)

  return {
    profile,
    isLoading,
  }
}

// Hook for auth guard
export const useAuthGuard = (requireAdmin = false) => {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAppSelector(selectAuthStatus)
  const isAdmin = useAppSelector(selectIsAdmin)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true })
    } else if (requireAdmin && !isAdmin && !isLoading) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate, requireAdmin])

  return { isAuthenticated, isAdmin, isLoading }
}

// Hook for checking auth on mount
export const useCheckAuth = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, isLoading } = useAppSelector(selectAuthStatus)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) dispatch(checkAuthAsync())
  }, [dispatch, isAuthenticated, isLoading])

  return { isAuthenticated, isLoading }
}
