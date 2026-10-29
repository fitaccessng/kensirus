import { ArrowRight, FileCheck2, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../Reveal'
import { useLanguage } from '../../../context/LanguageContext'

const documents = [
  { title: 'Company profile', icon: FileText },
  { title: 'Company registration information', icon: FileCheck2 },
  { title: 'Product specifications', icon: FileText },
  { title: 'Assay or laboratory reports, where available', icon: FileCheck2 },
  { title: 'Relevant export documentation', icon: FileText },
]

export default function DocumentationSection() {
  const { t } = useLanguage()

  return (
    <section className="ks-section ks-documentation">
      <div className="ks-container ks-doc-layout">
        <Reveal className="ks-doc-heading">
          <span className="ks-eyebrow ks-eyebrow-dark">{t('Company and product documents')}</span>
          <h2>{t('Documentation for Trade Enquiries')}</h2>
          <p>{t('The documents required for a transaction depend on the product, destination, and agreed terms. Relevant company information, product specifications, test reports, and export documents can be discussed during the enquiry process, subject to availability.')}</p>
          <Link to="/compliance" className="ks-text-link">{t('Discuss Documentation')} <ArrowRight size={17} /></Link>
        </Reveal>
        <Reveal className="ks-doc-list">
          {documents.map(({ title, icon: Icon }, index) => (
            <div className="ks-doc-row" key={title}>
              <span className="ks-doc-icon"><Icon size={18} strokeWidth={1.6} /></span>
              <span className="ks-doc-title">{t(title)}</span>
              <span className="ks-doc-index">0{index + 1}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
