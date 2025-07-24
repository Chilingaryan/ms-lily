import { Button, Form, Input } from 'antd'
import { useAppDispatch } from '../store/hooks'
import { login } from '../store/store'
import styles from './Login.module.scss'

export default function Login() {
  const dispatch = useAppDispatch()
  const onFinish = () => {
    dispatch(login())
  }

  return (
    <div className={styles.login}>
      <h1>Login</h1>
      <Form onFinish={onFinish} layout="vertical" style={{ maxWidth: 300 }}>
        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form>
    </div>
  )
}
