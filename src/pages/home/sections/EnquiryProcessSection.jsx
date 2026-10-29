import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../Reveal'
import { useLanguage } from '../../../context/LanguageContext'

const steps = [
  { title: 'Enquiry', text: 'Share your product requirements and destination.' },
  { title: 'Review', text: 'Clarify specifications, quantity, and documentation.' },
  { title: 'Quotation', text: 'Discuss pricing and proposed commercial terms.' },
  { title: 'Agreement', text: 'Confirm the contract and payment arrangements.' },
  { title: 'Verification', text: 'Arrange applicable inspection and documentation.' },
  { title: 'Shipment', text: 'Proceed according to the agreed transaction terms.' },
]

export default function EnquiryProcessSection() {
  const { t } = useLanguage()

  return (
    <section className="ks-section ks-enquiry-process">
      <div className="ks-container">
        <Reveal className="ks-process-heading">
          <span className="ks-eyebrow ks-eyebrow-dark">{t('The process')}</span>
          <h2>{t('From Enquiry to Shipment')}</h2>
          <p>{t('The process and timelines depend on the product, destination, and agreed arrangements.')}</p>
        </Reveal>
        <div className="ks-process-list">
          {steps.map((step, index) => (
            <Reveal className="ks-process-item" key={step.title}>
              <span className="ks-process-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="ks-process-text"><strong>{t(step.title)}</strong> — {t(step.text)}</span>
              {index < steps.length - 1 && <span className="ks-process-rule" aria-hidden="true" />}
            </Reveal>
          ))}
        </div>
        <Link to="/how-we-trade" className="ks-text-link">{t('View Our Process')} <ArrowRight size={17} /></Link>
      </div>
    </section>
  )
}
