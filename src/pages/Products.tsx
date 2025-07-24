import { Table, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { api } from '../api/mock'
import type { Product } from '../store/store'
import styles from './Products.module.scss'

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    api.get<Product[]>('/products').then((r) => setProducts(r.data))
  }, [])

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Brand', dataIndex: 'brand' },
    { title: 'Price', dataIndex: 'price' },
    { title: 'Stock', dataIndex: 'stock' },
    {
      title: 'Favourite',
      render: (_: any, record: Product) => (
        <Tag color={record.favourite ? 'gold' : undefined}>
          {record.favourite ? 'Favourite' : ''}
        </Tag>
      ),
    },
  ]

  return (
    <div className={styles.page}>
      <h1>Products</h1>
      <Table rowKey="id" dataSource={products} columns={columns} />
      {products.length === 0 && (
        <p className={styles.empty}>No products available</p>
      )}
    </div>
  )
}
