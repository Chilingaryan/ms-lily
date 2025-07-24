// src/store/selectors.ts - New file for Reselect selectors
import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from './store'

// Base selectors
export const selectAuth = (state: RootState) => state.auth
export const selectAuthUser = (state: RootState) => state.auth.user
export const selectAuthToken = (state: RootState) => state.auth.token
export const selectAuthLoading = (state: RootState) => state.auth.loading
export const selectAuthError = (state: RootState) => state.auth.error
export const selectAuthLoggedIn = (state: RootState) => state.auth.loggedIn

// Memoized selectors using createSelector
export const selectIsAuthenticated = createSelector(
  [selectAuthLoggedIn, selectAuthToken],
  (loggedIn, token) => loggedIn && !!token
)

export const selectUserDisplayName = createSelector([selectAuthUser], (user) => {
  if (!user) return 'User'
  return `${user.name} ${user.last_name || ''}`.trim()
})

export const selectUserRole = createSelector(
  [selectAuthUser],
  (user) => user?.role || 'user'
)

export const selectIsAdmin = createSelector([selectUserRole], (role) => role === 'admin')

export const selectAuthState = createSelector([selectAuth], (auth) => ({
  isAuthenticated: auth.loggedIn && !!auth.token,
  user: auth.user,
  loading: auth.loading,
  error: auth.error,
  userDisplayName: auth.user
    ? `${auth.user.name} ${auth.user.last_name || ''}`.trim()
    : 'User',
  isAdmin: auth.user?.role === 'admin',
}))

// Profile-specific selectors
export const selectUserProfile = createSelector([selectAuthUser], (user) => {
  if (!user) return null
  return {
    id: user.id,
    name: user.name,
    last_name: user.last_name,
    email: user.email,
    mobile_number: user.mobile_number,
    country: user.country,
    address: user.address,
    city: user.city,
    postal_code: user.postal_code,
    role: user.role,
  }
})

export const selectIsProfileComplete = createSelector([selectAuthUser], (user) => {
  if (!user) return false
  const requiredFields = [user.name, user.last_name, user.email]
  return requiredFields.every((field) => field && field.trim().length > 0)
})

// Loading state selectors
export const selectAuthLoadingState = createSelector(
  [selectAuthLoading, selectAuthError],
  (loading, error) => ({
    isLoading: loading,
    hasError: !!error,
    error: error,
  })
)
