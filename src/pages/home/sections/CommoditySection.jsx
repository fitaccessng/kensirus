import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../Reveal'
import { useLanguage } from '../../../context/LanguageContext'
import { commodityImages } from '../../../assets/commodityImages'

const commodities = [
  {
    name: 'Lithium',
    category: 'Battery Minerals',
    slug: 'lithium',
    number: '1',
    image: commodityImages.lithium.card,
    description: 'For buyers seeking lithium materials for industrial and battery supply chains. Product form, grade, and availability are subject to confirmation.',
  },
  {
    name: 'Copper',
    category: 'Industrial Metals',
    slug: 'copper',
    number: '2',
    image: commodityImages.copper.card,
    description: "For buyers seeking copper for industrial and electrical applications. Product specifications and supply terms are discussed based on the buyer's requirements.",
  },
  {
    name: 'Cassava',
    category: 'Agricultural Commodities',
    slug: 'cassava',
    number: '3',
    image: commodityImages.cassava.card,
    description: 'For buyers seeking cassava and related products for food or industrial use. Product form, quality requirements, and availability must be confirmed.',
  },
]

export default function CommoditySection() {
  const { t } = useLanguage()

  return (
    <section className="ks-section ks-commodities" id="commodities">
      <div className="ks-container">
        <Reveal className="ks-section-heading ks-commodity-heading">
          <div>
            <span className="ks-eyebrow ks-eyebrow-dark">{t('Our products')}</span>
            <h2>{t('Commodities We Focus On')}</h2>
          </div>
          <p>{t('Our current focus is lithium, copper, and cassava. Product specifications, availability, quantities, and commercial terms are confirmed during each enquiry.')}</p>
        </Reveal>
        <div className="ks-commodity-layout">
          {commodities.map((item, index) => (
            <Reveal key={item.slug} className={`ks-commodity-card ks-commodity-card-${index + 1}`}>
              <Link to={`/products/${item.slug}`} className="ks-commodity-link" aria-label={`${t('View')} ${t(item.name)}`}>
                <div className="ks-commodity-photo" style={{ backgroundImage: `url("${item.image}")` }} role="img" aria-label={`${t(item.name)} ${t('commodity context')}`} />
                <div className="ks-commodity-overlay" />
                <div className="ks-commodity-top"><span>{t(item.category)}</span><span>{item.number}</span></div>
                <div className="ks-commodity-copy">
                  <h3>{item.name}</h3>
                  <p>{t(item.description)}</p>
                  <span className="ks-commodity-cta">{t('View')} {t(item.name)} <ArrowUpRight size={17} /></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
