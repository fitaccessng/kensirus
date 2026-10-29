import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: 'admin@ken-sirius.com', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.detail || 'Unable to sign in.')
      }

      const data = await response.json()
      localStorage.setItem('ken_sirius_admin_token', data.access_token)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err instanceof TypeError
        ? `Cannot reach the admin server at ${API_BASE}. Check that it is running and allows this website in its CORS settings.`
        : err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container page-wrap admin-login-page">
      <div className="section-intro">
        <span className="eyebrow">Admin access</span>
        <h1>Protected administration portal</h1>
      </div>

      <form className="quote-form admin-login-form" onSubmit={handleSubmit}>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="username" required value={form.email} onChange={handleChange} />
        </label>
        <label>
          <span>Password</span>
          <input name="password" type="password" autoComplete="current-password" required value={form.password} onChange={handleChange} />
        </label>

        {error && <small className="admin-login-error" role="alert">{error}</small>}

        <button type="submit" className="admin-login-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
