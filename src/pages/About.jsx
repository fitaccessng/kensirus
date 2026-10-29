import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import IndependentPageFrame from '../components/layout/IndependentPageFrame'
import { useLanguage } from '../context/LanguageContext'

const values = [
  ['Integrity', 'We communicate honestly and set clear expectations.'],
  ['Transparency', 'We aim to provide accurate information about products, terms, and outstanding requirements.'],
  ['Quality Awareness', 'We recognise the importance of product specifications, testing, and relevant documentation.'],
  ['Long-Term Relationships', 'We value professional conduct, mutual understanding, and reliable communication.'],
]

const commodities = [
  { name: 'Lithium', category: 'Battery minerals', slug: 'lithium', image: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=900&q=85' },
  { name: 'Copper', category: 'Industrial metals', slug: 'copper', image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=85' },
  { name: 'Cassava', category: 'Agricultural commodities', slug: 'cassava', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=85' },
]

export default function About() {
  const { t } = useLanguage()

  return (
    <IndependentPageFrame pageClass="about-page">
      <section className="ks-inner-hero ks-about-hero">
        <div className="ks-inner-hero-image" role="img" aria-label="Industrial processing equipment" />
        <div className="ks-inner-hero-shade" />
        <div className="ks-inner-wrap ks-inner-hero-copy">
          <span className="ks-inner-eyebrow">{t('About Ken Sirius')}</span>
          <h1>{t('Connecting African Commodities to Global Buyers')}</h1>
          <p>{t('Ken Sirius Nigeria Limited is a Nigerian company focused on lithium, copper, and cassava trade enquiries. We work to connect commodity opportunities with buyers seeking clear product information and commercial terms.')}</p>
        </div>
      </section>

      <section className="ks-inner-section ks-about-overview">
        <div className="ks-inner-wrap ks-about-overview-grid">
          <div><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Company overview')}</span><h2>{t('Who We Are')}</h2></div>
          <div className="ks-about-overview-copy">
            <p>{t('Ken Sirius Nigeria Limited focuses on commodity trade involving lithium, copper, and cassava. Our work centres on buyer enquiries, product requirements, commercial discussions, and relevant trade documentation.')}</p>
            <p>{t('We aim to build business relationships through clear communication, accurate information, and agreed terms.')}</p>
            <span className="ks-reg-number">{t('Company registration')} <strong>RC 7321954</strong></span>
          </div>
        </div>
      </section>

      <section className="ks-about-purpose">
        <div className="ks-inner-wrap ks-purpose-grid">
          <article><span className="ks-inner-eyebrow">{t('01 / Purpose')}</span><h2>{t('Our Mission')}</h2><p>{t('To connect buyers with African commodity opportunities through clear communication, responsible business practices, and professional trade coordination.')}</p></article>
          <article><span className="ks-inner-eyebrow">{t('02 / Direction')}</span><h2>{t('Our Vision')}</h2><p>{t('To contribute to the growth of African commodity trade and support opportunities for local processing, industrial development, and stronger supply chains.')}</p></article>
        </div>
      </section>

      <section className="ks-inner-section ks-values-section">
        <div className="ks-inner-wrap">
          <div className="ks-inner-heading"><div><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Our values')}</span><h2>{t('How We Work')}</h2></div><p>{t('Our principles guide how we communicate, review requirements, and conduct business.')}</p></div>
          <div className="ks-values-list">{values.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{t(title)}</h3><p>{t(text)}</p></article>)}</div>
        </div>
      </section>

      <section className="ks-inner-section ks-focus-section">
        <div className="ks-inner-wrap">
          <div className="ks-inner-heading"><div><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Commodity focus')}</span><h2>{t('Three Areas of Focus')}</h2></div></div>
          <div className="ks-focus-grid">{commodities.map((item, index) => <Link className="ks-focus-item" to={`/products/${item.slug}`} key={item.slug}><span className="ks-focus-image" style={{ backgroundImage: `url("${item.image}")` }} /><span className="ks-focus-index">0{index + 1}</span><span className="ks-focus-category">{t(item.category)}</span><strong>{item.name}</strong><ArrowUpRight size={18} /></Link>)}</div>
        </div>
      </section>

      <section className="ks-about-trade">
        <div className="ks-inner-wrap ks-about-trade-grid"><span className="ks-inner-eyebrow">{t('Our approach to African trade')}</span><h2>{t('Trade Today.')}<br />{t('Build Long-Term Value.')}</h2><div><p>{t('African commodities serve a range of industrial and agricultural markets. We believe trade can create greater value when product requirements are clear, transactions are properly documented, and business relationships are built on realistic expectations.')}</p><Link className="ks-page-button ks-page-button-lime" to="/industrialization">{t('Explore Our Industrialization Vision')} <ArrowRight size={17} /></Link></div></div>
      </section>

      <section className="ks-inner-section ks-page-cta"><div className="ks-inner-wrap ks-page-cta-row"><div><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Get in touch')}</span><h2>{t('Let’s Discuss a Business Opportunity')}</h2><p>{t('Contact Ken Sirius to discuss a commodity requirement, a potential partnership, or a business enquiry.')}</p></div><div className="ks-page-actions"><Link className="ks-page-button ks-page-button-dark" to="/contact">{t('Contact Us')} <ArrowRight size={17} /></Link><Link className="ks-page-button ks-page-button-line" to="/request-a-quote">{t('Request a Quote')} <ArrowRight size={17} /></Link></div></div></section>
    </IndependentPageFrame>
  )
}
