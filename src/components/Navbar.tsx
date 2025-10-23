import { useState, useEffect } from 'react';
import { Shield, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-[#0A4D8C] to-[#009688] p-2 rounded-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0A4D8C]">LATIVA</h1>
              <p className="text-xs text-gray-600">Smart Governance System</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#beranda" className="text-gray-700 hover:text-[#0A4D8C] transition-colors">
              Beranda
            </a>
            <a href="#tentang" className="text-gray-700 hover:text-[#0A4D8C] transition-colors">
              Tentang
            </a>
            <a href="#fitur" className="text-gray-700 hover:text-[#0A4D8C] transition-colors">
              Fitur
            </a>
            <a href="#dashboard" className="text-gray-700 hover:text-[#0A4D8C] transition-colors">
              Dashboard
            </a>
            <a href="#dampak" className="text-gray-700 hover:text-[#0A4D8C] transition-colors">
              Dampak
            </a>
            <button className="bg-[#0A4D8C] text-white px-6 py-2.5 rounded-xl hover:bg-[#083a6b] transition-all duration-300 shadow-lg hover:shadow-xl">
              Portal Transparansi
            </button>
          </div>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <a href="#beranda" className="block text-gray-700 hover:text-[#0A4D8C] py-2">
              Beranda
            </a>
            <a href="#tentang" className="block text-gray-700 hover:text-[#0A4D8C] py-2">
              Tentang
            </a>
            <a href="#fitur" className="block text-gray-700 hover:text-[#0A4D8C] py-2">
              Fitur
            </a>
            <a href="#dashboard" className="block text-gray-700 hover:text-[#0A4D8C] py-2">
              Dashboard
            </a>
            <a href="#dampak" className="block text-gray-700 hover:text-[#0A4D8C] py-2">
              Dampak
            </a>
            <button className="w-full bg-[#0A4D8C] text-white px-6 py-2.5 rounded-xl hover:bg-[#083a6b] transition-all">
              Portal Transparansi
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
