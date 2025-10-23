import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Integration from './pages/Integration';
import Dashboard from './pages/Dashboard';
import Transparency from './pages/Transparency';
import Impact from './pages/Impact';
import Testimonials from './pages/Testimonials';
import CTA from './pages/CTA';
import CCTVMonitoring from './pages/CCTVMonitoring';
import LHKPNDetection from './pages/LHKPNDetection';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/integration" element={<Integration />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transparency" element={<Transparency />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/cta" element={<CTA />} />
          <Route path="/cctv-monitoring" element={<CCTVMonitoring />} />
          <Route path="/lhkpn-detection" element={<LHKPNDetection />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
