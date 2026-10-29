import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumbs({ items }) {
  return (
    <div className="breadcrumb">
      {items.map((item, index) => (
        <span key={item.to || item.label} className="breadcrumb-item">
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
          {index < items.length - 1 && <ChevronRight size={14} />}
        </span>
      ))}
    </div>
  )
}
