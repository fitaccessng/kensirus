import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { languages } from '../config/languages'
import { pageCopy } from '../config/pageCopy'

const LanguageContext = createContext(null)

function getSavedLanguage() {
  try {
    const savedLanguage = window.localStorage.getItem('ken-sirius-language')
    return savedLanguage && languages[savedLanguage] ? savedLanguage : 'en'
  } catch {
    return 'en'
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getSavedLanguage)

  useEffect(() => {
    document.documentElement.lang = languages[language].htmlLang
    try {
      window.localStorage.setItem('ken-sirius-language', language)
    } catch {
      // Keep language selection available when storage is disabled.
    }
  }, [language])

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (source) => pageCopy[language]?.[source] || source,
  }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
