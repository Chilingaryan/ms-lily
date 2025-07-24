// src/pages/Login.tsx - Updated version
import { Alert, Button, Input, Typography } from 'antd'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearError, loginAsync } from '../store/store'
import styles from './Login.module.scss'

interface LoginForm {
  email: string
  password: string
}

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error, loggedIn } = useAppSelector((state) => state.auth)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  // Redirect if already logged in
  useEffect(() => {
    if (loggedIn) {
      navigate('/', { replace: true })
    }
  }, [loggedIn, navigate])

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await dispatch(loginAsync(data)).unwrap()
      // Navigation will happen automatically due to the useEffect above
      console.log('Login successful:', result)
    } catch (error) {
      // Error is handled by Redux slice
      console.error('Login failed:', error)
    }
  }

  return (
    <div className={styles.login}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Typography.Title>Login</Typography.Title>

        {error && (
          <Alert
            message="Login Failed"
            description={error}
            type="error"
            closable
            onClose={() => dispatch(clearError())}
            style={{ marginBottom: 16 }}
          />
        )}

        <label className={styles.field}>
          Email
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                placeholder="Enter your email"
                size="large"
              />
            )}
          />
          {errors.email && <span className={styles.error}>{errors.email.message}</span>}
        </label>

        <label className={styles.field}>
          Password
          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            render={({ field }) => (
              <Input.Password {...field} placeholder="Enter your password" size="large" />
            )}
          />
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </label>

        <Button type="primary" htmlType="submit" loading={loading} block size="large">
          {loading ? 'Signing in...' : 'Login'}
        </Button>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#666' }}>
            Demo credentials: admin@gmail.com / Admin2025&
          </p>
        </div>
      </form>
    </div>
  )
}
