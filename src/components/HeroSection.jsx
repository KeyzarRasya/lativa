import { Activity, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section id="beranda" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0A4D8C] via-[#0d5a9e] to-[#009688] pt-32">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#009688] rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="fade-in">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8">
            <Activity className="w-4 h-4 text-white animate-pulse" />
            <span className="text-white text-sm font-medium">AI-Powered Smart Governance</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Mewujudkan Purwakarta<br />
            <span className="bg-gradient-to-r from-white to-[#009688] bg-clip-text text-transparent">
              Aman dan Transparan
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            LATIVA adalah sistem pengawasan dan monitoring terpadu berbasis AI yang meningkatkan akuntabilitas pejabat publik dan keamanan kota secara real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/cctv-monitoring" className="group bg-white text-[#0A4D8C] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 flex items-center space-x-2">
              <Activity className="w-5 h-5 group-hover:animate-pulse" />
              <span>Lihat Aktivitas Kota</span>
            </Link>
            <Link to="/dashboard" className="group border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Laporkan Anomali</span>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="text-center bg-white backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="text-4xl md:text-5xl font-bold text-[#0A4D8C] mb-2">100%</div>
              <div className="text-[#0A4D8C] text-sm font-medium">Keterbukaan Laporan</div>
            </div>
            <div className="text-center bg-white backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="text-4xl md:text-5xl font-bold text-[#0A4D8C] mb-2">80%</div>
              <div className="text-[#0A4D8C] text-sm font-medium">Respon Lebih Cepat</div>
            </div>
            <div className="text-center bg-white backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="text-4xl md:text-5xl font-bold text-[#0A4D8C] mb-2">1,000+</div>
              <div className="text-[#0A4D8C] text-sm font-medium">Laporan Terverifikasi</div>
            </div>
            <div className="text-center bg-white backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="text-4xl md:text-5xl font-bold text-[#0A4D8C] mb-2">95%</div>
              <div className="text-[#0A4D8C] text-sm font-medium">Pejabat Tervalidasi</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
          <path fill="#F5F7FA" fillOpacity="1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
}
