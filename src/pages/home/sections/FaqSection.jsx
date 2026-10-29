import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Reveal from '../Reveal'

const questions = [
  { question: 'Which commodities does Ken Sirius focus on?', answer: 'Our current focus is lithium, copper, and cassava.' },
  { question: 'How do I request a quote?', answer: 'Submit the quote form with your commodity, quantity, specifications, and destination. We can follow up on any missing details.' },
  { question: 'Are all products available immediately?', answer: 'Availability must be confirmed for each enquiry. Submitting a request does not guarantee supply.' },
  { question: 'Can I request specific product grades?', answer: 'Yes. Include your required grade or specification so it can be reviewed as part of the enquiry.' },
  { question: 'Can you provide product documentation?', answer: 'Relevant documentation can be discussed based on the product, transaction, and documents available.' },
  { question: 'Do you support international trade enquiries?', answer: 'You can contact us with your destination, delivery requirements, and proposed commercial terms for review.' },
  { question: 'Which payment and delivery terms are accepted?', answer: 'Payment and delivery terms are subject to discussion and agreement for each transaction.' },
]

import { useLanguage } from '../../../context/LanguageContext'
export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null)
  const { t } = useLanguage()

  return (
    <section className="ks-section ks-faq">
      <div className="ks-container ks-faq-layout">
        <Reveal className="ks-faq-heading">
          <span className="ks-eyebrow ks-eyebrow-dark">{t('Trade enquiries')}</span>
          <h2>{t('Frequently Asked Questions')}</h2>
          <p>{t('Availability, specifications, documentation, and commercial terms are confirmed for each enquiry.')}</p>
        </Reveal>
        <div className="ks-faq-list">
          {questions.map((item, index) => {
            const isOpen = openIndex === index
            const answerId = `ks-faq-answer-${index}`
            return (
              <Reveal className="ks-faq-item" key={item.question}>
                <h3>
                  <button type="button" className="ks-faq-question" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpenIndex(isOpen ? null : index)}>
                    <span>{item.question}</span><ChevronDown size={18} className={isOpen ? 'is-rotated' : ''} aria-hidden="true" />
                  </button>
                </h3>
                <div className="ks-faq-answer" id={answerId} hidden={!isOpen}>
                  <p>{t(item.answer)}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
