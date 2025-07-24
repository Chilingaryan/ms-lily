// Updated section for src/store/store.ts - Replace the auth slice section

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, logoutUser, getCurrentUser, getStoredToken, getStoredUser } from "../api/apiService";
import type { LoginCredentials, RegisterData, User } from "../api/apiService";

// Async thunks for auth actions
export const loginAsync = createAsyncThunk("auth/login", async (credentials: LoginCredentials, { rejectWithValue }) => {
  try {
    const response = await loginUser(credentials);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const registerAsync = createAsyncThunk("auth/register", async (userData: RegisterData, { rejectWithValue }) => {
  try {
    const response = await registerUser(userData);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Registration failed");
  }
});

export const logoutAsync = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await logoutUser();
  } catch (error: any) {
    // Even if logout fails on server, we still want to clear local state
    console.error("Logout error:", error);
  }
});

export const checkAuthAsync = createAsyncThunk("auth/checkAuth", async (_, { rejectWithValue }) => {
  try {
    const token = getStoredToken();
    if (!token) {
      throw new Error("No token found");
    }
    const user = await getCurrentUser();
    return { user, token };
  } catch (error: any) {
    return rejectWithValue("Authentication check failed");
  }
});

export interface AuthState {
  loggedIn: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Initialize state from localStorage
const initialState: AuthState = {
  loggedIn: !!getStoredToken(),
  user: getStoredUser(),
  token: getStoredToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Keep the old actions for backward compatibility
    login: (state) => {
      state.loggedIn = true;
    },
    logout: (state) => {
      state.loggedIn = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.loggedIn = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.loggedIn = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.loggedIn = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.loading = false;
        state.loggedIn = false;
        state.user = null;
        state.token = null;
        state.error = null;
      });

    // Check Auth
    builder
      .addCase(checkAuthAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(checkAuthAsync.rejected, (state) => {
        state.loading = false;
        state.loggedIn = false;
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const { clearError, login, logout } = authSlice.actions;

// Add this to your existing store configuration:
// Make sure to update the authSlice.reducer in your store configuration
