import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './layout/AdminLayout'
import styles from './App.module.scss'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Products from './pages/Products'
import Users from './pages/Users'
import Orders from './pages/Orders'
import Login from './pages/Login'
import { useAppSelector } from './store/hooks'

export default function App() {
  const loggedIn = useAppSelector((s) => s.auth.loggedIn)

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={loggedIn ? <AdminLayout /> : <Navigate to="/login" replace />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="products" element={<Products />} />
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}
