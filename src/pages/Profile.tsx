import { Button, Form, Input } from 'antd'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { updateProfile } from '../store/store'
import styles from './Profile.module.scss'

interface FormValues {
  name: string
  email: string
  password: string
  phone: string
  address: string
}

export default function Profile() {
  const profile = useAppSelector((s) => s.profile)
  const dispatch = useAppDispatch()
  const { register, handleSubmit } = useForm<FormValues>({ defaultValues: profile })

  const onSubmit = (data: FormValues) => {
    dispatch(updateProfile(data))
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Profile</h1>
        <img className={styles.avatar} src="https://i.pravatar.cc/80" alt="avatar" />
        <Form onFinish={handleSubmit(onSubmit)} layout="vertical" style={{ width: '100%' }}>
          <Form.Item label="Name">
            <Input {...register('name', { required: true })} />
          </Form.Item>
          <Form.Item label="Email">
            <Input {...register('email', { required: true })} />
          </Form.Item>
          <Form.Item label="Phone">
            <Input {...register('phone')} />
          </Form.Item>
          <Form.Item label="Address">
            <Input {...register('address')} />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password {...register('password')} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save
          </Button>
        </Form>
      </div>
    </div>
  )
}
