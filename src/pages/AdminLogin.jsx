import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: 'admin@ken-sirius.com', password: 'admin123' })
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
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container page-wrap">
      <div className="section-intro">
        <span className="eyebrow">Admin access</span>
        <h1>Protected administration portal</h1>
      </div>

      <form className="quote-form" onSubmit={handleSubmit} noValidate>
        <label>
          <span>Email</span>
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </label>
        <label>
          <span>Password</span>
          <input name="password" type="password" value={form.password} onChange={handleChange} />
        </label>

        {error && <small>{error}</small>}

        <button type="submit" className="button primary" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
