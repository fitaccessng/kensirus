import { Navigate } from 'react-router-dom'

export default function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem('ken_sirius_admin_token')

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
