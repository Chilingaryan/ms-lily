import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from './layout/AdminLayout'
import styles from './App.module.scss'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Products from './pages/Products'
import Users from './pages/Users'
import Orders from './pages/Orders'

export default function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
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
