import { Button, Form, Input } from 'antd'
import { useForm } from 'react-hook-form'

interface FormValues {
  name: string
}

export default function Profile() {
  const { register, handleSubmit, reset } = useForm<FormValues>()

  const onSubmit = (data: FormValues) => {
    alert(`Submitted: ${data.name}`)
    reset()
  }

  return (
    <div>
      <h1>Profile</h1>
      <Form onFinish={handleSubmit(onSubmit)} layout="vertical" style={{ maxWidth: 400 }}>
        <Form.Item label="Name">
          <Input {...register('name', { required: true })} />
        </Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form>
    </div>
  )
}
