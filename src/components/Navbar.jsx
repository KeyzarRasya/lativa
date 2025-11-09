import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/100 backdrop-blur-md shadow-lg'
          : 'bg-white/100 backdrop-blur-sm shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/logo/icon-2.png" 
              alt="LATIVA Logo" 
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#0A4D8C]">LATIVA</h1>
              <p className="text-[10px] md:text-xs text-[#009688] font-medium">Smart Governance System</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-800 hover:text-[#0A4D8C] font-medium transition-colors">
              Beranda
            </Link>
            <Link to="/cctv-monitoring" className="text-gray-800 hover:text-[#0A4D8C] font-medium transition-colors">
              Monitoring CCTV
            </Link>
            <Link to="/lhkpn-detection" className="text-gray-800 hover:text-[#0A4D8C] font-medium transition-colors">
              Deteksi LHKPN
            </Link>
            <Link to="/transparency" className="text-gray-800 hover:text-[#0A4D8C] font-medium transition-colors">
              Portal Transparansi
            </Link>
            <Link to="/dashboard" className="bg-gradient-to-r from-[#0A4D8C] to-[#009688] text-white px-6 py-2.5 rounded-xl hover:from-[#083a6b] hover:to-[#007d71] transition-all duration-300 shadow-lg hover:shadow-xl font-medium">
              Laporan Kota
            </Link>
          </div>

          <button
            className="md:hidden text-gray-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <Link to="/" className="block text-gray-800 hover:text-[#0A4D8C] font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
              Beranda
            </Link>
            <Link to="/about" className="block text-gray-800 hover:text-[#0A4D8C] font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
              Tentang
            </Link>
            <Link to="/cctv-monitoring" className="block text-gray-800 hover:text-[#0A4D8C] font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
              Monitoring CCTV
            </Link>
            <Link to="/lhkpn-detection" className="block text-gray-800 hover:text-[#0A4D8C] font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
              Deteksi LHKPN
            </Link>
            <Link to="/transparency" className="block text-gray-800 hover:text-[#0A4D8C] font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
              Portal Transparansi
            </Link>
            <Link to="/dashboard" className="block w-full bg-gradient-to-r from-[#0A4D8C] to-[#009688] text-white px-6 py-2.5 rounded-xl hover:from-[#083a6b] hover:to-[#007d71] transition-all text-center font-medium shadow-md" onClick={() => setIsMobileMenuOpen(false)}>
              Laporan Kota
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
