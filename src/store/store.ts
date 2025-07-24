import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type * as apiService from '../service/apiService'
import {
  getCurrentUser,
  getStoredToken,
  getStoredUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../service/apiService'

// Types for the application
export interface Product {
  id: string
  name: string
  brand: string
  sizes: number[]
  price: number
  stock: number
  image: string
  description: string
  favourite: boolean
}

export interface User {
  id: string
  name: string
  email: string
  active: boolean
  mobile_number?: string
  address?: string
  last_name?: string
  role?: string
}

export interface OrderItem {
  productId: string
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'in progress' | 'success' | 'cancelled'
}

// Async thunks for auth actions
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: apiService.LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (userData: apiService.RegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser()
    } catch (error: any) {
      console.error('Logout error:', error)
    }
  }
)

export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = getStoredToken()
      if (!token) {
        throw new Error('No token found')
      }
      const user = await getCurrentUser()
      return { user, token }
    } catch (error: any) {
      return rejectWithValue('Authentication check failed')
    }
  }
)

export interface AuthState {
  loggedIn: boolean
  user: apiService.User | null
  token: string | null
  loading: boolean
  error: string | null
}

// Initialize state from localStorage
const initialState: AuthState = {
  loggedIn: !!getStoredToken(),
  user: getStoredUser(),
  token: getStoredToken(),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    // Keep the old actions for backward compatibility
    login: (state) => {
      state.loggedIn = true
    },
    logout: (state) => {
      state.loggedIn = false
      state.user = null
      state.token = null
      state.error = null
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false
        state.loggedIn = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false
        state.loggedIn = false
        state.user = null
        state.token = null
        state.error = action.payload as string
      })

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false
        state.loggedIn = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false
        state.loggedIn = false
        state.user = null
        state.token = null
        state.error = action.payload as string
      })

    // Logout
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false
        state.loggedIn = false
        state.user = null
        state.token = null
        state.error = null
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.loading = false
        state.loggedIn = false
        state.user = null
        state.token = null
        state.error = null
      })

    // Check Auth
    builder
      .addCase(checkAuthAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.loading = false
        state.loggedIn = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(checkAuthAsync.rejected, (state) => {
        state.loading = false
        state.loggedIn = false
        state.user = null
        state.token = null
        state.error = null
      })
  },
})

export const { clearError, login, logout, updateProfile } = authSlice.actions

// Configure the store
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
