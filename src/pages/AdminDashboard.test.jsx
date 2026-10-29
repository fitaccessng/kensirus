import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import AdminDashboard from './AdminDashboard'

describe('admin logo upload', () => {
  beforeEach(() => {
    localStorage.setItem('ken_sirius_admin_token', 'admin-token')
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: vi.fn(() => 'blob:logo-preview'),
      revokeObjectURL: vi.fn(),
    })
  })

  afterEach(() => {
    localStorage.removeItem('ken_sirius_admin_token')
    localStorage.removeItem('ken-sirius-logo-updated')
    vi.unstubAllGlobals()
  })

  it('uploads the selected logo with admin authorization', async () => {
    const fetchMock = vi.fn((url) => Promise.resolve({
      ok: true,
      json: async () => url.endsWith('/api/admin/logo') ? { success: true } : [],
    }))
    vi.stubGlobal('fetch', fetchMock)
    const image = new File([new Uint8Array([137, 80, 78, 71])], 'company-logo.png', { type: 'image/png' })

    render(<AdminDashboard />)

    fireEvent.change(screen.getByLabelText('Choose a logo file'), {
      target: { files: [image] },
    })
    fireEvent.click(screen.getByRole('button', { name: /upload logo/i }))

    expect(await screen.findByRole('status')).toHaveTextContent('Logo updated.')
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3))
    const logoUpload = fetchMock.mock.calls.find(([url]) => url.endsWith('/api/admin/logo'))
    expect(logoUpload[0]).toBe('http://localhost:8000/api/admin/logo')
    expect(logoUpload[1]).toMatchObject({
      method: 'POST',
      headers: {
        Authorization: 'Bearer admin-token',
        'Content-Type': 'image/png',
      },
      body: image,
    })
  })

  it('shows real quote and contact submissions and filters them', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{
          id: 1,
          reference: 'KS-QUOTE-41A2',
          full_name: 'Ada Okafor',
          business_email: 'ada@example.com',
          company_name: 'GreenBolt Ltd',
          country: 'Nigeria',
          phone_number: '+2348000000000',
          commodity: 'copper',
          quantity: '25 metric tons',
          created_at: '2026-10-28T12:00:00Z',
        }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{
          id: 2,
          reference: 'KS-C-97B1',
          full_name: 'Tunde Bello',
          business_email: 'tunde@example.com',
          company_name: 'AgriWorks',
          country: 'Nigeria',
          enquiry_type: 'general enquiry',
          subject: 'Partnership discussion',
          message: 'Please contact me about a partnership.',
          commodity: null,
          created_at: '2026-10-27T12:00:00Z',
        }],
      })
    vi.stubGlobal('fetch', fetchMock)

    render(<AdminDashboard />)

    expect(await screen.findByText('KS-QUOTE-41A2')).toBeInTheDocument()
    expect(screen.getByText('KS-C-97B1')).toBeInTheDocument()
    expect(screen.getByText('2', { selector: '.admin-stat-card strong' })).toBeInTheDocument()
    expect(screen.getAllByText('1', { selector: '.admin-stat-card strong' })).toHaveLength(2)
    expect(screen.getByText('Quote request')).toBeInTheDocument()
    expect(screen.getByText('Contact message')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Search enquiries'), { target: { value: 'Partnership' } })

    expect(screen.getByText('KS-C-97B1')).toBeInTheDocument()
    expect(screen.queryByText('KS-QUOTE-41A2')).not.toBeInTheDocument()
    expect(screen.getByText('1 of 2 records')).toBeInTheDocument()
  })
})
