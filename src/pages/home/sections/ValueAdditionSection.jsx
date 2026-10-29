import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../Reveal'
import { useLanguage } from '../../../context/LanguageContext'

const industryImage = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=88'

export default function ValueAdditionSection() {
  const { t } = useLanguage()

  return (
    <section className="ks-section ks-value-addition">
      <div className="ks-container ks-value-layout">
        <Reveal className="ks-value-image-wrap">
          <div className="ks-value-image" style={{ backgroundImage: `url("${industryImage}")` }} role="img" aria-label={t('Worker in an industrial production environment')} />
          <span className="ks-value-stamp">{t('Value')}<br />{t('addition')}</span>
        </Reveal>
        <Reveal className="ks-value-copy">
          <span className="ks-eyebrow ks-eyebrow-dark">{t('Our long-term view')}</span>
          <h2>{t('Supporting More Value from African Resources')}</h2>
          <p>{t('Africa has opportunities to create more value from its natural resources through local processing, industrial investment, and stronger supply chains. Ken Sirius supports responsible trade and partnerships that contribute to this goal.')}</p>
          <Link to="/industrialization" className="ks-text-link">{t('Read Our Vision')} <ArrowRight size={17} /></Link>
        </Reveal>
      </div>
    </section>
  )
}
