import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function MainLayout({ children }) {
  return (
    <div className="site-shell">
      <Header />
      <main>{children ?? <Outlet />}</main>
      <Footer />
    </div>
  )
}
