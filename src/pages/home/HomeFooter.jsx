import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const commodityLinks = [
  { title: 'Lithium', to: '/products/lithium' },
  { title: 'Copper', to: '/products/copper' },
  { title: 'Cassava', to: '/products/cassava' },
]

const companyLinks = [
  { title: 'About', to: '/about' },
  { title: 'How We Trade', to: '/how-we-trade' },
  { title: 'Compliance', to: '/compliance' },
  { title: 'Industrialization', to: '/industrialization' },
  { title: 'Contact', to: '/contact' },
]

const copyrightYear = new Date().getFullYear()

import { useLanguage } from '../../context/LanguageContext'
export default function HomeFooter() {
  const { t } = useLanguage()

  return (
    <footer className="ks-footer">
      <div className="ks-container">
        <div className="ks-footer-main">
          <div className="ks-footer-brand">
            <Link to="/" className="ks-home-footer-brand" aria-label="Ken Sirius home"><img src="/ken-sirius-footer.png" alt="Ken-Sirius Inc. Shining Bright in Africa's Economic Sky" /></Link>
            <p>{t('Ken Sirius Nigeria Limited is a Nigerian company focused on lithium, copper, and cassava trade enquiries.')}</p>
            <span className="ks-footer-reg">{t('Registered in Nigeria · RC 7321954')}</span>
          </div>
          <div className="ks-footer-column"><h2>{t('Commodities')}</h2>{commodityLinks.map((item) => <Link key={item.to} to={item.to}>{t(item.title)}<ArrowUpRight size={13} /></Link>)}</div>
          <div className="ks-footer-column"><h2>{t('Company')}</h2>{companyLinks.map((item) => <Link key={item.to} to={item.to}>{t(item.title)}<ArrowUpRight size={13} /></Link>)}</div>
          <div className="ks-footer-contact"><span className="ks-footer-label">{t('Start a conversation')}</span><a href="mailto:info@ken-sirius.com">{t('info@ken-sirius.com')}</a><span>{t('Abuja, Nigeria')}</span><Link className="ks-footer-quote" to="/request-a-quote">{t('Request a Quote')} <ArrowUpRight size={15} /></Link></div>
        </div>
        <div className="ks-footer-bottom"><span>© {copyrightYear} Ken Sirius Nigeria Limited. {t('All rights reserved.')}</span><span>{t('Abuja, Nigeria')} <i /> RC 7321954</span></div>
      </div>
    </footer>
  )
}
