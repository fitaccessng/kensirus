import { NavLink } from 'react-router-dom'

export default function MobileNavigation({ items }) {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {items.map((item) => (
        <NavLink key={item.to} to={item.to} className="mobile-link">
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
