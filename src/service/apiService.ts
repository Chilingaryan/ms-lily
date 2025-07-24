// src/api/apiService.ts - Updated version
import axios, { type AxiosResponse } from 'axios'

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://registered-phylis-mstily=73b1dfa2.koveb.app'

// Create axios instance
export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Important for handling cookies/sessions
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored auth data on 401
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      // Redirect to login or dispatch logout action
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API calls
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  last_name: string
  email: string
  mobile_number: string
  password: string
  password_confirmation: string
  country?: string
  address?: string
  city?: string
  postal_code?: string
}

export interface User {
  id: number
  name: string
  last_name: string
  email: string
  mobile_number: string
  country?: string
  address?: string
  city?: string
  postal_code?: string
  role?: string
}

export interface AuthResponse {
  user: User
  token: string
  message?: string
}

// Get CSRF token first (required for Laravel Sanctum)
export const getCsrfToken = async (): Promise<void> => {
  await apiClient.get('/sanctum/csrf-cookie')
}

// Login user
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Get CSRF token first
  await getCsrfToken()

  const response: AxiosResponse<AuthResponse> = await apiClient.post(
    '/api/login',
    credentials
  )

  // Store token and user data
  if (response.data.token) {
    localStorage.setItem('auth_token', response.data.token)
    localStorage.setItem('user_data', JSON.stringify(response.data.user))
  }

  return response.data
}

// Register user
export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
  // Get CSRF token first
  await getCsrfToken()

  const response: AxiosResponse<AuthResponse> = await apiClient.post(
    '/api/register',
    userData
  )

  // Store token and user data
  if (response.data.token) {
    localStorage.setItem('auth_token', response.data.token)
    localStorage.setItem('user_data', JSON.stringify(response.data.user))
  }

  return response.data
}

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.post('/api/logout')
  } finally {
    // Clear stored data regardless of API response
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }
}

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  const response: AxiosResponse<User> = await apiClient.get('/api/user')
  return response.data
}

// Profile API calls
export interface ProfileUpdateData {
  name: string
  last_name: string
  email: string
  mobile_number: string
  password?: string
  password_confirmation?: string
  country?: string
  address?: string
  city?: string
  postal_code?: string
}

export const getProfile = async (): Promise<User> => {
  const response: AxiosResponse<User> = await apiClient.get('/api/profile')
  return response.data
}

export const updateProfile = async (profileData: ProfileUpdateData): Promise<User> => {
  const response: AxiosResponse<User> = await apiClient.patch('/api/profile', profileData)

  // Update stored user data
  localStorage.setItem('user_data', JSON.stringify(response.data))

  return response.data
}

// Admin API calls
export const getAdminDashboard = async () => {
  const response = await apiClient.get('/api/admin/dashboard')
  return response.data
}

export const getAdminOrders = async () => {
  const response = await apiClient.get('/api/admin/orders')
  return response.data
}

export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await apiClient.patch(`/api/admin/orders/${orderId}/status`, {
    status,
  })
  return response.data
}

// Utility functions
export const getStoredToken = (): string | null => {
  return localStorage.getItem('auth_token')
}

export const getStoredUser = (): User | null => {
  const userData = localStorage.getItem('user_data')
  return userData ? JSON.parse(userData) : null
}

export const isAuthenticated = (): boolean => {
  return !!getStoredToken()
}
