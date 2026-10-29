import { ArrowRight, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../Reveal'

import { useLanguage } from '../../../context/LanguageContext'
export default function ClosingSection() {
  const { t } = useLanguage()

  return (
    <section className="ks-closing">
      <div className="ks-container ks-closing-inner">
        <Reveal>
          <h2>{t('Have a Commodity Requirement?')}</h2>
          <p>{t('Contact Ken Sirius with your product, quantity, and destination details to begin a trade enquiry.')}</p>
          <div className="ks-actions">
            <Link to="/request-a-quote" className="ks-button ks-button-lime">{t('Request a Quote')} <ArrowRight size={17} /></Link>
            <Link to="/contact" className="ks-button ks-button-outline">{t('Contact Us')}</Link>
          </div>
          <a className="ks-closing-email" href="mailto:info@ken-sirius.com"><Mail size={15} /> {t('info@ken-sirius.com')}</a>
        </Reveal>
        <div className="ks-closing-mark" aria-hidden="true">KS<span>.</span></div>
      </div>
    </section>
  )
}
