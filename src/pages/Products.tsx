import { useState } from 'react'
import { Button, Form, Input, InputNumber, Modal, Table, Tag } from 'antd'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  addProduct,
  deleteProduct,
  Product,
  toggleFavourite,
  updateProduct,
} from '../store/store'

interface FormValues {
  id?: string
  name: string
  brand: string
  sizes: string
  price: number
  stock: number
  image: string
  description: string
}

export default function Products() {
  const products = useAppSelector((s) => s.products)
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<FormValues | null>(null)
  const { register, handleSubmit, reset } = useForm<FormValues>()

  const onFinish = handleSubmit((data) => {
    const payload: Omit<Product, 'id' | 'favourite'> = {
      name: data.name,
      brand: data.brand,
      sizes: data.sizes.split(',').map((n) => Number(n.trim())),
      price: data.price,
      stock: data.stock,
      image: data.image,
      description: data.description,
    }
    if (editing?.id) {
      dispatch(
        updateProduct({ ...payload, id: editing.id, favourite: false })
      )
    } else {
      dispatch(addProduct(payload))
    }
    setOpen(false)
    setEditing(null)
    reset()
  })

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Brand', dataIndex: 'brand' },
    { title: 'Price', dataIndex: 'price' },
    { title: 'Stock', dataIndex: 'stock' },
    {
      title: 'Favourite',
      render: (_: any, record: Product) => (
        <Button size="small" onClick={() => dispatch(toggleFavourite(record.id))}>
          {record.favourite ? '★' : '☆'}
        </Button>
      ),
    },
    {
      title: 'Action',
      render: (_: any, record: Product) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditing({
                ...record,
                sizes: record.sizes.join(', '),
              })
              setOpen(true)
              reset({ ...record, sizes: record.sizes.join(', ') })
            }}
          >
            Edit
          </Button>
          <Button type="link" danger onClick={() => dispatch(deleteProduct(record.id))}>
            Delete
          </Button>
        </>
      ),
    },
  ]

  return (
    <div>
      <h1>Products</h1>
      <Button type="primary" onClick={() => setOpen(true)}>
        Add Product
      </Button>
      <Table rowKey="id" dataSource={products} columns={columns} style={{ marginTop: 16 }} />
      <Modal
        open={open}
        title={editing ? 'Edit Product' : 'Add Product'}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
          reset()
        }}
        footer={null}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name">
            <Input {...register('name', { required: true })} />
          </Form.Item>
          <Form.Item label="Brand">
            <Input {...register('brand', { required: true })} />
          </Form.Item>
          <Form.Item label="Sizes (comma separated)">
            <Input {...register('sizes', { required: true })} />
          </Form.Item>
          <Form.Item label="Price">
            <InputNumber {...register('price', { valueAsNumber: true })} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Stock">
            <InputNumber {...register('stock', { valueAsNumber: true })} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Image URL">
            <Input {...register('image')} />
          </Form.Item>
          <Form.Item label="Description">
            <Input.TextArea {...register('description')} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {editing ? 'Update' : 'Add'}
          </Button>
        </Form>
      </Modal>
    </div>
  )
}
