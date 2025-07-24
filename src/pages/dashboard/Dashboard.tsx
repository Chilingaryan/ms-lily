// src/pages/Dashboard.tsx - Refactored with selectors
import { Card, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { api } from '../api/mock'
import { useAppSelector } from '../store/hooks'
import { selectUserDisplayName } from '../store/selectors'
import type { Order, Product, User } from '../store/store'
import styles from './Dashboard.module.scss'

// Custom hook for dashboard data
const useDashboardData = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    ordersInProgress: 0,
    favouriteProducts: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [usersRes, ordersRes, productsRes] = await Promise.all([
          api.get<User[]>('/users'),
          api.get<Order[]>('/orders'),
          api.get<Product[]>('/products'),
        ])

        const orders = ordersRes.data
        const products = productsRes.data

        setStats({
          totalUsers: usersRes.data.length,
          totalOrders: orders.length,
          ordersInProgress: orders.filter((o) => o.status === 'in progress').length,
          favouriteProducts: products.filter((p) => p.favourite).length,
        })
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { loading, stats }
}

export default function Dashboard() {
  const displayName = useAppSelector(selectUserDisplayName)
  const { loading, stats } = useDashboardData()

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <h1>Dashboard</h1>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </div>
    )
  }

  const cardData = [
    { title: 'Total Users', value: stats.totalUsers, color: '#1890ff' },
    { title: 'Total Orders', value: stats.totalOrders, color: '#52c41a' },
    { title: 'Orders In Progress', value: stats.ordersInProgress, color: '#faad14' },
    { title: 'Favourite Products', value: stats.favouriteProducts, color: '#eb2f96' },
  ]

  return (
    <div className={styles.dashboard}>
      <h1>Welcome back, {displayName}!</h1>
      <div className={styles.cards}>
        {cardData.map((item) => (
          <Card
            key={item.title}
            className={styles.card}
            title={item.title}
            headStyle={{ background: item.color, color: 'white' }}
            bodyStyle={{ fontSize: '24px', fontWeight: 'bold' }}
          >
            {item.value}
          </Card>
        ))}
      </div>
    </div>
  )
}
