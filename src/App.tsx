import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import IntegrationFlow from './components/IntegrationFlow';
import DashboardPreview from './components/DashboardPreview';
import TransparencyFeed from './components/TransparencyFeed';
import ImpactSection from './components/ImpactSection';
import TestimonialSection from './components/TestimonialSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <IntegrationFlow />
      <DashboardPreview />
      <TransparencyFeed />
      <ImpactSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
}

export default App;
