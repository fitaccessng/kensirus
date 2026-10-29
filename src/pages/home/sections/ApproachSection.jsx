import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../Reveal'
import { useLanguage } from '../../../context/LanguageContext'

const steps = [
  { number: '01', title: 'Understand the Requirement', text: 'We review the requested commodity, specifications, quantity, and destination.' },
  { number: '02', title: 'Agree on Commercial Terms', text: 'We discuss pricing, delivery arrangements, payment terms, and other contract requirements.' },
  { number: '03', title: 'Review Documentation', text: 'We identify the product, inspection, and export documents relevant to the transaction.' },
  { number: '04', title: 'Coordinate the Transaction', text: 'Once terms are agreed, the parties proceed with the applicable contract, inspection, shipment, and payment arrangements.' },
]

export default function ApproachSection() {
  const { t } = useLanguage()

  return (
    <section className="ks-section ks-approach">
      <div className="ks-container">
        <Reveal className="ks-approach-heading">
          <span className="ks-eyebrow">{t('How we work')}</span>
          <h2>{t('Clear Terms.')}<br />{t('Careful Coordination.')}</h2>
          <p>{t("Every enquiry starts with understanding the buyer's requirements. We discuss product specifications, quantities, destination, documentation, and commercial terms before a transaction proceeds.")}</p>
        </Reveal>
        <div className="ks-approach-steps">
          {steps.map((step) => (
            <Reveal key={step.number} className="ks-approach-step">
              <span className="ks-step-number">{step.number}</span>
              <h3>{t(step.title)}</h3>
              <p>{t(step.text)}</p>
            </Reveal>
          ))}
        </div>
        <Link to="/how-we-trade" className="ks-text-link ks-light-link">{t('How We Trade')} <ArrowRight size={17} /></Link>
      </div>
    </section>
  )
}
