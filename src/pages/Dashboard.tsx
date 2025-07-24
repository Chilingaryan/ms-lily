// src/pages/Dashboard.tsx - Updated with Reselect selectors
import { Card } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/mock'
import { createDashboardSelectors } from '../store/dataSelectors'
import { useAuth } from '../store/hooks'
import type { Order, Product, User } from '../store/store'
import styles from './Dashboard.module.scss'

export default function Dashboard() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Create memoized selectors for dashboard data
  const dashboardSelectors = useMemo(
    () => createDashboardSelectors(users, orders, products),
    [users, orders, products]
  )

  // Get dashboard stats using memoized selector
  const dashboardStats = useMemo(
    () => dashboardSelectors.selectDashboardStats(),
    [dashboardSelectors]
  )

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [usersResponse, ordersResponse, productsResponse] = await Promise.all([
          api.get<User[]>('/users'),
          api.get<Order[]>('/orders'),
          api.get<Product[]>('/products'),
        ])

        setUsers(usersResponse.data)
        setOrders(ordersResponse.data)
        setProducts(productsResponse.data)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <h1>Dashboard</h1>
        <div className={styles.cards}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className={styles.card} loading />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      <p>Welcome back, {user?.name || 'Admin'}!</p>

      <div className={styles.cards}>
        <Card className={styles.card} title="Total Users">
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
            {dashboardStats.users.total}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            {dashboardStats.users.active} active users
          </div>
        </Card>

        <Card className={styles.card} title="Total Orders">
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
            {dashboardStats.orders.total}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            {dashboardStats.orders.completed} completed
          </div>
        </Card>

        <Card className={styles.card} title="Orders In Progress">
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
            {dashboardStats.orders.inProgress}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            {dashboardStats.orders.pending} pending
          </div>
        </Card>

        <Card className={styles.card} title="Favourite Products">
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#eb2f96' }}>
            {dashboardStats.products.favorites}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            of {dashboardStats.products.total} total
          </div>
        </Card>

        <Card className={styles.card} title="Products in Stock">
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
            {dashboardStats.products.inStock}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            {dashboardStats.products.outOfStock} out of stock
          </div>
        </Card>

        <Card className={styles.card} title="Total Revenue">
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#13c2c2' }}>
            ${dashboardStats.orders.totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            from completed orders
          </div>
        </Card>
      </div>
    </div>
  )
}
