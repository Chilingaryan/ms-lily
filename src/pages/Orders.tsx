import { Table, Tag, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { api } from '../api/mock'
import type { Order, Product, User } from '../store/store'
import styles from './Orders.module.scss'

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    api.get<Order[]>('/orders').then((r) => setOrders(r.data))
    api.get<Product[]>('/products').then((r) => setProducts(r.data))
    api.get<User[]>('/users').then((r) => setUsers(r.data))
  }, [])

  const columns = [
    {
      title: 'User',
      render: (_: any, record: Order) =>
        users.find((u) => u.id === record.userId)?.name || 'N/A',
    },
    {
      title: 'Items',
      render: (_: any, record: Order) =>
        record.items
          .map((i) => {
            const prod = products.find((p) => p.id === i.productId)
            return prod ? `${prod.name} x${i.quantity}` : ''
          })
          .join(', '),
    },
    { title: 'Total', dataIndex: 'total' },
    {
      title: 'Status',
      render: (_: any, r: Order) => <Tag>{r.status}</Tag>,
    },
  ]

  return (
    <div className={styles.page}>
      <Typography.Title>Orders</Typography.Title>
      <Table rowKey="id" dataSource={orders} columns={columns} />
      {orders.length === 0 && <p className={styles.empty}>No orders yet</p>}
    </div>
  )
}
