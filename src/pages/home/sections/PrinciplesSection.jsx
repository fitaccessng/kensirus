import { ArrowUpRight } from 'lucide-react'
import Reveal from '../Reveal'
import { useLanguage } from '../../../context/LanguageContext'

const principles = [
  { number: '01', title: 'Clear Communication', text: 'We aim to provide accurate information and clarify outstanding requirements early.' },
  { number: '02', title: 'Product Requirements', text: 'We address specifications, quantities, packaging, and destination for each enquiry.' },
  { number: '03', title: 'Documentation', text: 'We identify relevant company, product, and export documents based on the transaction.' },
  { number: '04', title: 'Business Relationships', text: 'We value professional conduct, clear expectations, and long-term working relationships.' },
]

export default function PrinciplesSection() {
  const { t } = useLanguage()

  return (
    <section className="ks-section ks-principles">
      <div className="ks-container ks-principles-grid">
        <Reveal className="ks-principles-image-wrap">
          <div className="ks-principles-image" role="img" aria-label={t('Worker in an industrial setting')} />
          <span className="ks-image-note">{t('Industrial setting')}</span>
        </Reveal>
        <Reveal className="ks-principles-content">
          <span className="ks-eyebrow ks-eyebrow-dark">{t('Our business principles')}</span>
          <h2>{t('A Practical Approach to Commodity Trade')}</h2>
          <p className="ks-principles-intro">{t('We believe successful commodity transactions depend on clear communication, accurate information, and agreed commercial terms.')}</p>
          <div className="ks-principle-list">
            {principles.map((item) => (
              <article className="ks-principle" key={item.number}>
                <span>{item.number}</span>
                <div><h3>{t(item.title)}</h3><p>{t(item.text)}</p></div>
              </article>
            ))}
          </div>
          <a className="ks-text-link" href="mailto:info@ken-sirius.com">{t('Contact Ken Sirius')} <ArrowUpRight size={17} /></a>
        </Reveal>
      </div>
    </section>
  )
}
