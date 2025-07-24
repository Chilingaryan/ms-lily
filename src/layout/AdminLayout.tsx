import { Layout, Menu, Avatar, Popover, Button } from 'antd'
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom'
import { UserOutlined } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../store/store'
import styles from './AdminLayout.module.scss'

const { Header, Content, Footer, Sider } = Layout

export default function AdminLayout() {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const loggedIn = useAppSelector((s) => s.auth.loggedIn)

  const handleLogout = () => {
    dispatch(logout())
  }

  if (!loggedIn) return <Navigate to="/login" replace />

  return (
    <Layout className={styles.layout}>
      <Sider breakpoint="lg" collapsedWidth="0" className={styles.sider}>
        <div className={styles.logo}>Admin</div>
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
          <Popover
            trigger="click"
            placement="bottomRight"
            content={
              <div className={styles.popover}>
                <Button type="text">
                  <Link to="/profile">Profile</Link>
                </Button>
                <Button type="text" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            }
          >
            <Avatar className={styles.avatar} icon={<UserOutlined />} />
          </Popover>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
        <Footer className={styles.footer}>© 2024 Admin Panel</Footer>
      </Layout>
    </Layout>
  )
}
