import { NavLink } from 'react-router-dom'

export default function DesktopNavigation({ items }) {
  return (
    <nav className="desktop-nav" aria-label="Primary navigation">
      {items.map((item) => (
        <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
