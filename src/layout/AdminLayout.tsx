// src/layout/AdminLayout.tsx - Updated with Reselect selectors
import { UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Layout, Menu, Popover, Spin } from 'antd'
import { useEffect } from 'react'
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppDispatch, useAuth, useUserDisplayName } from '../store/hooks'
import { checkAuthAsync, logoutAsync } from '../store/store'
import styles from './AdminLayout.module.scss'

const { Header, Content, Footer, Sider } = Layout

export default function AdminLayout() {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user, loading } = useAuth()
  const userDisplayName = useUserDisplayName()

  // Check authentication status on mount
  useEffect(() => {
    if (!user && isAuthenticated) {
      dispatch(checkAuthAsync())
    }
  }, [dispatch, user, isAuthenticated])

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap()
      // Navigation will be handled by the redirect below
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, we still redirect
    }
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <Layout className={styles.layout}>
      <Sider breakpoint="lg" collapsedWidth="0" className={styles.sider}>
        <div className={styles.logo}>Admin Panel</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            { key: '/', label: <Link to="/">Dashboard</Link> },
            { key: '/products', label: <Link to="/products">Products</Link> },
            { key: '/users', label: <Link to="/users">Users</Link> },
            { key: '/orders', label: <Link to="/orders">Orders</Link> },
          ]}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Welcome, {userDisplayName}</span>
            <Popover
              trigger="click"
              placement="bottomRight"
              content={
                <div className={styles.popover}>
                  <Button type="text">
                    <Link to="/profile">Profile</Link>
                  </Button>
                  <Button type="text" onClick={handleLogout} loading={loading}>
                    Logout
                  </Button>
                </div>
              }
            >
              <Avatar className={styles.avatar} icon={<UserOutlined />} />
            </Popover>
          </div>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
        <Footer className={styles.footer}>© 2024 Admin Panel</Footer>
      </Layout>
    </Layout>
  )
}
