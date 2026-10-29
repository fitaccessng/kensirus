import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="ks-footer-brand" aria-label="Ken Sirius home">
            <img src="/ken-sirius-footer.png" alt="Ken-Sirius Inc. Shining Bright in Africa's Economic Sky" />
          </Link>
          <p>{t("Shining Bright in Africa's Economic Sky.")}</p>
        </div>

        <div>
          <h3>{t('Company')}</h3>
          <ul>
            <li><Link to="/about">{t('About Us')}</Link></li>
            <li><Link to="/products">{t('Products & Services')}</Link></li>
            <li><Link to="/industrialization">{t('Industrialization')}</Link></li>
            <li><Link to="/privacy">{t('Privacy Policy')}</Link></li>
          </ul>
        </div>

        <div>
          <h3>{t('Contact')}</h3>
          <ul>
            <li>{t('Abuja, Nigeria')}</li>
            <li><a href="mailto:info@ken-sirius.com">{t('info@ken-sirius.com')}</a></li>
            <li><a href="https://www.ken-sirius.com">www.ken-sirius.com</a></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>Ken Sirius Nigeria Limited</span>
        <span>{t('RC Number:')} 7321954</span>
      </div>
    </footer>
  )
}
