import { Shield, Instagram, Linkedin, Youtube, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#0A4D8C] to-[#083a6b] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-white p-1 rounded-xl">
                <img 
                  src="/logo/icon-2.png" 
                  alt="LATIVA Logo" 
                  className="w-8 h-8 md:w-10 md:h-10 object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold">LATIVA</h3>
                <p className="text-xs text-white/70">Smart Governance System</p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed mb-6">
              Sistem pengawasan dan tata kelola daerah berbasis AI untuk mewujudkan Purwakarta yang aman dan transparan.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="bg-white/10 backdrop-blur-sm p-3 rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-white/10 backdrop-blur-sm p-3 rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-white/10 backdrop-blur-sm p-3 rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Navigasi</h4>
            <ul className="space-y-3">
              <li>
                <a href="#beranda" className="text-white/80 hover:text-white transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#tentang" className="text-white/80 hover:text-white transition-colors">
                  Tentang LATIVA
                </a>
              </li>
              <li>
                <a href="#fitur" className="text-white/80 hover:text-white transition-colors">
                  Fitur Utama
                </a>
              </li>
              <li>
                <a href="#dashboard" className="text-white/80 hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#dampak" className="text-white/80 hover:text-white transition-colors">
                  Dampak
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Layanan</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  Portal Transparansi
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  Laporan Masyarakat
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  Monitoring CCTV
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  Validasi LHKPN
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  Studi Kasus
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Kontak</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm">
                  Jl. Gandanegara No. 25<br />
                  Purwakarta, Jawa Barat 41115
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="text-white/80 text-sm">(0264) 200-123</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-white/80 text-sm">info@lativa.purwakarta.go.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/70 text-sm text-center md:text-left">
              © 2025 LATIVA - Pemerintah Kabupaten Purwakarta x Inovator Muda Indonesia
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                Kebijakan Privasi
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                Syarat & Ketentuan
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                Kontak
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
