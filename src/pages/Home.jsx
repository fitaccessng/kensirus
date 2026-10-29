import Header from '../components/layout/Header'
import HomeFooter from './home/HomeFooter'
import ApproachSection from './home/sections/ApproachSection'
import BuyerGuideSection from './home/sections/BuyerGuideSection'
import ClosingSection from './home/sections/ClosingSection'
import CommoditySection from './home/sections/CommoditySection'
import DocumentationSection from './home/sections/DocumentationSection'
import EnquiryProcessSection from './home/sections/EnquiryProcessSection'
import FaqSection from './home/sections/FaqSection'
import HeroSection from './home/sections/HeroSection'
import PrinciplesSection from './home/sections/PrinciplesSection'
import TradeBandSection from './home/sections/TradeBandSection'
import ValueAdditionSection from './home/sections/ValueAdditionSection'
import './home/home.css'

export default function Home() {
  return (
    <div className="ks-home">
      <Header />
      <main>
        <HeroSection />
        <CommoditySection />
        <ApproachSection />
        <PrinciplesSection />
        <BuyerGuideSection />
        <ValueAdditionSection />
        <DocumentationSection />
        <EnquiryProcessSection />
        <TradeBandSection />
        <FaqSection />
        <ClosingSection />
      </main>
      <HomeFooter />
    </div>
  )
}
