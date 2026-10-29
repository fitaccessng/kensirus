import { useEffect, useState } from 'react'
import { ArrowDownRight, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../Reveal'
import { useLanguage } from '../../../context/LanguageContext'
import { commodityImages } from '../../../assets/commodityImages'
import heroCopperPort from '../../../assets/hero-copper-port.jpg'

const slides = [
  {
    eyebrow: 'African commodities. Global markets.',
    firstLine: 'African Commodities.',
    accent: 'Global Markets.',
    description: 'Ken Sirius Inc sources and supplies high-quality lithium, copper, cassava and other strategic commodities from Africa to global industries.',
    image: heroCopperPort,
    imageAlt: 'Copper sheets being moved by forklift beside a cargo ship',
  },
  {
    eyebrow: 'Reliable supply. From Africa.',
    firstLine: 'Reliable Supply',
    accent: 'From Africa',
    lastLine: 'To Global Industries.',
    description: 'We connect buyers with African commodity supply and support clear commercial discussions, product requirements and trade documentation.',
    image: commodityImages.lithium.operations,
    imageAlt: 'Workers inspecting mineral material',
  },
  {
    eyebrow: 'African resources. Global opportunities.',
    firstLine: 'African Resources.',
    accent: 'Global Opportunities.',
    description: 'From mineral resources to agricultural products, explore the commodities and partnerships shaping Africa’s role in global markets.',
    image: commodityImages.cassava.card,
    imageAlt: 'Cassava growing across a cultivated field',
  },
]

export default function HeroSection() {
  const { t } = useLanguage()
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [])

  const showSlide = (index) => {
    setActiveSlide((index + slides.length) % slides.length)
  }
  const slide = slides[activeSlide]

  return (
    <section
      className="ks-hero"
      aria-label={t('Featured commodities')}
      aria-roledescription={t('carousel')}
    >
      <img key={slide.image} className="ks-hero-image" src={slide.image} alt={t(slide.imageAlt)} />
      <div className="ks-hero-shade" />
      <div className="ks-container ks-hero-content">
        <div className="ks-hero-slide" role="group" aria-roledescription={t('slide')} aria-label={`${activeSlide + 1} ${t('of')} ${slides.length}`}>
          <Reveal>
            <span className="ks-hero-eyebrow">{t(slide.eyebrow)}</span>
            <h1 aria-label={`${t(slide.firstLine)} ${t(slide.accent)}${slide.lastLine ? ` ${t(slide.lastLine)}` : ''}`}>
              {t(slide.firstLine)}<br />
              <span>{t(slide.accent)}</span>
              {slide.lastLine && <><br />{t(slide.lastLine)}</>}
            </h1>
            <p>{t(slide.description)}</p>
            <div className="ks-actions">
              <Link to="/request-a-quote" className="ks-button ks-button-lime">{t('Request a Quote')} <ArrowRight size={17} /></Link>
              <Link to="/products" className="ks-button ks-button-outline">{t('Explore Our Products')} <ArrowDownRight size={17} /></Link>
            </div>
          </Reveal>
        </div>
      </div>
      <div className="ks-hero-caption">
        <span className="ks-hero-location"><span className="ks-location-dot" /> {t('Abuja, Nigeria')} <span className="ks-hero-caption-divider">/</span> {t('Global markets')}</span>
        <div className="ks-hero-controls" aria-label={t('Slide controls')}>
          <span className="ks-caption-index">0{activeSlide + 1} <span>/ 0{slides.length}</span></span>
          <div className="ks-hero-dots">
            {slides.map((item, index) => (
              <button
                key={item.eyebrow}
                type="button"
                className={`ks-hero-dot${index === activeSlide ? ' is-active' : ''}`}
                aria-label={`${t('Go to slide')} ${index + 1}`}
                aria-current={index === activeSlide ? 'true' : undefined}
                onClick={() => showSlide(index)}
              />
            ))}
          </div>
          <button type="button" className="ks-hero-arrow" aria-label={t('Previous slide')} onClick={() => showSlide(activeSlide - 1)}>
            <ArrowDownRight size={18} className="ks-hero-arrow-previous" />
          </button>
          <button type="button" className="ks-hero-arrow" aria-label={t('Next slide')} onClick={() => showSlide(activeSlide + 1)}>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
