import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../Reveal'
import { commodityImages } from '../../../assets/commodityImages'

const logisticsImage = commodityImages.copper.operations

import { useLanguage } from '../../../context/LanguageContext'
export default function TradeBandSection() {
  const { t } = useLanguage()

  return (
    <section className="ks-trade-band" style={{ backgroundImage: `url("${logisticsImage}")` }}>
      <div className="ks-trade-band-overlay" />
      <div className="ks-container ks-trade-band-inner">
        <Reveal>
          <h2>{t('Looking for a Commodity Supplier?')}</h2>
          <p>{t('Send us your product requirements, quantity, and destination. Our team can review the enquiry and discuss the next steps.')}</p>
          <Link to="/request-a-quote" className="ks-button ks-button-lime">{t('Request a Quote')} <ArrowRight size={17} /></Link>
        </Reveal>
      </div>
    </section>
  )
}
