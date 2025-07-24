// src/pages/Profile.tsx - Refactored with selectors
import { Alert, Button, Form, Input, message, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { updateProfile as updateProfileAPI } from '../../service/apiService'
import { useAppDispatch, useAppSelector } from '../../store/hooks/hooks'
import { selectAuthLoading, selectUserProfile } from '../../store/selectors'
import { checkAuthAsync } from '../../store/store'
import styles from './Profile.module.scss'

interface FormValues {
  name: string
  last_name: string
  email: string
  mobile_number: string
  password: string
  country: string
  address: string
  city: string
  postal_code: string
}

export default function Profile() {
  const profile = useAppSelector(selectUserProfile)
  const authLoading = useAppSelector(selectAuthLoading)
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      last_name: '',
      email: '',
      mobile_number: '',
      password: '',
      country: '',
      address: '',
      city: '',
      postal_code: '',
    },
  })

  // Reset form when profile data changes
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.fullName.split(' ')[0] || '',
        last_name: profile.fullName.split(' ').slice(1).join(' ') || '',
        email: profile.email,
        mobile_number: profile.phone,
        password: '',
        country: profile.address.country,
        address: profile.address.street,
        city: profile.address.city,
        postal_code: profile.address.postalCode,
      })
    }
  }, [profile, reset])

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    setError(null)

    try {
      // Prepare data for API call, excluding password if empty
      const updateData = {
        name: data.name,
        last_name: data.last_name,
        email: data.email,
        mobile_number: data.mobile_number,
        country: data.country,
        address: data.address,
        city: data.city,
        postal_code: data.postal_code,
        ...(data.password && {
          password: data.password,
          password_confirmation: data.password,
        }),
      }

      // Call the API
      await updateProfileAPI(updateData)

      // Refresh user data in Redux store
      dispatch(checkAuthAsync())

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

  if (authLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div style={{ textAlign: 'center' }}>Loading...</div>
        </div>
      </div>
    )
  }

  if (!profile) {
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
        <Typography.Title>Profile</Typography.Title>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              label="First Name"
              validateStatus={errors.name ? 'error' : ''}
              help={errors.name?.message}
            >
              <Controller
                name="name"
                control={control}
                rules={{ required: 'First name is required' }}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter your first name" />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Last Name"
              validateStatus={errors.last_name ? 'error' : ''}
              help={errors.last_name?.message}
            >
              <Controller
                name="last_name"
                control={control}
                rules={{ required: 'Last name is required' }}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter your last name" />
                )}
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Email"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
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
                <Input {...field} type="email" placeholder="Enter your email" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Mobile Number"
            validateStatus={errors.mobile_number ? 'error' : ''}
            help={errors.mobile_number?.message}
          >
            <Controller
              name="mobile_number"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter your mobile number" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Country"
            validateStatus={errors.country ? 'error' : ''}
            help={errors.country?.message}
          >
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter your country" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Address"
            validateStatus={errors.address ? 'error' : ''}
            help={errors.address?.message}
          >
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter your address" />
              )}
            />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              label="City"
              validateStatus={errors.city ? 'error' : ''}
              help={errors.city?.message}
            >
              <Controller
                name="city"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Enter your city" />}
              />
            </Form.Item>

            <Form.Item
              label="Postal Code"
              validateStatus={errors.postal_code ? 'error' : ''}
              help={errors.postal_code?.message}
            >
              <Controller
                name="postal_code"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter your postal code" />
                )}
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Password (leave empty to keep current)"
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              rules={{
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              }}
              render={({ field }) => (
                <Input.Password {...field} placeholder="Enter new password (optional)" />
              )}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            size="large"
            disabled={!isDirty}
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </Button>
        </Form>
      </div>
    </div>
  )
}
