import Footer from './Footer'
import Header from './Header'
import '../../pages/independent-pages.css'

export default function IndependentPageFrame({ children, pageClass }) {
  return (
    <div className={`ks-content-page ${pageClass}`}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
