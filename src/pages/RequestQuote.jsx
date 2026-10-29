import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import { submitQuoteEnquiry } from '../services/enquiries'
import { useLanguage } from '../context/LanguageContext'

const initialForm = {
  full_name: '',
  business_email: '',
  company_name: '',
  country: '',
  phone_number: '',
  commodity: '',
  required_specification: '',
  quantity: '',
  packaging_requirements: '',
  destination_country: '',
  delivery_location: '',
  preferred_incoterms: '',
  expected_delivery_timeframe: '',
  additional_requirements: '',
  consent_to_privacy_notice: false,
}

export default function RequestQuote() {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState(() => ({
    ...initialForm,
    commodity: searchParams.get('commodity') || '',
  }))
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState('')
  const [reference, setReference] = useState('')

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!form.full_name.trim()) nextErrors.full_name = 'Full name is required'
    if (!form.business_email.trim()) nextErrors.business_email = 'Business email is required'
    if (!form.company_name.trim()) nextErrors.company_name = 'Company name is required'
    if (!form.country.trim()) nextErrors.country = 'Country is required'
    if (!form.phone_number.trim()) nextErrors.phone_number = 'Phone or WhatsApp is required'
    if (!form.commodity.trim()) nextErrors.commodity = 'Commodity is required'
    if (!form.consent_to_privacy_notice) nextErrors.consent_to_privacy_notice = 'Consent is required'
    if (form.business_email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.business_email.trim())) {
      nextErrors.business_email = 'Enter a valid business email'
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    setSubmissionError('')
    setReference('')
    setSubmitting(true)
    try {
      const result = await submitQuoteEnquiry(form)
      if (!result.success || !result.enquiry_reference) throw new Error('The enquiry could not be confirmed. Please try again.')
      setReference(result.enquiry_reference)
    } catch (error) {
      setSubmissionError(t(error.message || 'We could not submit your enquiry. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container page-wrap">
      <div className="section-intro">
        <span className="eyebrow">{t('Request a quote')}</span>
        <h1>{t('Share your product requirements')}</h1>
      </div>

      <div className="contact-grid">
        <div className="text-card">
          <h3>{t('Buyer guidance')}</h3>
          <p>{t('Tell us the commodity, required specification and destination information. The team will review the request and return the relevant commercial terms and documentation considerations.')}</p>
          <p><strong>{t('Email')}:</strong> <a href="mailto:info@ken-sirius.com">info@ken-sirius.com</a></p>
          <p><strong>{t('Location')}:</strong> {t('Abuja, Nigeria')}</p>
        </div>

        <form className="quote-form" onSubmit={handleSubmit} noValidate aria-busy={submitting}>
          <div className="field-grid">
            <label>
              <span>{t('Full name')}</span>
              <input name="full_name" value={form.full_name} onChange={handleChange} />
              {errors.full_name && <small>{t(errors.full_name)}</small>}
            </label>
            <label>
              <span>{t('Business email')}</span>
              <input type="email" name="business_email" value={form.business_email} onChange={handleChange} />
              {errors.business_email && <small>{t(errors.business_email)}</small>}
            </label>
            <label>
              <span>{t('Company name')}</span>
              <input name="company_name" value={form.company_name} onChange={handleChange} />
              {errors.company_name && <small>{t(errors.company_name)}</small>}
            </label>
            <label>
              <span>{t('Country')}</span>
              <input name="country" value={form.country} onChange={handleChange} />
              {errors.country && <small>{t(errors.country)}</small>}
            </label>
            <label>
              <span>{t('Phone or WhatsApp')}</span>
              <input name="phone_number" value={form.phone_number} onChange={handleChange} />
              {errors.phone_number && <small>{t(errors.phone_number)}</small>}
            </label>
            <label>
              <span>{t('Commodity')}</span>
              <input name="commodity" value={form.commodity} onChange={handleChange} />
              {errors.commodity && <small>{t(errors.commodity)}</small>}
            </label>
            <label>
              <span>{t('Required grade/specification')}</span>
              <input name="required_specification" value={form.required_specification} onChange={handleChange} />
            </label>
            <label>
              <span>{t('Quantity and unit')}</span>
              <input name="quantity" value={form.quantity} onChange={handleChange} />
            </label>
            <label>
              <span>{t('Packaging requirements')}</span>
              <input name="packaging_requirements" value={form.packaging_requirements} onChange={handleChange} />
            </label>
            <label>
              <span>{t('Destination country')}</span>
              <input name="destination_country" value={form.destination_country} onChange={handleChange} />
            </label>
            <label>
              <span>{t('Delivery location')}</span>
              <input name="delivery_location" value={form.delivery_location} onChange={handleChange} />
            </label>
            <label>
              <span>{t('Preferred Incoterms')}</span>
              <input name="preferred_incoterms" value={form.preferred_incoterms} onChange={handleChange} />
            </label>
            <label>
              <span>{t('Expected delivery timeframe')}</span>
              <input name="expected_delivery_timeframe" value={form.expected_delivery_timeframe} onChange={handleChange} />
            </label>
            <label className="full-width">
              <span>{t('Additional requirements')}</span>
              <textarea name="additional_requirements" value={form.additional_requirements} onChange={handleChange} rows="4" />
            </label>
          </div>

          <label className="checkbox-row">
            <input type="checkbox" name="consent_to_privacy_notice" checked={form.consent_to_privacy_notice} onChange={handleChange} />
            <span>{t('I consent to the privacy notice and confirm the information provided is accurate.')}</span>
          </label>
          {errors.consent_to_privacy_notice && <small>{t(errors.consent_to_privacy_notice)}</small>}

          <Button type="submit" variant="primary" disabled={submitting}>{submitting ? t('Submitting…') : t('Submit enquiry')}</Button>

          {submissionError && <p role="alert" className="form-error">{submissionError}</p>}
          {reference && <div className="success-box" role="status" aria-live="polite"><span>{t('Enquiry received. Reference:')} <strong>{reference}</strong></span></div>}
        </form>
      </div>
    </div>
  )
}
