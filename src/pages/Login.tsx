// src/pages/Login.tsx - Refactored with custom hooks
import { Alert, Button, Input, Typography } from 'antd'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'
import { useAuth, useLogin } from '../store/authHooks'
import styles from './Login.module.scss'

interface LoginForm {
  email: string
  password: string
}

export default function Login() {
  const { isAuthenticated } = useAuth()
  const { login, isLoading, error, clearError } = useLogin()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Clear error when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const onSubmit = async (data: LoginForm) => {
    await login(data)
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
            onClose={clearError}
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
                disabled={isLoading}
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
              <Input.Password
                {...field}
                placeholder="Enter your password"
                size="large"
                disabled={isLoading}
              />
            )}
          />
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </label>

        <Button type="primary" htmlType="submit" loading={isLoading} block size="large">
          {isLoading ? 'Signing in...' : 'Login'}
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
