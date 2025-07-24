// src/pages/Products.tsx - Fixed to work with component-level selectors
import { Card, Input, Select, Space, Statistic, Table, Tag, Typography } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../../service/mock'
import {
  createProductSelectors,
  createSearchSelector,
  createSortSelector,
} from '../../store/selectors/dataSelectors'
import type { Product } from '../../store/store'
import styles from './Products.module.scss'

const { Search } = Input
const { Option } = Select

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Product>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filterBrand, setFilterBrand] = useState<string>('')

  // Create simple selector functions (not using createSelector for component state)
  const productSelectors = useMemo(() => createProductSelectors(products), [products])

  const searchFunction = useMemo(
    () => createSearchSelector(() => products, ['name', 'brand', 'description']),
    [products]
  )

  const sortFunction = useMemo(() => createSortSelector(() => products), [products])

  // Apply all filters and transformations
  const processedProducts = useMemo(() => {
    let filteredProducts = products

    // Apply search filter
    if (searchTerm) {
      filteredProducts = searchFunction(null, searchTerm)
    }

    // Apply brand filter
    if (filterBrand) {
      filteredProducts = filteredProducts.filter((p) => p.brand === filterBrand)
    }

    // Apply sorting
    return sortFunction(filteredProducts, sortField, sortOrder)
  }, [
    products,
    searchTerm,
    filterBrand,
    sortField,
    sortOrder,
    searchFunction,
    sortFunction,
  ])

  // Get product statistics using the simple selector approach
  const productStats = useMemo(
    () => productSelectors.selectProductStats(),
    [productSelectors]
  )

  // Get unique brands for filter
  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))),
    [products]
  )

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await api.get<Product[]>('/products')
        setProducts(response.data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      sortOrder: sortField === 'name' ? sortOrder : null,
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      sorter: true,
      sortOrder: sortField === 'brand' ? sortOrder : null,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: true,
      sortOrder: sortField === 'price' ? sortOrder : null,
      render: (price: number) => `${price.toLocaleString()}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      sorter: true,
      sortOrder: sortField === 'stock' ? sortOrder : null,
      render: (stock: number) => <Tag color={stock > 0 ? 'green' : 'red'}>{stock}</Tag>,
    },
    {
      title: 'Favourite',
      render: (_: any, record: Product) => (
        <Tag color={record.favourite ? 'gold' : undefined}>
          {record.favourite ? 'Favourite' : 'Regular'}
        </Tag>
      ),
    },
  ]

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter.field) {
      setSortField(sorter.field)
      setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc')
    }
  }

  return (
    <div className={styles.page}>
      <Typography.Title>Products</Typography.Title>

      {/* Statistics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <Card>
          <Statistic title="Total Products" value={productStats.total} />
        </Card>
        <Card>
          <Statistic title="In Stock" value={productStats.inStock} />
        </Card>
        <Card>
          <Statistic title="Out of Stock" value={productStats.outOfStock} />
        </Card>
        <Card>
          <Statistic title="Favorites" value={productStats.favorites} />
        </Card>
        <Card>
          <Statistic
            title="Average Price"
            value={productStats.averagePrice}
            precision={2}
            prefix="$"
          />
        </Card>
      </div>

      {/* Filters */}
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <Search
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Filter by brand"
            value={filterBrand}
            onChange={setFilterBrand}
            allowClear
            style={{ width: 150 }}
          >
            {brands.map((brand) => (
              <Option key={brand} value={brand}>
                {brand}
              </Option>
            ))}
          </Select>
        </Space>
        <Typography.Text type="secondary">
          Showing {processedProducts.length} of {products.length} products
        </Typography.Text>
      </Space>

      <Table
        rowKey="id"
        dataSource={processedProducts}
        columns={columns}
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} products`,
        }}
      />

      {!loading && products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Typography.Text type="secondary">No products available</Typography.Text>
        </div>
      )}
    </div>
  )
}
