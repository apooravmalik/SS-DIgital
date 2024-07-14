import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import CompanyScroll from '../components/CompanyScroll';
import FeaturesSection from '../components/FeatureSection';
import CTASection from '../components/CTASection';

const HomePage = () => (
  <div className="min-h-screen bg-blue-50">
    <Navbar />
    <HeroSection />
    <CompanyScroll />
    <FeaturesSection />
    <CTASection />
  </div>
);

export default HomePage;