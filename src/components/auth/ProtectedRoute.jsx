import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getDashboardPath, mapBackendRole } from '../../utils/auth'

export function ProtectedRoute({ children, allowedRole }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-sm text-muted">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const userRole = mapBackendRole(user.role)

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={getDashboardPath(user.role)} replace />
  }

  return children
}
