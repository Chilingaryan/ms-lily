import { Button } from 'antd'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { increment } from '../store/store'

export default function Dashboard() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Count: {count}</p>
      <Button type="primary" onClick={() => dispatch(increment())}>
        Increment
      </Button>
    </div>
  )
}
