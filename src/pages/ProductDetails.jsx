import { Link, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import IndependentPageFrame from '../components/layout/IndependentPageFrame'
import { useLanguage } from '../context/LanguageContext'
import { commodityImages } from '../assets/commodityImages'

const products = {
  lithium: {
    name: 'Lithium',
    category: 'Battery Minerals',
    description: 'Lithium is an important material in battery supply chains and energy storage. Buyers can enquire about their required product form, specifications, quantity, and destination.',
    image: commodityImages.lithium.detail,
    gallery: commodityImages.lithium.gallery,
    considerations: ['Required product form', 'Grade or assay requirements', 'Quantity', 'Destination and delivery terms', 'Inspection and documentation requirements'],
  },
  copper: {
    name: 'Copper',
    category: 'Industrial Metals',
    description: 'Copper is used in electrical systems, industrial equipment, infrastructure, and other applications. Enquiries should specify the required product form and technical requirements.',
    image: commodityImages.copper.detail,
    gallery: commodityImages.copper.gallery,
    considerations: ['Product form and specification', 'Grade or purity requirements', 'Quantity and packaging', 'Destination and delivery terms', 'Inspection and documentation requirements'],
  },
  cassava: {
    name: 'Cassava',
    category: 'Agricultural Commodities',
    description: 'Cassava serves food and industrial processing markets. Buyers should specify the intended product form and any applicable quality, processing, and packaging requirements.',
    image: commodityImages.cassava.detail,
    gallery: commodityImages.cassava.gallery,
    considerations: ['Required product form', 'Quality and processing requirements', 'Quantity and packaging', 'Destination', 'Applicable regulatory and export documentation'],
  },
}

export default function ProductDetails() {
  const { t } = useLanguage()
  const { slug } = useParams()
  const product = products[slug]

  if (!product) {
    return (
      <IndependentPageFrame pageClass="detail-page"><div className="container page-wrap"><h1>{t('Product not found')}</h1><Link to="/products">{t('Return to products')}</Link></div></IndependentPageFrame>
    )
  }

  return (
    <IndependentPageFrame pageClass="detail-page">
      <section className="ks-inner-hero ks-product-detail-hero"><div className="ks-inner-hero-image" style={{ backgroundImage: `url("${product.image}")` }} role="img" aria-label={`${t(product.name)} ${t('industry context')}`} /><div className="ks-inner-hero-shade" /><div className="ks-inner-wrap ks-inner-hero-copy"><span className="ks-inner-eyebrow">{t(product.category)}</span><h1>{t(product.name)}</h1><p>{t(product.description)}</p><Button to={`/request-a-quote?commodity=${slug}`} variant="primary">{t('Enquire About')} {t(product.name)}</Button></div></section>
      <section className="ks-product-detail-body"><div className="ks-inner-wrap ks-product-detail-grid"><div><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Buyer information')}</span><h2>{t('What to Include in Your Enquiry')}</h2><p>{t('Product forms, specifications, quantities, and commercial terms are discussed and confirmed for each enquiry.')}</p></div><ul className="ks-product-considerations">{product.considerations.map((item) => <li key={item}>{t(item)}</li>)}</ul></div></section>
      <section className="ks-product-gallery-section" aria-labelledby="product-gallery-heading">
        <div className="ks-inner-wrap">
          <div className="ks-product-gallery-heading">
            <span className="ks-inner-eyebrow ks-eyebrow-forest">{t('From source to supply')}</span>
            <h2 id="product-gallery-heading">{t(product.name)} in Focus</h2>
          </div>
          <div className="ks-product-gallery">
            {product.gallery.map((item) => (
              <figure className="ks-product-gallery-item" key={item.caption}>
                <img src={item.image} alt={t(item.caption)} loading="lazy" />
                <figcaption>{t(item.caption)}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </IndependentPageFrame>
  )
}
