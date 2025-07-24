import { Card } from 'antd'
import { useEffect, useState } from 'react'
import { api } from '../api/mock'
import type { User, Product, Order } from '../store/store'
import styles from './Dashboard.module.scss'

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    api.get<User[]>('/users').then((r) => setUsers(r.data))
    api.get<Order[]>('/orders').then((r) => setOrders(r.data))
    api.get<Product[]>('/products').then((r) => setProducts(r.data))
  }, [])

  const inProgress = orders.filter((o) => o.status === 'in progress').length
  const favourites = products.filter((p) => p.favourite).length

  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      <div className={styles.cards}>
        <Card className={styles.card} title="Total Users">
          {users.length}
        </Card>
        <Card className={styles.card} title="Total Orders">
          {orders.length}
        </Card>
        <Card className={styles.card} title="Orders In Progress">
          {inProgress}
        </Card>
        <Card className={styles.card} title="Favourite Products">
          {favourites}
        </Card>
      </div>
    </div>
  )
}
