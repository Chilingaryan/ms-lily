import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const token = useAppSelector((state) => state.auth.token)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
