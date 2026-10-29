import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import IndependentPageFrame from '../components/layout/IndependentPageFrame'
import { useLanguage } from '../context/LanguageContext'

const steps = [
  { title: 'Initial Enquiry', text: 'The buyer provides the commodity, required specifications, quantity, destination, and any special requirements.' },
  { title: 'Requirement Review', text: 'The request is reviewed to clarify product details, outstanding information, and the proposed transaction.' },
  { title: 'Quotation and Commercial Terms', text: 'Where a quotation can be prepared, pricing and proposed commercial terms are discussed. Assumptions or conditions that need confirmation are identified.' },
  { title: 'Contract and Agreement', text: 'The parties review and agree on the applicable contract, quantities, specifications, payment arrangements, and delivery terms.' },
  { title: 'Inspection and Documentation', text: 'The parties confirm which inspections, tests, certificates, and supporting documents are required and how they will be obtained.' },
  { title: 'Shipment and Completion', text: 'Shipment, delivery, and transaction-completion arrangements proceed according to the agreed contract and confirmed logistics.' },
]

const commercialTerms = ['Product description and specifications', 'Quantity and packaging', 'Pricing and currency', 'Delivery location and applicable Incoterms', 'Inspection and acceptance requirements', 'Required documentation', 'Payment terms', 'Shipment arrangements and timelines']

export default function HowWeTrade() {
  const { t } = useLanguage()

  return (
    <IndependentPageFrame pageClass="trade-page">
      <section className="ks-inner-hero ks-trade-hero"><div className="ks-inner-hero-image" role="img" aria-label={t('Cargo port and international trade logistics')} /><div className="ks-inner-hero-shade" /><div className="ks-inner-wrap ks-inner-hero-copy"><span className="ks-inner-eyebrow">{t('Our trading process')}</span><h1>{t('A Clear Process for Every Enquiry')}</h1><p>{t("Every transaction begins with understanding the buyer's requirements. Specifications, commercial terms, documentation, and delivery arrangements are reviewed before proceeding.")}</p><Link className="ks-page-button ks-page-button-lime" to="/request-a-quote">{t('Start an Enquiry')} <ArrowRight size={17} /></Link></div></section>

      <section className="ks-trade-flow"><div className="ks-inner-wrap"><div className="ks-inner-heading"><div><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Six stages')}</span><h2>{t('From First Enquiry to Completion')}</h2></div><p>{t('Each step depends on the product, destination, counterparties, and agreed contract.')}</p></div><div className="ks-trade-steps">{steps.map((step, index) => <article className="ks-trade-step" key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{t(step.title)}</h3><p>{t(step.text)}</p></div></article>)}</div><p className="ks-trade-note">{t('The process, timing, payment terms, and documentation requirements depend on the product, destination, counterparties, and contract.')}</p></div></section>

      <section className="ks-commercial"><div className="ks-inner-wrap"><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Commercial information')}</span><h2>{t('What Needs to Be Agreed?')}</h2><p>{t('These details must be agreed by the parties before the transaction proceeds.')}</p><div className="ks-commercial-grid">{commercialTerms.map((item, index) => <article className="ks-commercial-item" key={item}><span>0{index + 1}</span><h3>{t(item)}</h3></article>)}</div></div></section>

      <section className="ks-trade-verification"><div><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Documentation and verification')}</span><h2>{t('Understand the Requirements Before Shipment')}</h2></div><div><p>{t('The documents and checks required for a transaction depend on the commodity, destination market, and contract. Buyers and sellers should confirm the applicable requirements and documents available before committing to shipment.')}</p><Link to="/compliance" className="ks-page-button ks-page-button-dark">{t('Explore Compliance')} <ArrowRight size={17} /></Link></div></section>

      <section className="ks-trade-checklist"><div className="ks-inner-wrap"><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Buyer checklist')}</span><h2>{t('Before You Submit an Enquiry')}</h2><ul className="ks-checklist">{['Commodity and product form', 'Specifications or grade', 'Quantity', 'Destination country', 'Required delivery terms', 'Inspection requirements', 'Documentation requirements'].map((item) => <li key={item}>{t(item)}</li>)}</ul></div></section>

      <section className="ks-inner-section ks-page-cta"><div className="ks-inner-wrap ks-page-cta-row"><div><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Start a discussion')}</span><h2>{t('Ready to Discuss a Requirement?')}</h2><p>{t('Send us your requirements to begin a commercial discussion.')}</p></div><div className="ks-page-actions"><Link className="ks-page-button ks-page-button-dark" to="/request-a-quote">{t('Request a Quote')} <ArrowRight size={17} /></Link><Link className="ks-page-button ks-page-button-line" to="/contact">{t('Contact Us')} <ArrowRight size={17} /></Link></div></div></section>
    </IndependentPageFrame>
  )
}
