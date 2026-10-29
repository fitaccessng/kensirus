import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import IndependentPageFrame from '../components/layout/IndependentPageFrame'
import { useLanguage } from '../context/LanguageContext'

const products = [
  { slug: 'lithium', name: 'Lithium', category: 'Battery Minerals', description: 'Lithium is an important material in battery supply chains and energy storage. Buyers can enquire about their required product form, specifications, quantity, and destination.', image: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1400&q=88', considerations: ['Required product form', 'Grade or assay requirements', 'Quantity', 'Destination and delivery terms', 'Inspection and documentation requirements'] },
  { slug: 'copper', name: 'Copper', category: 'Industrial Metals', description: 'Copper is used in electrical systems, industrial equipment, infrastructure, and other applications. Enquiries should specify the required product form and technical requirements.', image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=88', considerations: ['Product form and specification', 'Grade or purity requirements', 'Quantity and packaging', 'Destination and delivery terms', 'Inspection and documentation requirements'] },
  { slug: 'cassava', name: 'Cassava', category: 'Agricultural Commodities', description: 'Cassava serves food and industrial processing markets. Buyers should specify the intended product form and any applicable quality, processing, and packaging requirements.', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=88', considerations: ['Required product form', 'Quality and processing requirements', 'Quantity and packaging', 'Destination', 'Applicable regulatory and export documentation'] },
]

const supportAreas = [
  ['Buyer Requirement Review', 'Clarifying the requested commodity, specifications, quantity, and destination.'],
  ['Commercial Discussions', 'Discussing proposed pricing, volumes, delivery arrangements, and contract terms.'],
  ['Documentation Coordination', 'Identifying relevant company, product, inspection, and export documentation.'],
  ['Shipment Coordination', 'Discussing applicable logistics and shipment arrangements once a transaction has been agreed.'],
]

export default function Products() {
  const { t } = useLanguage()
  const [filter, setFilter] = useState('All Products')

  const visibleProducts = useMemo(() => {
    if (filter === 'All Products') return products
    return products.filter((product) => product.category === filter)
  }, [filter])

  return (
    <IndependentPageFrame pageClass="products-page">
      <section className="ks-inner-hero ks-products-hero"><div className="ks-inner-hero-image" role="img" aria-label={t('Industrial metal processing')} /><div className="ks-inner-hero-shade" /><div className="ks-inner-wrap ks-inner-hero-copy"><span className="ks-inner-eyebrow">{t('Our products and services')}</span><h1>{t('Commodity Supply Enquiries for Industrial and Agricultural Markets')}</h1><p>{t('Our current commodity focus includes lithium, copper, and cassava. We review enquiries based on product requirements, quantities, destination, and commercial terms.')}</p><Link className="ks-page-button ks-page-button-lime" to="/request-a-quote">{t('Submit a Product Enquiry')} <ArrowRight size={17} /></Link></div></section>

      <section className="ks-products-intro ks-inner-section"><div className="ks-inner-wrap"><div className="ks-inner-heading"><div><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Commodity portfolio')}</span><h2>{t('Products for Different Markets')}</h2></div><p>{t('Product forms, grades, quantities, and specifications are subject to confirmation for each enquiry.')}</p></div><div className="ks-product-filters" role="group" aria-label={t('Filter products')}>{['All Products', ...products.map((product) => product.category)].map((item) => <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)} className={filter === item ? 'is-selected' : ''}>{t(item)}</button>)}</div></div></section>
      <div className="ks-product-features">{visibleProducts.map((product) => <section className="ks-product-feature" id={product.slug} key={product.slug}><div className="ks-product-image" style={{ backgroundImage: `url("${product.image}")` }} role="img" aria-label={t(`${product.name} industrial or agricultural context`)} /><div className="ks-product-content"><span className="ks-product-category">{t(product.category)}</span><h2>{product.name}</h2><p>{t(product.description)}</p><ul className="ks-product-considerations">{product.considerations.map((item) => <li key={item}>{t(item)}</li>)}</ul><Link className="ks-page-button ks-page-button-dark" to={`/request-a-quote?commodity=${product.slug}`}>{t('Enquire About')} {t(product.name)} <ArrowRight size={17} /></Link></div></section>)}</div>

      <section className="ks-products-services"><div className="ks-inner-wrap"><div className="ks-inner-heading"><div><span className="ks-inner-eyebrow">{t('Trade support')}</span><h2>{t('Support for Commodity Enquiries')}</h2></div><p>{t('These activities may form part of a transaction, subject to capabilities and agreed arrangements.')}</p></div><div className="ks-support-grid">{supportAreas.map(([title, text]) => <article key={title}><h3>{t(title)}</h3><p>{t(text)}</p></article>)}</div></div></section>

      <section className="ks-buyer-requirements"><div className="ks-inner-wrap"><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Buyer information')}</span><h2>{t('Help Us Understand Your Requirements')}</h2><ul>{['Commodity and product form', 'Required specifications', 'Quantity and expected frequency of orders', 'Destination country and delivery preference', 'Inspection and documentation requirements', 'Preferred delivery terms, if known'].map((item) => <li key={item}>{t(item)}</li>)}</ul><p>{t('If some details are not yet available, submit the information you have and we can clarify the remaining requirements.')}</p><Link to="/request-a-quote" className="ks-page-button ks-page-button-dark">{t('Request a Quote')} <ArrowRight size={17} /></Link></div></section>

      <section className="ks-doc-preview"><div className="ks-inner-wrap ks-doc-preview-grid"><div><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Product information')}</span><h2>{t('Product Details and Documentation')}</h2><p>{t('Product specifications, test reports, packaging information, and other supporting documents depend on the commodity and what is available for the enquiry. Relevant information can be discussed during the commercial process.')}</p><Link className="ks-page-button ks-page-button-line" to="/compliance">{t('View Compliance Information')} <ArrowUpRight size={17} /></Link></div><div className="ks-doc-preview-image" role="img" aria-label={t('Laboratory equipment used for product analysis')} /></div></section>

      <section className="ks-inner-section ks-page-cta"><div className="ks-inner-wrap ks-page-cta-row"><div><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Product enquiries')}</span><h2>{t('Have a Specific Product Requirement?')}</h2><p>{t('Send us the product details, quantity, and destination to begin a discussion.')}</p></div><Link className="ks-page-button ks-page-button-dark" to="/request-a-quote">{t('Submit Your Enquiry')} <ArrowRight size={17} /></Link></div></section>
    </IndependentPageFrame>
  )
}
