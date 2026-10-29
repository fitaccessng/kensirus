import { Link } from 'react-router-dom'
import { ArrowRight, FileCheck2, FileText, FlaskConical, Ship } from 'lucide-react'
import IndependentPageFrame from '../components/layout/IndependentPageFrame'
import { useLanguage } from '../context/LanguageContext'

const documents = [
  { title: 'Company Information', icon: FileText, items: ['Company profile', 'Company registration information'] },
  { title: 'Product Information', icon: FileCheck2, items: ['Product specifications', 'Grade details and product information'] },
  { title: 'Testing and Inspection', icon: FlaskConical, items: ['Assay or laboratory reports', 'Inspection records'] },
  { title: 'Export Documentation', icon: Ship, items: ['Permits and certificates', 'Declarations and shipping documents'] },
]

export default function Compliance() {
  const { t } = useLanguage()

  return (
    <IndependentPageFrame pageClass="compliance-page">
      <section className="ks-inner-hero ks-compliance-hero"><div className="ks-inner-hero-image" role="img" aria-label={t('Business documentation prepared for review')} /><div className="ks-inner-hero-shade" /><div className="ks-inner-wrap ks-inner-hero-copy"><span className="ks-inner-eyebrow">{t('Compliance and documentation')}</span><h1>{t('Clear Documentation for Commodity Trade')}</h1><p>{t('Documentation requirements vary by product, destination, and transaction. Ken Sirius can discuss relevant company, product, and export documents as part of an enquiry, subject to availability.')}</p></div></section>

      <section className="ks-compliance-intro"><div className="ks-inner-wrap ks-compliance-intro-grid"><div><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Our approach')}</span><h2>{t('Understand What Each Transaction Requires')}</h2></div><div><p>{t('Commodity transactions may require company information, product specifications, laboratory reports, inspection records, and export documentation.')}</p><p>{t('The applicable documents must be identified and verified for each transaction. This page lists document categories only; it does not confirm that individual documents are held or available.')}</p></div></div></section>

      <section className="ks-doc-library"><div className="ks-inner-wrap"><div className="ks-inner-heading"><div><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Document categories')}</span><h2>{t('Information to Confirm')}</h2></div><p>{t('Ask us to confirm the status of any document relevant to your enquiry.')}</p></div>{documents.map(({ title, icon: Icon, items }) => <article className="ks-document-category" key={title}><h3><Icon size={18} />{t(title)}</h3><ul>{items.map((item) => <li key={item}>{t(item)}<span>{t('Status to be confirmed')}</span></li>)}</ul></article>)}</div></section>

      <section className="ks-inner-wrap ks-compliance-verification"><article><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Verification')}</span><h2>{t('Verify the Details Before Committing')}</h2><p>{t('Buyers should review product specifications, supporting evidence, and contractual requirements before proceeding. Any required inspection, testing, or independent verification should be agreed upon by the relevant parties.')}</p></article><article><span className="ks-inner-eyebrow ks-eyebrow-forest">{t('Destination requirements')}</span><h2>{t('Requirements Depend on the Market')}</h2><p>{t('Import and export requirements may vary according to the commodity, destination country, and intended use. The parties should identify applicable regulatory, customs, quality, and product requirements before shipment.')}</p></article></section>

      <section className="ks-inner-section ks-page-cta ks-compliance-cta"><div className="ks-inner-wrap ks-page-cta-row"><div><span className="ks-inner-eyebrow">{t('Document enquiry')}</span><h2>{t('Need Specific Documentation?')}</h2><p>{t('Tell us which commodity and destination you are considering and which documents you need. We can discuss the applicable requirements and confirm what information is available.')}</p></div><Link className="ks-page-button ks-page-button-lime" to="/contact">{t('Contact Us About Documentation')} <ArrowRight size={17} /></Link></div></section>
    </IndependentPageFrame>
  )
}
