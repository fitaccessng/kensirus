import { Link } from 'react-router-dom'

export default function Button({ children, to, variant = 'primary', size = 'normal', type = 'button', className = '', ...props }) {
  const allClasses = `button ${variant} ${size} ${className}`.trim()

  if (to) {
    return (
      <Link to={to} className={allClasses} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={allClasses} {...props}>
      {children}
    </button>
  )
}
