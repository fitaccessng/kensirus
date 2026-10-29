import { ArrowDownRight, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../Reveal'
import { useLanguage } from '../../../context/LanguageContext'

const heroImage = 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1800&q=88'

export default function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="ks-hero">
      <div className="ks-hero-image" style={{ backgroundImage: `url("${heroImage}")` }} role="img" aria-label={t('Industrial processing equipment in a working facility')} />
      <div className="ks-hero-shade" />
      <div className="ks-container ks-hero-content">
        <Reveal>
          <h1 aria-label={`${t('African Commodities.')} ${t('Global Markets.')}`}>{t('African Commodities.')}<br /><span>{t('Global Markets.')}</span></h1>
          <p>{t('Ken Sirius Nigeria Limited works with buyers seeking lithium, copper, and cassava from Africa. We support commodity enquiries, commercial discussions, and trade documentation.')}</p>
          <div className="ks-actions">
            <Link to="/request-a-quote" className="ks-button ks-button-lime">{t('Request a Quote')} <ArrowRight size={17} /></Link>
            <Link to="/products" className="ks-button ks-button-outline">{t('Explore Our Products')} <ArrowDownRight size={17} /></Link>
          </div>
          <div className="ks-hero-location"><span className="ks-location-dot" /> {t('Abuja, Nigeria')}</div>
        </Reveal>
      </div>
    </section>
  )
}
