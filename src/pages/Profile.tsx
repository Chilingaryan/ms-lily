// src/pages/Profile.tsx - Updated version
import { Alert, Button, Form, Input, message } from 'antd'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { updateProfile as updateProfileAPI } from '../api/apiService'
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
  const { user } = useAppSelector((s) => s.auth)
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Set default values from the authenticated user
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      phone: user?.mobile_number || '',
      address: user?.address || '',
    },
  })

  // Reset form when user data changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        password: '',
        phone: user.mobile_number || '',
        address: user.address || '',
      })
    }
  }, [user, reset])

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    setError(null)

    try {
      // Call the real API
      const updatedUser = await updateProfileAPI({
        name: data.name,
        email: data.email,
        password: data.password || undefined,
        phone: data.phone,
        address: data.address,
      })

      // Update Redux store (keeping the old action for compatibility)
      dispatch(
        updateProfile({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          address: data.address,
        })
      )

      message.success('Profile updated successfully!')

      // Clear password field after successful update
      reset({
        ...data,
        password: '',
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile'
      setError(errorMessage)
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <Alert message="Please log in to view your profile" type="warning" />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Profile</h1>
        <img className={styles.avatar} src="https://i.pravatar.cc/80" alt="avatar" />

        {error && (
          <Alert
            message="Update Failed"
            description={error}
            type="error"
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: 16, width: '100%' }}
          />
        )}

        <Form
          onFinish={handleSubmit(onSubmit)}
          layout="vertical"
          style={{ width: '100%' }}
        >
          <Form.Item
            label="Name"
            validateStatus={errors.name ? 'error' : ''}
            help={errors.name?.message}
          >
            <Input
              {...register('name', { required: 'Name is required' })}
              placeholder="Enter your name"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              type="email"
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item
            label="Phone"
            validateStatus={errors.phone ? 'error' : ''}
            help={errors.phone?.message}
          >
            <Input {...register('phone')} placeholder="Enter your phone number" />
          </Form.Item>

          <Form.Item
            label="Address"
            validateStatus={errors.address ? 'error' : ''}
            help={errors.address?.message}
          >
            <Input {...register('address')} placeholder="Enter your address" />
          </Form.Item>

          <Form.Item
            label="Password (leave empty to keep current)"
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Input.Password
              {...register('password', {
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              placeholder="Enter new password (optional)"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading} size="large">
            {loading ? 'Updating...' : 'Save Changes'}
          </Button>
        </Form>
      </div>
    </div>
  )
}
