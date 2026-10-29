import Button from './Button'

export default function QuoteCTA() {
  return (
    <div className="quote-banner container">
      <div>
        <span className="eyebrow">International buyers</span>
        <h2>Ready to discuss your supply requirements?</h2>
      </div>
      <Button to="/request-a-quote" variant="primary">Request a Quote</Button>
    </div>
  )
}
