import { Button, Form, Input } from 'antd'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { updateProfile } from '../store/store'

interface FormValues {
  name: string
  email: string
  password: string
}

export default function Profile() {
  const profile = useAppSelector((s) => s.profile)
  const dispatch = useAppDispatch()
  const { register, handleSubmit } = useForm<FormValues>({ defaultValues: profile })

  const onSubmit = (data: FormValues) => {
    dispatch(updateProfile(data))
  }

  return (
    <div>
      <h1>Profile</h1>
      <Form onFinish={handleSubmit(onSubmit)} layout="vertical" style={{ maxWidth: 400 }}>
        <Form.Item label="Name">
          <Input {...register('name', { required: true })} />
        </Form.Item>
        <Form.Item label="Email">
          <Input {...register('email', { required: true })} />
        </Form.Item>
        <Form.Item label="Password">
          <Input.Password {...register('password')} />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form>
    </div>
  )
}
