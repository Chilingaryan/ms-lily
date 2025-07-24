// src/App.tsx - Refactored with selectors
import { Spin } from 'antd'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import styles from './App.module.scss'
import ErrorBoundary from './components/ErrorBoundary'
import AdminLayout from './layout/AdminLayout'
import Dashboard from './pages/dashboard/Dashboard'
import Login from './pages/login/Login'
import Orders from './pages/orders/Orders'
import Products from './pages/products/Products'
import Profile from './pages/profile/Profile'
import Users from './pages/users/Users'
import { useCheckAuth } from './store/hooks/authHooks'

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

// Private route wrapper
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useCheckAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className={styles.app}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
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
