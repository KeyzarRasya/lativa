import { Brain, Database, Shield, Zap } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="tentang" className="py-24 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A4D8C] mb-6">
              Apa itu LATIVA?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              LATIVA merupakan inovasi berbasis <span className="font-semibold text-[#009688]">Artificial Intelligence</span> yang terintegrasi dengan sistem tata kelola daerah. Melalui analisis LHKPN, publikasi media sosial, dan data CCTV kota, LATIVA membantu pemerintah dan masyarakat mewujudkan tata kelola yang bersih, aman, dan berbasis data.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Sistem ini dirancang untuk meningkatkan transparansi, akuntabilitas, dan keamanan di Kabupaten Purwakarta melalui pengawasan cerdas yang objektif dan real-time.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-[#0A4D8C]">
                <div className="text-3xl font-bold text-[#0A4D8C] mb-2">24/7</div>
                <div className="text-sm text-gray-600">Monitoring Real-time</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-[#009688]">
                <div className="text-3xl font-bold text-[#009688] mb-2">AI</div>
                <div className="text-sm text-gray-600">Powered Analysis</div>
              </div>
            </div>
          </div>

          <div className="fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0A4D8C] to-[#009688] rounded-3xl transform rotate-3 opacity-10"></div>
              <div className="relative glass-card rounded-3xl p-8 border-2 border-white/50 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 group">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#0A4D8C] mb-2">AI Analytics</h3>
                      <p className="text-gray-600">
                        Analisis cerdas menggunakan machine learning untuk mendeteksi pola dan anomali
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Database className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#0A4D8C] mb-2">Big Data Integration</h3>
                      <p className="text-gray-600">
                        Integrasi data LHKPN, CCTV, dan publikasi untuk insight komprehensif
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#0A4D8C] mb-2">Security & Privacy</h3>
                      <p className="text-gray-600">
                        Keamanan data terjamin dengan enkripsi dan privasi warga dilindungi
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#0A4D8C] mb-2">Fast Response</h3>
                      <p className="text-gray-600">
                        Notifikasi real-time dan aksi cepat untuk insiden keamanan
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
