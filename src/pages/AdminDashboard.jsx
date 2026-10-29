import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Download, ImageUp, Mail, MessageSquare, RefreshCw, Search, Upload } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const MAX_LOGO_SIZE = 2 * 1024 * 1024
const ACCEPTED_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp']

async function fetchAdminCollection(path, token, signal) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || 'Unable to load enquiries.')
  if (!Array.isArray(data)) throw new Error('The admin server returned an invalid enquiry list.')
  return data
}

function csvCell(value) {
  const text = String(value ?? '')
  const safeText = /^[\t\r ]*[=+\-@]/.test(text) ? `'${text}` : text
  return `"${safeText.replaceAll('"', '""')}"`
}

function exportEnquiries(items) {
  const columns = [
    ['type', 'Type'],
    ['reference', 'Reference'],
    ['created_at', 'Received'],
    ['full_name', 'Name'],
    ['company_name', 'Company'],
    ['business_email', 'Email'],
    ['phone_number', 'Phone'],
    ['country', 'Country'],
    ['commodity', 'Commodity'],
    ['required_specification', 'Specification'],
    ['quantity', 'Quantity'],
    ['packaging_requirements', 'Packaging'],
    ['destination_country', 'Destination country'],
    ['delivery_location', 'Delivery location'],
    ['preferred_incoterms', 'Incoterms'],
    ['expected_delivery_timeframe', 'Expected timeframe'],
    ['enquiry_type', 'Enquiry type'],
    ['subject', 'Subject'],
    ['message', 'Message'],
    ['additional_requirements', 'Additional requirements'],
  ]
  const rows = [
    columns.map(([, label]) => csvCell(label)).join(','),
    ...items.map((item) => columns.map(([key]) => csvCell(item[key])).join(',')),
  ]
  const blob = new Blob([`\uFEFF${rows.join('\r\n')}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `ken-sirius-enquiries-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function AdminDashboard() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [commodityFilter, setCommodityFilter] = useState('all')
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [logoError, setLogoError] = useState('')
  const [logoSuccess, setLogoSuccess] = useState('')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const logoInputRef = useRef(null)
  const logoPreviewUrlRef = useRef('')

  const loadEnquiries = useCallback(async (signal) => {
    const token = localStorage.getItem('ken_sirius_admin_token')
    try {
      const collections = token
        ? Promise.all([
          fetchAdminCollection('/api/admin/enquiries', token, signal),
          fetchAdminCollection('/api/admin/contact-enquiries', token, signal),
        ])
        : Promise.reject(new Error('Your admin session has expired. Sign in again to view enquiries.'))
      const [quotes, contacts] = await collections
      setError('')
      setItems([
        ...quotes.map((item) => ({ ...item, type: 'quote' })),
        ...contacts.map((item) => ({ ...item, type: 'contact' })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
    } catch (loadError) {
      if (signal?.aborted) return
      setError(loadError instanceof TypeError
        ? 'Could not reach the admin API. Check the API URL and ensure this website is allowed by the API CORS settings.'
        : loadError.message)
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    Promise.resolve().then(() => loadEnquiries(controller.signal))
    return () => controller.abort()
  }, [loadEnquiries])

  useEffect(() => () => {
    if (logoPreviewUrlRef.current) URL.revokeObjectURL(logoPreviewUrlRef.current)
  }, [])

  const commodities = useMemo(() => (
    [...new Set(items.filter((item) => item.type === 'quote').map((item) => item.commodity).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b))
  ), [items])

  const filteredItems = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    return items.filter((item) => {
      if (typeFilter !== 'all' && item.type !== typeFilter) return false
      if (commodityFilter !== 'all' && item.commodity !== commodityFilter) return false
      if (!query) return true
      return [
        item.reference,
        item.full_name,
        item.business_email,
        item.company_name,
        item.country,
        item.commodity,
        item.subject,
        item.message,
        item.enquiry_type,
      ].some((value) => String(value ?? '').toLocaleLowerCase().includes(query))
    })
  }, [commodityFilter, items, search, typeFilter])

  const handleLogoSelection = (event) => {
    const selectedFile = event.target.files?.[0]
    setLogoError('')
    setLogoSuccess('')

    if (!selectedFile) return
    if (logoPreviewUrlRef.current) URL.revokeObjectURL(logoPreviewUrlRef.current)
    if (!ACCEPTED_LOGO_TYPES.includes(selectedFile.type)) {
      logoPreviewUrlRef.current = ''
      setLogoPreview('')
      setLogoFile(null)
      setLogoError('Choose a PNG, JPEG, or WebP image.')
      event.target.value = ''
      return
    }
    if (selectedFile.size > MAX_LOGO_SIZE) {
      logoPreviewUrlRef.current = ''
      setLogoPreview('')
      setLogoFile(null)
      setLogoError('Logo files must be 2 MB or smaller.')
      event.target.value = ''
      return
    }

    logoPreviewUrlRef.current = URL.createObjectURL(selectedFile)
    setLogoPreview(logoPreviewUrlRef.current)
    setLogoFile(selectedFile)
  }

  const handleLogoUpload = async (event) => {
    event.preventDefault()
    if (!logoFile) {
      setLogoError('Choose a logo file before uploading.')
      return
    }

    setUploadingLogo(true)
    setLogoError('')
    setLogoSuccess('')

    try {
      const response = await fetch(`${API_BASE}/api/admin/logo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ken_sirius_admin_token')}`,
          'Content-Type': logoFile.type,
        },
        body: logoFile,
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Unable to upload the logo.')

      window.dispatchEvent(new Event('ken-sirius-logo-updated'))
      localStorage.setItem('ken-sirius-logo-updated', String(Date.now()))
      setLogoSuccess('Logo updated. It is now live across the website.')
      setLogoFile(null)
      setLogoPreview('')
      if (logoPreviewUrlRef.current) URL.revokeObjectURL(logoPreviewUrlRef.current)
      logoPreviewUrlRef.current = ''
      if (logoInputRef.current) logoInputRef.current.value = ''
    } catch (uploadError) {
      setLogoError(uploadError instanceof TypeError
        ? 'Could not reach the admin API. Check the API URL and CORS settings.'
        : uploadError.message)
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('ken_sirius_admin_token')
    window.location.href = '/admin/login'
  }

  return (
    <main className="container page-wrap admin-dashboard">
      <header className="admin-dashboard-header">
        <div className="section-intro">
          <span className="eyebrow">Admin dashboard</span>
          <h1>Enquiry inbox</h1>
          <p>Review and export submissions received through the website.</p>
        </div>
        <div className="admin-dashboard-actions">
          <button type="button" className="button secondary" onClick={() => {
            setLoading(true)
            loadEnquiries()
          }} disabled={loading}>
            <RefreshCw size={16} aria-hidden="true" />
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
          <button type="button" className="button secondary" onClick={() => exportEnquiries(filteredItems)} disabled={!filteredItems.length}>
            <Download size={16} aria-hidden="true" />
            Export CSV
          </button>
          <button type="button" className="button secondary" onClick={handleSignOut}>Sign out</button>
        </div>
      </header>

      <section className="admin-overview" aria-label="Enquiry totals">
        <article className="admin-stat-card">
          <span className="admin-stat-label">Total submissions</span>
          <strong>{loading ? '—' : items.length}</strong>
          <span>Records received</span>
        </article>
        <article className="admin-stat-card">
          <span className="admin-stat-label">Quote requests</span>
          <strong>{loading ? '—' : items.filter((item) => item.type === 'quote').length}</strong>
          <span>Buyer quote forms</span>
        </article>
        <article className="admin-stat-card">
          <span className="admin-stat-label">Contact messages</span>
          <strong>{loading ? '—' : items.filter((item) => item.type === 'contact').length}</strong>
          <span>General contact forms</span>
        </article>
      </section>

      <section className="admin-logo-card" aria-labelledby="admin-logo-heading">
        <div className="admin-logo-copy">
          <span className="eyebrow">Brand identity</span>
          <h2 id="admin-logo-heading">Update your website logo</h2>
          <p>Upload a PNG, JPEG, or WebP file. Your logo will appear in the site header and footers.</p>
        </div>
        <div className="admin-logo-controls">
          <div className="admin-logo-preview" aria-label="Logo preview">
            <img
              src={logoPreview || `${API_BASE}/api/site/logo`}
              alt="Selected logo preview"
              onError={(event) => {
                if (event.currentTarget.src !== `${window.location.origin}/ken-sirius-logo.svg`) {
                  event.currentTarget.src = '/ken-sirius-logo.svg'
                }
              }}
            />
          </div>
          <form className="admin-logo-form" onSubmit={handleLogoUpload}>
            <input
              id="admin-logo-file"
              ref={logoInputRef}
              className="admin-logo-input"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              aria-label="Choose a logo file"
              onChange={handleLogoSelection}
            />
            <label className="button secondary admin-logo-choose" htmlFor="admin-logo-file">
              <ImageUp size={17} aria-hidden="true" />
              Choose logo
            </label>
            <span className="admin-logo-filename">{logoFile ? logoFile.name : 'No file selected · Max 2 MB'}</span>
            <button type="submit" className="button primary" disabled={!logoFile || uploadingLogo}>
              <Upload size={16} aria-hidden="true" />
              {uploadingLogo ? 'Uploading…' : 'Upload logo'}
            </button>
          </form>
          {logoError && <p className="admin-logo-message error" role="alert">{logoError}</p>}
          {logoSuccess && <p className="admin-logo-message success" role="status">{logoSuccess}</p>}
        </div>
      </section>

      <section className="admin-inbox" aria-labelledby="admin-inbox-heading">
        <div className="admin-inbox-heading">
          <div>
            <span className="eyebrow">Inbox</span>
            <h2 id="admin-inbox-heading">Submissions</h2>
          </div>
          <span className="admin-results-count">
            {loading ? 'Loading…' : `${filteredItems.length} of ${items.length} records`}
          </span>
        </div>

        <div className="admin-inbox-filters">
          <label className="admin-search">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Search enquiries</span>
            <input
              type="search"
              placeholder="Search name, company, reference…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label className="admin-filter">
            <span className="sr-only">Filter by enquiry type</span>
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="all">All enquiry types</option>
              <option value="quote">Quote requests</option>
              <option value="contact">Contact messages</option>
            </select>
          </label>
          <label className="admin-filter">
            <span className="sr-only">Filter by commodity</span>
            <select value={commodityFilter} onChange={(event) => setCommodityFilter(event.target.value)}>
              <option value="all">All commodities</option>
              {commodities.map((commodity) => <option key={commodity} value={commodity}>{commodity}</option>)}
            </select>
          </label>
        </div>

        {error && <div className="admin-error-state" role="alert">{error}</div>}
        {loading ? (
          <div className="admin-empty-state">Loading submissions from the admin server…</div>
        ) : error ? null : items.length === 0 ? (
          <div className="admin-empty-state">No submissions have been received yet.</div>
        ) : filteredItems.length === 0 ? (
          <div className="admin-empty-state">
            No submissions match these filters.
            <button type="button" className="admin-clear-filters" onClick={() => {
              setSearch('')
              setTypeFilter('all')
              setCommodityFilter('all')
            }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="admin-enquiry-list">
            {filteredItems.map((item) => (
              <article key={`${item.type}-${item.reference}`} className="admin-enquiry-card">
                <div className="admin-enquiry-topline">
                  <span className={`admin-enquiry-type is-${item.type}`}>
                    {item.type === 'quote' ? <Mail size={14} aria-hidden="true" /> : <MessageSquare size={14} aria-hidden="true" />}
                    {item.type === 'quote' ? 'Quote request' : 'Contact message'}
                  </span>
                  <time dateTime={item.created_at}>{new Date(item.created_at).toLocaleString()}</time>
                </div>
                <div className="admin-enquiry-main">
                  <div className="admin-enquiry-person">
                    <h3>{item.full_name}</h3>
                    <a href={`mailto:${item.business_email}`}>{item.business_email}</a>
                    {item.company_name && <span>{item.company_name}</span>}
                  </div>
                  <div className="admin-enquiry-summary">
                    <span className="admin-reference">{item.reference}</span>
                    {item.commodity && <span className="admin-commodity">{item.commodity}</span>}
                    <strong>{item.type === 'quote' ? item.quantity || 'Quantity not specified' : item.subject}</strong>
                    <span>{item.country}{item.destination_country ? ` → ${item.destination_country}` : ''}</span>
                  </div>
                  <details className="admin-enquiry-details">
                    <summary>View details</summary>
                    <dl>
                      {item.type === 'quote' ? (
                        <>
                          <div><dt>Phone</dt><dd>{item.phone_number}</dd></div>
                          <div><dt>Specification</dt><dd>{item.required_specification || 'Not specified'}</dd></div>
                          <div><dt>Packaging</dt><dd>{item.packaging_requirements || 'Not specified'}</dd></div>
                          <div><dt>Destination</dt><dd>{item.delivery_location || item.destination_country || 'Not specified'}</dd></div>
                          <div><dt>Incoterms</dt><dd>{item.preferred_incoterms || 'Not specified'}</dd></div>
                          <div><dt>Expected timeframe</dt><dd>{item.expected_delivery_timeframe || 'Not specified'}</dd></div>
                          <div><dt>Additional requirements</dt><dd>{item.additional_requirements || 'None provided'}</dd></div>
                        </>
                      ) : (
                        <>
                          <div><dt>Enquiry type</dt><dd>{item.enquiry_type}</dd></div>
                          <div className="admin-detail-message"><dt>Message</dt><dd>{item.message}</dd></div>
                        </>
                      )}
                    </dl>
                  </details>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
