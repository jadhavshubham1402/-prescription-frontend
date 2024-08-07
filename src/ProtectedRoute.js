import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  const { token, user } = useSelector((store) => store.auth)

  const isAuth = () => {
    if (token && user) {
      return true
    } else {
      return false
    }
  }

  return isAuth() ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoute