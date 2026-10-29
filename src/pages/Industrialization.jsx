import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import IndependentPageFrame from '../components/layout/IndependentPageFrame'
import { useLanguage } from '../context/LanguageContext'

const benefits = [
  ['Local Processing', 'Processing more raw materials locally can create opportunities for manufacturing and related industries.'],
  ['Employment and Skills', 'Industrial development can create demand for technical skills, production, maintenance, logistics, and other supporting services.'],
  ['Stronger Supply Chains', 'Local processing and supporting businesses can help build more connected domestic and regional supply chains.'],
  ['Long-Term Investment', 'Industrial growth requires sustained investment, practical planning, market access, and responsible business relationships.'],
]

const commodityNotes = [
  ['Lithium', 'Lithium is important to battery supply chains and energy storage. Developing related opportunities depends on resource quality, processing capability, investment, and market demand.'],
  ['Copper', 'Copper supports electrical infrastructure and industrial applications. Processing and manufacturing opportunities depend on suitable facilities, technical expertise, and commercial viability.'],
  ['Cassava', 'Cassava supports food and industrial processing. Improved processing capacity can create opportunities for products used in food, manufacturing, and other markets.'],
]

export default function Industrialization() {
  const { t } = useLanguage()

  return (
    <IndependentPageFrame pageClass="industry-page">
      <section className="ks-inner-hero ks-industry-hero"><div className="ks-inner-hero-image" role="img" aria-label={t('Industrial production equipment')} /><div className="ks-inner-hero-shade" /><div className="ks-inner-wrap ks-inner-hero-copy"><span className="ks-inner-eyebrow">{t('Our industrialization vision')}</span><h1>{t('Africa Can Create More Value from Its Resources')}</h1><p>{t('African commodities support global industries, but greater value can also come from local processing, technical capacity, and stronger supply chains.')}</p></div></section>

      <section className="ks-industry-challenge"><div className="ks-inner-wrap ks-industry-challenge-grid"><div><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('The challenge')}</span><h2>{t('Moving Beyond Raw Material Exports')}</h2></div><div className="ks-industry-challenge-copy"><p>{t('Many African economies export raw materials with limited processing before those materials reach international markets. This can limit opportunities to develop local industries, technical skills, and related businesses.')}</p><p>{t('Increasing local value addition requires investment, infrastructure, reliable power, technical expertise, suitable policies, and access to markets.')}</p></div></div></section>

      <section className="ks-industry-benefits"><div className="ks-inner-wrap"><div className="ks-inner-heading"><div><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Potential benefits')}</span><h2>{t('Why Value Addition Matters')}</h2></div><p>{t('These are potential outcomes. Results depend on investment, market conditions, and execution.')}</p></div><div className="ks-industry-benefit-grid">{benefits.map(([title, text], index) => <article className="ks-industry-benefit" key={title}><span>0{index + 1}</span><div><h3>{t(title)}</h3><p>{t(text)}</p></div></article>)}</div></div></section>

      <section className="ks-industry-commodities"><div className="ks-inner-wrap"><span className="ks-inner-eyebrow">{t('Commodity focus')}</span><h2>{t('Three Commodities with Different Opportunities')}</h2><div className="ks-industry-commodity-grid">{commodityNotes.map(([name, text]) => <article key={name}><h3>{t(name)}</h3><p>{t(text)}</p></article>)}</div></div></section>

      <section className="ks-industry-partnership"><div className="ks-inner-wrap ks-industry-partnership-grid"><div><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Partnership')}</span><h2>{t('Progress Requires Practical Partnerships')}</h2></div><p>{t('Industrial development depends on cooperation between producers, processors, investors, technical partners, buyers, and public institutions. Clear commercial terms, reliable information, and realistic plans are important to building these relationships.')}</p></div></section>

      <section className="ks-preserved-article"><div className="ks-inner-wrap ks-preserved-article-grid"><div><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Full article')}</span><h2>{t('Ken Sirius and the Case for Industrializing African Exports')}</h2></div><article className="ks-preserved-copy"><p>{t('Africa is positioned to create more value from its resources than it has traditionally captured through raw exports alone. Lithium, copper and cassava are not just commodities; they represent opportunities for industrial development, local processing and stronger regional supply chains.')}</p><p>{t('The case for industrializing African exports is grounded in employment generation, value addition and resilient local economies. When processing is closer to the source, more jobs can be created, more knowledge can be retained and more economic activity can be anchored in African communities.')}</p><p>{t('This matters for lithium, copper and cassava alike. Each offers the possibility of moving beyond basic extraction toward a more integrated model that supports local enterprise, processing capacity and strategic trade relationships. Responsible commercial practice remains essential.')}</p><p>{t('Partnerships with international buyers, processors, investors and development partners can help unlock the next stage of industrial growth while maintaining transparency and ethical engagement. A strong export economy should not simply move raw materials out of the region; it should strengthen local value creation and long-term competitiveness.')}</p></article></div></section>

      <section className="ks-industry-perspective"><div className="ks-inner-wrap ks-industry-perspective-grid"><div className="ks-industry-perspective-image" role="img" aria-label={t('Industrial equipment in a manufacturing environment')} /><div><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Ken Sirius’s perspective')}</span><h2>{t('Trade as Part of a Wider Opportunity')}</h2><p>{t('Ken Sirius believes African commodity trade should be considered alongside opportunities for local processing, skills development, and industrial growth. Our focus is on commodity trade enquiries today, while recognising the wider opportunities that stronger African value chains can support.')}</p></div></div></section>

      <section className="ks-inner-section ks-page-cta"><div className="ks-inner-wrap ks-page-cta-row"><div><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Discuss an opportunity')}</span><h2>{t('Discuss a Commodity or Partnership Opportunity')}</h2><p>{t('Contact Ken Sirius to discuss commodity requirements, commercial opportunities, or potential partnerships.')}</p></div><div className="ks-page-actions"><Link className="ks-page-button ks-page-button-dark" to="/contact">{t('Contact Us')} <ArrowRight size={17} /></Link><Link className="ks-page-button ks-page-button-line" to="/request-a-quote">{t('Request a Quote')} <ArrowRight size={17} /></Link></div></div></section>
    </IndependentPageFrame>
  )
}
