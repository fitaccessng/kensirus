const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function postEnquiry(path, payload) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    const detail = Array.isArray(result.detail)
      ? result.detail.map((item) => item.msg).join(' ')
      : result.detail
    throw new Error(detail || 'We could not submit your enquiry. Please try again.')
  }
  return result
}

export function submitQuoteEnquiry(payload) {
  return postEnquiry('/api/quotes', payload)
}

export function submitContactEnquiry(payload) {
  return postEnquiry('/api/contact-enquiries', payload)
}
