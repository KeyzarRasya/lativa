import { Search, Clock, MessageSquare, Scale, TrendingUp, Award } from 'lucide-react';

export default function ImpactSection() {
  const impacts = [
    {
      icon: Search,
      value: '100%',
      label: 'Keterbukaan Laporan Publik',
      description: 'Semua laporan dapat diakses oleh masyarakat secara transparan',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Clock,
      value: '80%',
      label: 'Waktu Respon Lebih Cepat',
      description: 'Peningkatan signifikan dalam kecepatan tanggap keamanan',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: MessageSquare,
      value: '1,000+',
      label: 'Laporan Terverifikasi',
      description: 'Laporan masyarakat yang telah diproses dan divalidasi',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Scale,
      value: '95%',
      label: 'Pejabat Tervalidasi LHKPN',
      description: 'Tingkat kepatuhan pelaporan harta kekayaan pejabat',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const achievements = [
    {
      icon: TrendingUp,
      title: 'Peningkatan Kepercayaan Publik',
      description: 'Survei menunjukkan 85% masyarakat merasa lebih aman dan percaya pada pemerintah daerah'
    },
    {
      icon: Award,
      title: 'Penghargaan Inovasi Daerah',
      description: 'LATIVA mendapat apresiasi sebagai inovasi smart governance terbaik di Indonesia'
    }
  ];

  return (
    <section id="dampak" className="py-24 bg-gradient-to-b from-[#F5F7FA] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0A4D8C] mb-4">
            Dampak LATIVA untuk Purwakarta
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transformasi nyata dalam tata kelola pemerintahan dan keamanan kota
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {impacts.map((impact, index) => (
            <div
              key={index}
              className="fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center border-2 border-gray-100 hover:border-[#009688] group h-full">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${impact.color} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <impact.icon className="w-10 h-10 text-white" />
                </div>

                <div className="text-5xl font-bold text-[#0A4D8C] mb-3">
                  {impact.value}
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  {impact.label}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {impact.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-8 border-2 border-white/50 hover:border-[#009688] transition-all duration-300 fade-in"
              style={{ animationDelay: `${0.6 + index * 0.2}s` }}
            >
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-[#0A4D8C] to-[#009688] p-4 rounded-xl flex-shrink-0">
                  <achievement.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0A4D8C] mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-[#0A4D8C] to-[#009688] rounded-3xl shadow-2xl p-12 text-white text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Lihat Dampak Lebih Detail
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Pelajari bagaimana LATIVA mengubah Purwakarta menjadi kota yang lebih aman, transparan, dan akuntabel
          </p>
          <button className="bg-white text-[#0A4D8C] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center space-x-2">
            <span>Lihat Studi Kasus</span>
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
