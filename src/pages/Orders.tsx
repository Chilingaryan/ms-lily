import { Button, Form, Modal, Select, Table, Tag } from 'antd'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { Order, updateStatus } from '../store/store'

export default function Orders() {
  const orders = useAppSelector((s) => s.orders)
  const products = useAppSelector((s) => s.products)
  const users = useAppSelector((s) => s.users)
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Order | null>(null)
  const { handleSubmit, register, reset } = useForm<{ status: Order['status'] }>()

  const onFinish = handleSubmit((data) => {
    if (editing) {
      dispatch(updateStatus({ id: editing.id, status: data.status }))
    }
    setOpen(false)
    setEditing(null)
  })

  const columns = [
    {
      title: 'User',
      render: (_: any, record: Order) => users.find((u) => u.id === record.userId)?.name || 'N/A',
    },
    {
      title: 'Items',
      render: (_: any, record: Order) => record.items.map((i) => {
        const prod = products.find((p) => p.id === i.productId)
        return prod ? `${prod.name} x${i.quantity}` : ''
      }).join(', '),
    },
    { title: 'Total', dataIndex: 'total' },
    {
      title: 'Status',
      render: (_: any, r: Order) => <Tag>{r.status}</Tag>,
    },
    {
      title: 'Action',
      render: (_: any, r: Order) => (
        <Button
          type="link"
          onClick={() => {
            setEditing(r)
            setOpen(true)
            reset({ status: r.status })
          }}
        >
          Update Status
        </Button>
      ),
    },
  ]

  return (
    <div>
      <h1>Orders</h1>
      <Table rowKey="id" dataSource={orders} columns={columns} style={{ marginTop: 16 }} />
      <Modal open={open} title="Update Status" onCancel={() => setOpen(false)} footer={null}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item label="Status">
            <Select {...register('status')} options={[
              { value: 'in progress', label: 'in progress' },
              { value: 'closed', label: 'closed' },
              { value: 'success', label: 'success' },
            ]} defaultValue={editing?.status} />
          </Form.Item>
          <Button type="primary" htmlType="submit">Save</Button>
        </Form>
      </Modal>
    </div>
  )
}
