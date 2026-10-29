import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function AdminDashboard() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('ken_sirius_admin_token')

    const loadEnquiries = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${API_BASE}/api/admin/enquiries`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Unable to load enquiries.')
        }

        const data = await response.json()
        setItems(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadEnquiries()
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('ken_sirius_admin_token')
    window.location.href = '/admin/login'
  }

  return (
    <div className="container page-wrap">
      <div className="section-intro">
        <span className="eyebrow">Admin dashboard</span>
        <h1>Buyer enquiries</h1>
      </div>

      <div className="button-row">
        <button type="button" className="button secondary" onClick={handleSignOut}>Sign out</button>
      </div>

      {error && <div className="empty-state">{error}</div>}

      {loading ? (
        <div className="empty-state">Loading enquiries...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">No enquiries have been received yet.</div>
      ) : (
        <div className="card-grid two-up">
          {items.map((item) => (
            <article key={item.reference} className="info-card">
              <span className="pill">{item.reference}</span>
              <h3>{item.company_name}</h3>
              <p><strong>Buyer:</strong> {item.full_name}</p>
              <p><strong>Commodity:</strong> {item.commodity}</p>
              <p><strong>Email:</strong> {item.business_email}</p>
              <p><strong>Country:</strong> {item.country}</p>
              <small>{new Date(item.created_at).toLocaleString()}</small>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
