import { useState } from 'react'
import { ArrowRight, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import IndependentPageFrame from '../components/layout/IndependentPageFrame'
import { submitContactEnquiry } from '../services/enquiries'
import { useLanguage } from '../context/LanguageContext'

const initialForm = {
  full_name: '',
  business_email: '',
  company_name: '',
  country: '',
  enquiry_type: '',
  commodity: '',
  subject: '',
  message: '',
  required_specification: '',
  quantity: '',
  destination: '',
  delivery_terms: '',
}

const enquiryTypes = [
  ['product enquiry', 'Product enquiry'],
  ['request a quotation', 'Request a quotation'],
  ['documentation', 'Documentation'],
  ['business partnership', 'Business partnership'],
  ['general enquiry', 'General enquiry'],
]

const commodities = [['lithium', 'Lithium'], ['copper', 'Copper'], ['cassava', 'Cassava'], ['other', 'Other']]

export default function Contact() {
  const { t } = useLanguage()
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [reference, setReference] = useState('')
  const requiresCommodity = ['product enquiry', 'request a quotation'].includes(form.enquiry_type)
  const isQuote = form.enquiry_type === 'request a quotation'

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
    setReference('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setReference('')

    const additionalDetails = [
      form.required_specification && `Product specification: ${form.required_specification}`,
      form.quantity && `Required quantity: ${form.quantity}`,
      form.destination && `Destination: ${form.destination}`,
      form.delivery_terms && `Preferred delivery terms: ${form.delivery_terms}`,
      form.message,
    ].filter(Boolean).join('\n\n')

    try {
      const result = await submitContactEnquiry({
        full_name: form.full_name,
        business_email: form.business_email,
        company_name: form.company_name || null,
        country: form.country,
        enquiry_type: form.enquiry_type,
        commodity: requiresCommodity ? form.commodity || null : null,
        subject: form.subject,
        message: additionalDetails,
      })
      if (!result.success || !result.enquiry_reference) throw new Error('The enquiry could not be confirmed. Please try again.')
      setReference(result.enquiry_reference)
    } catch (submissionError) {
      setError(submissionError.message || 'We could not submit your enquiry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <IndependentPageFrame pageClass="contact-page">
      <section className="ks-inner-hero ks-contact-hero"><div className="ks-inner-hero-image" role="img" aria-label={t('Professional meeting space')} /><div className="ks-inner-hero-shade" /><div className="ks-inner-wrap ks-inner-hero-copy"><span className="ks-inner-eyebrow">{t('Contact Ken Sirius')}</span><h1>{t('Let’s Discuss Your Requirements')}</h1><p>{t('Contact us about lithium, copper, cassava, documentation, or potential business opportunities. Include as much detail as possible so we can understand your enquiry.')}</p></div></section>

      <section className="ks-contact-main"><div className="ks-inner-wrap ks-contact-grid">
        <aside className="ks-contact-details"><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Company information')}</span><h2>Ken Sirius Nigeria Limited</h2><div className="ks-contact-detail"><span>{t('Registration number')}</span><strong>RC 7321954</strong></div><div className="ks-contact-detail"><span>{t('Location')}</span><strong>{t('Abuja, Nigeria')}</strong></div><div className="ks-contact-detail"><span>{t('Email')}</span><a href="mailto:info@ken-sirius.com"><Mail size={15} /> info@ken-sirius.com</a></div><p>{t('For a quotation, you can also use our')} <Link to="/request-a-quote">{t('Request a Quote form')}</Link>.</p></aside>

        <form className="ks-contact-form" onSubmit={handleSubmit} aria-busy={submitting}>
          <h2>{t('Send an Enquiry')}</h2>
          <div className="ks-form-grid">
            <div className="ks-form-field"><label htmlFor="contact-full-name">{t('Full name')} *</label><input id="contact-full-name" name="full_name" autoComplete="name" value={form.full_name} onChange={handleChange} required minLength={2} /></div>
            <div className="ks-form-field"><label htmlFor="contact-email">{t('Business email')} *</label><input id="contact-email" type="email" name="business_email" autoComplete="email" value={form.business_email} onChange={handleChange} required /></div>
            <div className="ks-form-field"><label htmlFor="contact-company">{t('Company name')}</label><input id="contact-company" name="company_name" autoComplete="organization" value={form.company_name} onChange={handleChange} minLength={2} /></div>
            <div className="ks-form-field"><label htmlFor="contact-country">{t('Country')} *</label><input id="contact-country" name="country" autoComplete="country-name" value={form.country} onChange={handleChange} required minLength={2} /></div>
            <div className="ks-form-field"><label htmlFor="contact-enquiry-type">{t('Enquiry type')} *</label><select id="contact-enquiry-type" name="enquiry_type" value={form.enquiry_type} onChange={handleChange} required><option value="">{t('Select an enquiry type')}</option>{enquiryTypes.map(([value, label]) => <option value={value} key={value}>{t(label)}</option>)}</select></div>
            {requiresCommodity && <div className="ks-form-field"><label htmlFor="contact-commodity">{t('Commodity')} *</label><select id="contact-commodity" name="commodity" value={form.commodity} onChange={handleChange} required><option value="">{t('Select a commodity')}</option>{commodities.map(([value, label]) => <option value={value} key={value}>{t(label)}</option>)}</select></div>}
            <div className="ks-form-field ks-form-field-full"><label htmlFor="contact-subject">{t('Subject')} *</label><input id="contact-subject" name="subject" value={form.subject} onChange={handleChange} required minLength={2} /></div>
            {isQuote && <>
              <div className="ks-form-field"><label htmlFor="contact-specification">{t('Product specification')}</label><input id="contact-specification" name="required_specification" value={form.required_specification} onChange={handleChange} /></div>
              <div className="ks-form-field"><label htmlFor="contact-quantity">{t('Required quantity')}</label><input id="contact-quantity" name="quantity" value={form.quantity} onChange={handleChange} /></div>
              <div className="ks-form-field"><label htmlFor="contact-destination">{t('Destination')}</label><input id="contact-destination" name="destination" value={form.destination} onChange={handleChange} /></div>
              <div className="ks-form-field"><label htmlFor="contact-delivery-terms">{t('Preferred delivery terms')}</label><input id="contact-delivery-terms" name="delivery_terms" value={form.delivery_terms} onChange={handleChange} /></div>
            </>}
            <div className="ks-form-field ks-form-field-full"><label htmlFor="contact-message">{t('Message')} *</label><textarea id="contact-message" name="message" value={form.message} onChange={handleChange} required minLength={1} rows={5} /></div>
          </div>
          <button type="submit" className="ks-page-button ks-page-button-dark" disabled={submitting}>{submitting ? t('Submitting…') : t('Submit Enquiry')} <ArrowRight size={17} /></button>
          {error && <p className="ks-form-status" role="alert">{t(error)}</p>}
          {reference && <p className="ks-form-status" role="status" aria-live="polite">{t('Enquiry received. Reference:')} <strong>{reference}</strong></p>}
        </form>
      </div></section>

      <section className="ks-next-steps"><div className="ks-inner-wrap"><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('What happens next?')}</span><h2>{t('After You Contact Us')}</h2><div className="ks-next-grid"><article><span>01</span><h3>{t('We receive your enquiry')}</h3><p>{t('Your submitted details are recorded by our enquiry system.')}</p></article><article><span>02</span><h3>{t('The details are reviewed')}</h3><p>{t('The information is considered in relation to your request.')}</p></article><article><span>03</span><h3>{t('We follow up if needed')}</h3><p>{t('We may contact you if more information or discussion is required.')}</p></article></div></div></section>

      <section className="ks-contact-location"><div className="ks-inner-wrap"><span className="ks-inner-eyebrow">{t('Location')}</span><h2>{t('Abuja, Nigeria')}</h2><p>Ken Sirius Nigeria Limited</p></div></section>

      <section className="ks-inner-section ks-page-cta"><div className="ks-inner-wrap ks-page-cta-row"><div><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Product enquiries')}</span><h2>{t('Have a Detailed Commodity Requirement?')}</h2><p>{t('For product enquiries, include the commodity, required specifications, quantity, and destination.')}</p></div><Link className="ks-page-button ks-page-button-dark" to="/request-a-quote">{t('Request a Quote')} <ArrowRight size={17} /></Link></div></section>
    </IndependentPageFrame>
  )
}
