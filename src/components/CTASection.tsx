import { Shield, Eye, Users } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#0A4D8C] via-[#0d5a9e] to-[#009688] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#009688] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transparansi adalah Hak Publik
          </h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            LATIVA menghadirkan keterbukaan data dan keamanan yang humanis melalui kolaborasi teknologi dan masyarakat
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300">
            <div className="bg-white/20 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Keamanan Terjamin</h3>
            <p className="text-white/80">
              Monitoring 24/7 dengan teknologi AI untuk melindungi masyarakat
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300">
            <div className="bg-white/20 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Transparansi Penuh</h3>
            <p className="text-white/80">
              Akses terbuka ke data publik untuk akuntabilitas pemerintahan
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300">
            <div className="bg-white/20 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Partisipasi Aktif</h3>
            <p className="text-white/80">
              Masyarakat dapat melaporkan dan memantau perkembangan kota
            </p>
          </div>
        </div>

        <div className="text-center">
          <button className="bg-white text-[#0A4D8C] px-10 py-5 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 inline-flex items-center space-x-3">
            <span>Buka Portal Transparansi</span>
            <Eye className="w-6 h-6" />
          </button>
          <p className="text-white/70 mt-6 text-sm">
            Bergabunglah dengan ribuan warga Purwakarta yang memantau kotanya
          </p>
        </div>
      </div>
    </section>
  );
}
