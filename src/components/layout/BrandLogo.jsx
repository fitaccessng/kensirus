import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const DEFAULT_LOGO = '/ken-sirius-logo.svg'

export default function BrandLogo() {
  const [logoUrl, setLogoUrl] = useState(`${API_BASE}/api/site/logo`)
  const [isCompactArtwork, setIsCompactArtwork] = useState(false)

  useEffect(() => {
    const refreshLogo = () => setLogoUrl(`${API_BASE}/api/site/logo?v=${Date.now()}`)
    window.addEventListener('ken-sirius-logo-updated', refreshLogo)
    window.addEventListener('storage', refreshLogo)
    return () => {
      window.removeEventListener('ken-sirius-logo-updated', refreshLogo)
      window.removeEventListener('storage', refreshLogo)
    }
  }, [])

  const handleLoadError = (event) => {
    if (!event.currentTarget.src.endsWith(DEFAULT_LOGO)) {
      setIsCompactArtwork(false)
      event.currentTarget.src = DEFAULT_LOGO
    }
  }

  return (
    <span className="brand-logo-frame">
      <img
        className={isCompactArtwork ? 'is-compact-artwork' : ''}
        src={logoUrl}
        alt="Ken Sirius — Shining Bright in Africa's Economic Sky"
        onLoad={(event) => {
          const { naturalWidth, naturalHeight } = event.currentTarget
          setIsCompactArtwork(naturalHeight > 0 && naturalWidth / naturalHeight < 1.4)
        }}
        onError={handleLoadError}
      />
    </span>
  )
}
