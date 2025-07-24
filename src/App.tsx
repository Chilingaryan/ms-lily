// src/App.tsx - Enhanced version with Reselect selectors
import { Spin } from 'antd'
import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import styles from './App.module.scss'
import ErrorBoundary from './components/ErrorBoundary'
import AdminLayout from './layout/AdminLayout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Orders from './pages/Orders'
import Products from './pages/Products'
import Profile from './pages/Profile'
import Users from './pages/Users'
import { useAppDispatch, useAuth } from './store/hooks'
import { checkAuthAsync } from './store/store'

// Loading component
const LoadingSpinner = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '16px',
    }}
  >
    <Spin size="large" />
    <p>Loading...</p>
  </div>
)

export default function App() {
  const { isAuthenticated, loading } = useAuth()
  const dispatch = useAppDispatch()

  // Check authentication status on app load
  useEffect(() => {
    // Only check auth if we don't have loading state and no current auth state
    if (!loading) {
      dispatch(checkAuthAsync())
    }
  }, [dispatch])

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className={styles.app}>
          <Routes>
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
            />
            <Route
              path="/"
              element={
                isAuthenticated ? <AdminLayout /> : <Navigate to="/login" replace />
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="products" element={<Products />} />
              <Route path="users" element={<Users />} />
              <Route path="orders" element={<Orders />} />
            </Route>
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
