import { Table, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { api } from '../api/mock'
import type { User } from '../store/store'
import styles from './Users.module.scss'

export default function Users() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    api.get<User[]>('/users').then((r) => setUsers(r.data))
  }, [])

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
  ]

  return (
    <div className={styles.page}>
      <h1>Users</h1>
      <Table rowKey="id" dataSource={users} columns={columns} />
      {users.length === 0 && <p className={styles.empty}>No users available</p>}
    </div>
  )
}
