import { Layout, Menu } from 'antd'
import { Link, Outlet, useLocation } from 'react-router-dom'
import styles from './AdminLayout.module.scss'

const { Header, Content, Sider } = Layout

export default function AdminLayout() {
  const location = useLocation()

  return (
    <Layout className={styles.layout}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className={styles.logo}>Admin</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            { key: '/', label: <Link to="/">Dashboard</Link> },
            { key: '/profile', label: <Link to="/profile">Profile</Link> },
            { key: '/products', label: <Link to="/products">Products</Link> },
            { key: '/users', label: <Link to="/users">Users</Link> },
            { key: '/orders', label: <Link to="/orders">Orders</Link> },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} />
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
