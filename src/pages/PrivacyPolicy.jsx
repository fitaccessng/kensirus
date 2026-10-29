import { useLanguage } from '../context/LanguageContext'

export default function PrivacyPolicy() {
  const { t } = useLanguage()

  return (
    <div className="container page-wrap">
      <div className="section-intro">
        <span className="eyebrow">{t('Privacy policy')}</span>
        <h1>{t('Privacy notice')}</h1>
      </div>
      <div className="text-card article-layout">
        <p>{t('Ken Sirius Nigeria Limited processes personal data only where necessary for legitimate business communication, trade enquiries and operational support. Information may be used to respond to enquiries, review product requirements and maintain relevant commercial records.')}</p>
        <p>{t('We retain business contact data only for as long as necessary to manage the requested relationship or legal and compliance obligations. Information is protected through reasonable administrative and technical controls.')}</p>
        <p>{t('Where third-party service providers support communication or document handling, they are expected to process data in line with contractual and privacy requirements. If you have questions about your data, please contact the company via the official email address.')}</p>
      </div>
    </div>
  )
}
