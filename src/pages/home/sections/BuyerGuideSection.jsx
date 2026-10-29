import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../Reveal'
import { useLanguage } from '../../../context/LanguageContext'

const requirements = [
  { name: 'Lithium', index: '1', questions: ['Required product form and specification.', 'Quantity required.', 'Destination country and delivery preference.', 'Inspection and documentation requirements.'] },
  { name: 'Copper', index: '2', questions: ['Required product form and specification.', 'Quantity required.', 'Destination country and delivery preference.', 'Inspection and documentation requirements.'] },
  { name: 'Cassava', index: '3', questions: ['Required product form.', 'Quality or processing requirements.', 'Quantity and packaging.', 'Destination and applicable documentation.'] },
]

export default function BuyerGuideSection() {
  const { t } = useLanguage()

  return (
    <section className="ks-section ks-buyer-guide">
      <div className="ks-container">
        <Reveal className="ks-section-heading ks-guide-heading">
          <div><span className="ks-eyebrow ks-eyebrow-dark">{t('Before you enquire')}</span><h2>{t('Tell Us What You Need')}</h2></div>
          <p>{t('Providing a few key details helps us assess your request and identify the next steps.')}</p>
        </Reveal>
        <div className="ks-guide-grid">
          {requirements.map((item) => (
            <Reveal key={item.name} className="ks-guide-item">
              <div className="ks-guide-item-head"><span>{item.index}</span><h3>{t(item.name)}</h3></div>
              <ul>{item.questions.map((question) => <li key={question}><Check size={15} aria-hidden="true" />{t(question)}</li>)}</ul>
            </Reveal>
          ))}
        </div>
        <p className="ks-guide-note">{t('If you do not have every detail, send us the information available and we can clarify the outstanding requirements.')}</p>
        <Link to="/request-a-quote" className="ks-button ks-button-dark">{t('Submit an Enquiry')} <ArrowRight size={17} /></Link>
      </div>
    </section>
  )
}
