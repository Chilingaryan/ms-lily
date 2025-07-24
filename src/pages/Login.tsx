import { Button, Input } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { useAppDispatch } from '../store/hooks'
import { login } from '../store/store'
import { useNavigate } from 'react-router-dom'
import styles from './Login.module.scss'

interface LoginForm {
  email: string
  password: string
}

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>()

  const onSubmit = async () => {
    // simulate async login request
    await new Promise((resolve) => setTimeout(resolve, 500))
    dispatch(login())
    navigate('/', { replace: true })
  }

  return (
    <div className={styles.login}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h1>Login</h1>
        <label className={styles.field}>
          Email
          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <Input {...field} />}
          />
          {errors.email && <span className={styles.error}>Email is required</span>}
        </label>
        <label className={styles.field}>
          Password
          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <Input.Password {...field} />}
          />
          {errors.password && (
            <span className={styles.error}>Password is required</span>
          )}
        </label>
        <Button type="primary" htmlType="submit" loading={isSubmitting} block>
          Login
        </Button>
      </form>
    </div>
  )
}
