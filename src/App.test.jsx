import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  window.localStorage.removeItem('ken-sirius-language')
})

describe('Ken Sirius public website', () => {
  it('renders the home page and navigates to the product catalog', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /african commodities\. global markets/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /copper sheets being moved by forklift beside a cargo ship/i })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /products and services/i }))
    expect(screen.getByRole('heading', { name: /commodity supply enquiries for industrial and agricultural markets/i })).toBeInTheDocument()
  })

  it('switches hero slides with carousel controls', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /african commodities\. global markets\./i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(screen.getByRole('heading', { name: /reliable supply from africa to global industries\./i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Go to slide 3' }))
    expect(screen.getByRole('heading', { name: /african resources\. global opportunities\./i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: '3 of 3' })).toBeInTheDocument()
  })

  it('advances hero slides automatically', () => {
    vi.useFakeTimers()
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    act(() => {
      vi.advanceTimersByTime(6000)
    })

    expect(screen.getByRole('group', { name: '2 of 3' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /reliable supply from africa to global industries\./i })).toBeInTheDocument()
  })

  it('validates the request quote form', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/request-a-quote']}>
        <App />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /submit enquiry/i }))

    expect(screen.getByText(/full name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/business email is required/i)).toBeInTheDocument()
  })

  it('shows a visible admin sign-in button and explains when the API is unavailable', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    render(
      <MemoryRouter initialEntries={['/admin/login']}>
        <App />
      </MemoryRouter>,
    )

    const signInButton = screen.getByRole('button', { name: 'Sign in' })
    expect(signInButton).toBeVisible()
    await user.type(screen.getByLabelText('Password'), 'test-password')
    await user.click(signInButton)

    expect(await screen.findByRole('alert')).toHaveTextContent(/cannot reach the admin server/i)
  })

  it('sends every quote form field in the backend request', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: 'Enquiry submitted successfully.', enquiry_reference: 'KS-QUOTE-1234' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(
      <MemoryRouter initialEntries={['/request-a-quote']}>
        <App />
      </MemoryRouter>,
    )

    const values = {
      'Full name': 'Ada Okafor',
      'Business email': 'ada.quote@example.com',
      'Company name': 'GreenBolt Ltd',
      Country: 'Nigeria',
      'Phone or WhatsApp': '+2348000000000',
      Commodity: 'Copper cathodes',
      'Required grade/specification': '99.9% purity',
      'Quantity and unit': '25 metric tons',
      'Packaging requirements': 'Palletized bundles',
      'Destination country': 'China',
      'Delivery location': 'Shanghai Port',
      'Preferred Incoterms': 'FOB Lagos',
      'Expected delivery timeframe': 'Q3 2026',
      'Additional requirements': 'Independent inspection requested',
    }

    for (const [label, value] of Object.entries(values)) {
      await user.type(screen.getByLabelText(label), value)
    }
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: /submit enquiry/i }))

    expect(await screen.findByRole('status')).toHaveTextContent('KS-QUOTE-1234')
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/api/quotes', expect.objectContaining({ method: 'POST' }))
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      full_name: values['Full name'],
      business_email: values['Business email'],
      company_name: values['Company name'],
      country: values.Country,
      phone_number: values['Phone or WhatsApp'],
      commodity: values.Commodity,
      required_specification: values['Required grade/specification'],
      quantity: values['Quantity and unit'],
      packaging_requirements: values['Packaging requirements'],
      destination_country: values['Destination country'],
      delivery_location: values['Delivery location'],
      preferred_incoterms: values['Preferred Incoterms'],
      expected_delivery_timeframe: values['Expected delivery timeframe'],
      additional_requirements: values['Additional requirements'],
      consent_to_privacy_notice: true,
    })
  })

  it('prefills the quote commodity from a product enquiry link', () => {
    render(
      <MemoryRouter initialEntries={['/request-a-quote?commodity=copper']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText(/commodity/i)).toHaveValue('copper')
  })

  it('filters the product portfolio by commodity category', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/products']}>
        <App />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Industrial Metals' }))

    expect(screen.getByRole('heading', { name: 'Copper' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Lithium' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Cassava' })).not.toBeInTheDocument()
  })

  it.each([
    ['lithium', 'Lithium-bearing mineral', 5],
    ['copper', 'Copper-bearing ore', 5],
    ['cassava', 'Harvested cassava roots', 5],
  ])('shows more %s images on its product detail page', (slug, galleryImage, imageCount) => {
    render(
      <MemoryRouter initialEntries={[`/products/${slug}`]}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: new RegExp(`${slug} in focus`, 'i') })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: galleryImage })).toBeInTheDocument()
    expect(document.querySelectorAll('.ks-product-gallery-item')).toHaveLength(imageCount)
  })

  it('groups secondary routes under the desktop More menu', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/products']}>
        <App />
      </MemoryRouter>,
    )

    const moreButton = screen.getByRole('button', { name: 'More' })
    expect(moreButton).toHaveAttribute('aria-expanded', 'false')
    await user.click(moreButton)

    expect(moreButton).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('menuitem', { name: 'How We Trade' })).toHaveAttribute('href', '/how-we-trade')
    expect(screen.getByRole('menuitem', { name: 'Compliance' })).toHaveAttribute('href', '/compliance')
    expect(screen.getByRole('menuitem', { name: 'Industrialization' })).toHaveAttribute('href', '/industrialization')
  })

  it('shows the secondary destinations in the mobile More menu', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/products']}>
        <App />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Open navigation' }))
    const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation' })
    const mobileMoreButton = within(mobileNav).getByRole('button', { name: 'More' })
    await user.click(mobileMoreButton)

    expect(mobileMoreButton).toHaveAttribute('aria-expanded', 'true')
    expect(within(mobileNav).getByRole('link', { name: 'How We Trade' })).toHaveAttribute('href', '/how-we-trade')
    expect(within(mobileNav).getByRole('link', { name: 'Compliance' })).toHaveAttribute('href', '/compliance')
    expect(within(mobileNav).getByRole('link', { name: 'Industrialization' })).toHaveAttribute('href', '/industrialization')
  })

  it('translates navigation and quote action and remembers the selected language', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/products']}>
        <App />
      </MemoryRouter>,
    )

    const languageSelect = screen.getAllByRole('combobox', { name: 'Choose language' })[0]
    await user.selectOptions(languageSelect, 'fr')

    expect(within(screen.getByRole('banner')).getByRole('link', { name: 'À propos' })).toHaveAttribute('href', '/about')
    expect(within(screen.getByRole('banner')).getByRole('link', { name: 'Demander un devis' })).toHaveAttribute('href', '/request-a-quote')
    expect(screen.getByRole('heading', { name: /demandes d’approvisionnement pour les marchés industriels et agricoles/i })).toBeInTheDocument()
    expect(screen.getByText(/nous nous concentrons actuellement sur le lithium/i)).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('lang', 'fr')
    expect(window.localStorage.getItem('ken-sirius-language')).toBe('fr')

    await user.selectOptions(languageSelect, 'zh')
    expect(within(screen.getByRole('banner')).getByRole('link', { name: '关于我们' })).toHaveAttribute('href', '/about')
    expect(within(screen.getByRole('banner')).getByRole('link', { name: '请求报价' })).toHaveAttribute('href', '/request-a-quote')
    expect(screen.getByRole('heading', { name: '面向工业和农业市场的商品供应询价' })).toBeInTheDocument()
    expect(screen.getByText(/目前重点关注锂、铜和木薯/)).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('lang', 'zh-CN')

    await user.click(within(screen.getByRole('banner')).getByRole('link', { name: '关于我们' }))
    expect(screen.getByRole('heading', { name: '连接非洲商品与全球买家' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '我们的使命' })).toBeInTheDocument()
  })

  it('translates homepage sections and contact form fields', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    await user.selectOptions(screen.getAllByRole('combobox', { name: 'Choose language' })[0], 'fr')
    expect(screen.getByRole('heading', { name: /matières premières africaines\. marchés mondiaux/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Nos matières premières' })).toBeInTheDocument()

    await user.click(within(screen.getByRole('banner')).getByRole('link', { name: 'Contact' }))
    expect(screen.getByRole('heading', { name: 'Échangeons sur vos besoins' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nom complet *')).toBeInTheDocument()
    expect(screen.getByLabelText('Adresse e-mail professionnelle *')).toBeInTheDocument()
    expect(screen.getByLabelText('Type de demande *')).toBeInTheDocument()
  })

  it('submits a contact enquiry and displays the backend reference', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: 'Contact enquiry submitted successfully.', enquiry_reference: 'KS-C-12345678' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(
      <MemoryRouter initialEntries={['/contact']}>
        <App />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/full name/i), 'Ada Okafor')
    await user.type(screen.getByLabelText(/business email/i), 'ada@example.com')
    await user.type(screen.getByLabelText(/company name/i), 'GreenBolt Ltd')
    await user.type(screen.getByLabelText(/country/i), 'Nigeria')
    await user.selectOptions(screen.getByLabelText(/enquiry type/i), 'request a quotation')
    await user.selectOptions(screen.getByLabelText(/commodity/i), 'copper')
    await user.type(screen.getByLabelText(/^subject/i), 'Copper enquiry')
    await user.type(screen.getByLabelText(/product specification/i), 'Grade A cathodes')
    await user.type(screen.getByLabelText(/required quantity/i), '25 metric tons')
    await user.type(screen.getByLabelText(/^destination/i), 'Shanghai, China')
    await user.type(screen.getByLabelText(/preferred delivery terms/i), 'FOB Lagos')
    await user.type(screen.getByLabelText(/^message/i), 'Please review this product enquiry.')
    await user.click(screen.getByRole('button', { name: /submit enquiry/i }))

    expect(await screen.findByRole('status')).toHaveTextContent('KS-C-12345678')
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/api/contact-enquiries', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }))
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      full_name: 'Ada Okafor',
      business_email: 'ada@example.com',
      company_name: 'GreenBolt Ltd',
      country: 'Nigeria',
      enquiry_type: 'request a quotation',
      commodity: 'copper',
      subject: 'Copper enquiry',
      message: expect.stringContaining('Product specification: Grade A cathodes'),
    })
    const contactPayload = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(contactPayload.message).toContain('Required quantity: 25 metric tons')
    expect(contactPayload.message).toContain('Destination: Shanghai, China')
    expect(contactPayload.message).toContain('Preferred delivery terms: FOB Lagos')
    expect(contactPayload.message).toContain('Please review this product enquiry.')
  })

  it('shows a useful error when contact submission fails', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ detail: 'The service is temporarily unavailable.' }),
    }))

    render(
      <MemoryRouter initialEntries={['/contact']}>
        <App />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/full name/i), 'Ada Okafor')
    await user.type(screen.getByLabelText(/business email/i), 'ada@example.com')
    await user.type(screen.getByLabelText(/country/i), 'Nigeria')
    await user.selectOptions(screen.getByLabelText(/enquiry type/i), 'general enquiry')
    await user.type(screen.getByLabelText(/^subject/i), 'General question')
    await user.type(screen.getByLabelText(/^message/i), 'Please contact me.')
    await user.click(screen.getByRole('button', { name: /submit enquiry/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('The service is temporarily unavailable.')
    expect(screen.queryByText(/enquiry received/i)).not.toBeInTheDocument()
  })
})
