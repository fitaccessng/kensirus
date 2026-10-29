import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Globe, ChevronDown, ArrowRight } from 'lucide-react'
import { languages } from '../../config/languages'
import { useLanguage } from '../../context/LanguageContext'
import './Header.css'

const primaryNavItems = [
  { key: 'home', to: '/' },
  { key: 'about', to: '/about' },
  { key: 'products', to: '/products' },
  { key: 'contact', to: '/contact' },
]

const moreNavItems = [
  { key: 'trade', to: '/how-we-trade' },
  { key: 'compliance', to: '/compliance' },
  { key: 'industrialization', to: '/industrialization' },
]

function LanguageSelect({ language, copy, onChange, className = '' }) {
  return (
    <label className={`ks-language-control ${className}`}>
      <Globe size={15} aria-hidden="true" />
      <span className="sr-only">{copy.chooseLanguage}</span>
      <select aria-label={copy.chooseLanguage} value={language} onChange={(event) => onChange(event.target.value)}>
        {Object.entries(languages).map(([code, option]) => (
          <option value={code} key={code}>{option.nativeLabel}</option>
        ))}
      </select>
    </label>
  )
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const { language, setLanguage } = useLanguage()
  const navRef = useRef(null)
  const location = useLocation()
  const copy = languages[language].nav

  useEffect(() => {
    setMobileOpen(false)
    setMoreOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) setMoreOpen(false)
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMoreOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleLanguageChange = (nextLanguage) => setLanguage(nextLanguage)
  const moreIsActive = moreNavItems.some((item) => location.pathname === item.to)

  const renderNavLink = (item, mobile = false) => (
    <NavLink
      key={item.to}
      to={item.to}
      className={({ isActive }) => mobile
        ? `rounded-xl px-4 py-3 text-base font-medium transition-colors ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'}`
        : `text-sm font-medium transition-colors hover:text-slate-900 ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}
    >
      {copy[item.key]}
    </NavLink>
  )

  return (
    <header className="ks-site-header sticky top-0 z-50 w-full border-b border-slate-100 bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="ks-header-brand" aria-label="Ken Sirius home">
          <img src="/ken-sirius-header.png" alt="Ken-Sirius Inc." />
        </Link>

        <nav ref={navRef} className="hidden items-center gap-5 lg:flex xl:gap-6" aria-label={copy.primaryNavigation} onKeyDown={(event) => { if (event.key === 'Escape') setMoreOpen(false) }}>
          {primaryNavItems.map((item) => renderNavLink(item))}
          <div className="relative">
            <button
              type="button"
              className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-slate-900 ${moreIsActive || moreOpen ? 'font-semibold text-slate-900' : 'text-slate-600'}`}
              aria-expanded={moreOpen}
              aria-controls="desktop-more-menu"
              onClick={() => setMoreOpen((open) => !open)}
            >
              {copy.more}<ChevronDown size={15} className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {moreOpen && (
              <div id="desktop-more-menu" className="absolute right-0 top-full z-50 mt-3 min-w-56 border border-slate-200 bg-white py-2 shadow-lg" role="menu" aria-label={copy.morePages}>
                {moreNavItems.map((item) => (
                  <NavLink key={item.to} to={item.to} role="menuitem" className={({ isActive }) => `block px-4 py-3 text-sm transition-colors hover:bg-slate-50 hover:text-slate-900 ${isActive ? 'bg-slate-50 font-semibold text-slate-900' : 'text-slate-600'}`}>
                    {copy[item.key]}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="ks-header-actions">
          <LanguageSelect language={language} copy={copy} onChange={handleLanguageChange} className="ks-desktop-language" />
          <Link to="/request-a-quote" className="ks-nav-quote ks-desktop-quote">
            {copy.quote}<ArrowRight size={16} aria-hidden="true" />
          </Link>
          <button type="button" className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none lg:hidden" aria-label={mobileOpen ? copy.closeNavigation : copy.openNavigation} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="absolute inset-x-0 top-full flex max-h-[85vh] flex-col gap-2 overflow-y-auto border-b border-slate-200 bg-white px-4 py-6 shadow-xl lg:hidden" aria-label={copy.mobileNavigation}>
          {primaryNavItems.map((item) => renderNavLink(item, true))}
          <div className="border-b border-slate-100 pb-2">
            <button type="button" className="flex min-h-12 w-full items-center justify-between rounded-xl px-4 py-3 text-left text-base font-medium text-slate-700 transition-colors hover:bg-slate-50" aria-expanded={moreOpen} aria-controls="mobile-more-menu" onClick={() => setMoreOpen((open) => !open)}>
              {copy.more}<ChevronDown size={17} className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {moreOpen && (
              <div id="mobile-more-menu" className="ml-4 flex flex-col border-l-2 border-emerald-700/30 pl-2">
                {moreNavItems.map((item) => renderNavLink(item, true))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
            <div className="ks-mobile-language">
              <span>{copy.chooseLanguage}</span>
              <LanguageSelect language={language} copy={copy} onChange={handleLanguageChange} />
            </div>
            <Link to="/request-a-quote" className="ks-nav-quote w-full justify-between">
              {copy.quote}<ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}