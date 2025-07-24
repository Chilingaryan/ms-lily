import { Button, Card, Form, Input } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from '../api/mock'
import { useAppDispatch } from '../store/hooks'
import { setToken } from '../store/store'
import styles from './SignIn.module.scss'

interface LoginForm {
  email: string
  password: string
}

export default function SignIn() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/'

  const onFinish = (values: LoginForm) => {
    api.post('/login', values).then((r) => {
      dispatch(setToken(r.data.token))
      navigate(from, { replace: true })
    })
  }

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <h1>Sign In</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}> 
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
