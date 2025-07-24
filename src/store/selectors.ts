// src/store/selectors.ts
import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from './store'

// Base selectors
export const selectAuthState = (state: RootState) => state.auth
export const selectAuthUser = (state: RootState) => state.auth.user
export const selectAuthToken = (state: RootState) => state.auth.token
export const selectAuthLoading = (state: RootState) => state.auth.loading
export const selectAuthError = (state: RootState) => state.auth.error
export const selectIsLoggedIn = (state: RootState) => state.auth.loggedIn

// Memoized selectors using createSelector
export const selectUserFullName = createSelector([selectAuthUser], (user) => {
  if (!user) return ''
  return `${user.name} ${user.last_name || ''}`.trim()
})

export const selectUserDisplayName = createSelector([selectAuthUser], (user) => {
  if (!user) return 'User'
  const fullName = `${user.name} ${user.last_name || ''}`.trim()
  return fullName || user.email
})

export const selectIsAdmin = createSelector(
  [selectAuthUser],
  (user) => user?.role === 'admin'
)

export const selectUserInitials = createSelector([selectAuthUser], (user) => {
  if (!user) return 'U'
  const firstInitial = user.name?.[0] || ''
  const lastInitial = user.last_name?.[0] || ''
  return (firstInitial + lastInitial).toUpperCase() || 'U'
})

export const selectIsAuthenticated = createSelector(
  [selectIsLoggedIn, selectAuthToken],
  (loggedIn, token) => loggedIn && !!token
)

export const selectAuthStatus = createSelector(
  [selectIsLoggedIn, selectAuthLoading, selectAuthError],
  (loggedIn, loading, error) => ({
    isAuthenticated: loggedIn,
    isLoading: loading,
    hasError: !!error,
    error,
  })
)

// User profile selectors
export const selectUserProfile = createSelector([selectAuthUser], (user) => {
  if (!user) return null
  return {
    id: user.id,
    fullName: `${user.name} ${user.last_name || ''}`.trim(),
    email: user.email,
    phone: user.mobile_number || '',
    address: {
      street: user.address || '',
      city: user.city || '',
      country: user.country || '',
      postalCode: user.postal_code || '',
    },
  }
})

export const selectUserContactInfo = createSelector([selectAuthUser], (user) => ({
  email: user?.email || '',
  phone: user?.mobile_number || '',
  hasCompleteContact: !!(user?.email && user?.mobile_number),
}))

export const selectUserAddressInfo = createSelector([selectAuthUser], (user) => ({
  address: user?.address || '',
  city: user?.city || '',
  country: user?.country || '',
  postalCode: user?.postal_code || '',
  hasCompleteAddress: !!(
    user?.address &&
    user?.city &&
    user?.country &&
    user?.postal_code
  ),
}))

// Auth form selectors
export const selectCanSubmitAuth = createSelector(
  [selectAuthLoading, selectAuthError],
  (loading, error) => ({
    canSubmit: !loading,
    isSubmitting: loading,
    hasError: !!error,
  })
)
