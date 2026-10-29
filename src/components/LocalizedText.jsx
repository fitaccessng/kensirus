import { useLanguage } from '../context/LanguageContext'

export default function LocalizedText({ children }) {
  const { t } = useLanguage()
  const source = typeof children === 'string' ? children : String(children ?? '')
  return t(source)
}
