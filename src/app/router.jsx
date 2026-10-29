import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Products from '../pages/Products'
import ProductDetails from '../pages/ProductDetails'
import HowWeTrade from '../pages/HowWeTrade'
import Compliance from '../pages/Compliance'
import Industrialization from '../pages/Industrialization'
import RequestQuote from '../pages/RequestQuote'
import Contact from '../pages/Contact'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import NotFound from '../pages/NotFound'
import AdminLogin from '../pages/AdminLogin'
import AdminDashboard from '../pages/AdminDashboard'
import ProtectedAdminRoute from '../components/admin/ProtectedAdminRoute'
import MainLayout from '../components/layout/MainLayout'

function renderWithLayout(PageComponent, LayoutComponent) {
  if (!LayoutComponent) {
    return <PageComponent />
  }

  return (
    <LayoutComponent>
      <PageComponent />
    </LayoutComponent>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:slug" element={<ProductDetails />} />
      <Route path="/how-we-trade" element={<HowWeTrade />} />
      <Route path="/compliance" element={<Compliance />} />
      <Route path="/industrialization" element={<Industrialization />} />
      <Route path="/request-a-quote" element={renderWithLayout(RequestQuote, MainLayout)} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={renderWithLayout(PrivacyPolicy, MainLayout)} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
