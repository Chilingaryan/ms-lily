import { useState } from 'react'
import { Button, Form, Input, Modal, Table, Tag } from 'antd'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  addUser,
  deleteUser,
  toggleActive,
  updateUser,
  User,
} from '../store/store'

interface FormValues {
  id?: string
  name: string
  email: string
}

export default function Users() {
  const users = useAppSelector((s) => s.users)
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const { register, handleSubmit, reset } = useForm<FormValues>()

  const onFinish = handleSubmit((data) => {
    if (editing) {
      dispatch(updateUser({ ...editing, ...data }))
    } else {
      dispatch(addUser(data))
    }
    setOpen(false)
    setEditing(null)
    reset()
  })

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Active',
      render: (_: any, record: User) => (
        <Tag color={record.active ? 'green' : 'red'}>
          {record.active ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      render: (_: any, record: User) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditing(record)
              setOpen(true)
              reset(record)
            }}
          >
            Edit
          </Button>
          <Button type="link" danger onClick={() => dispatch(deleteUser(record.id))}>
            Delete
          </Button>
          <Button type="link" onClick={() => dispatch(toggleActive(record.id))}>
            {record.active ? 'Deactivate' : 'Activate'}
          </Button>
        </>
      ),
    },
  ]

  return (
    <div>
      <h1>Users</h1>
      <Button type="primary" onClick={() => setOpen(true)}>
        Add User
      </Button>
      <Table rowKey="id" dataSource={users} columns={columns} style={{ marginTop: 16 }} />
      <Modal
        open={open}
        title={editing ? 'Edit User' : 'Add User'}
        footer={null}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
          reset()
        }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name">
            <Input {...register('name', { required: true })} />
          </Form.Item>
          <Form.Item label="Email">
            <Input {...register('email', { required: true })} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {editing ? 'Update' : 'Add'}
          </Button>
        </Form>
      </Modal>
    </div>
  )
}
