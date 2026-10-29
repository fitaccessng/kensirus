import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="container page-wrap center-block">
      <h1>{t('Page not found')}</h1>
      <p>{t('The page you requested does not exist or has moved.')}</p>
      <div className="button-row justify-center">
        <Link to="/" className="button primary">{t('Return home')}</Link>
        <Link to="/products" className="button secondary">{t('Browse products')}</Link>
      </div>
    </div>
  )
}
