import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function ProductCard({ product }) {
  return (
    <article className="info-card">
      <span className="pill">{product.category}</span>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="meta-line">
        <span>{product.availability}</span>
      </div>
      <Link to={`/products/${product.slug}`} className="text-link">
        View details <ChevronRight size={16} />
      </Link>
    </article>
  )
}
