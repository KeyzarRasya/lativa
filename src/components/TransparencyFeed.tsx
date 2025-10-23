import { useState } from 'react';
import { Camera, Shield, AlertTriangle, Users, Filter } from 'lucide-react';

export default function TransparencyFeed() {
  const [activeFilter, setActiveFilter] = useState('Semua');

  const filters = ['Semua', 'Kriminalitas', 'Aktivitas Pejabat', 'Publikasi Kota'];

  const posts = [
    {
      id: 1,
      category: 'Kriminalitas',
      title: 'Penanganan Cepat Tawuran',
      description: 'Terjadi dugaan tawuran di Jl. Basuki Rahmat. Penanganan dilakukan Satpol PP dalam 3 menit.',
      timestamp: '2 jam yang lalu',
      confidence: 92,
      location: 'Jl. Basuki Rahmat',
      tags: ['KeamananKota', 'RespondCepat'],
      status: 'Ditangani'
    },
    {
      id: 2,
      category: 'Aktivitas Pejabat',
      title: 'Kunjungan Kerja Camat',
      description: 'Camat Jatiluhur melakukan kunjungan ke Desa Cikopo untuk monitoring program bantuan sosial.',
      timestamp: '4 jam yang lalu',
      confidence: 88,
      location: 'Desa Cikopo, Jatiluhur',
      tags: ['TransparansiPejabat', 'ProgramSosial'],
      status: 'Terverifikasi'
    },
    {
      id: 3,
      category: 'Publikasi Kota',
      title: 'Peningkatan Keamanan Pasar',
      description: 'Instalasi 5 CCTV baru di area Pasar Baru untuk meningkatkan keamanan pedagang dan pembeli.',
      timestamp: '1 hari yang lalu',
      confidence: 100,
      location: 'Pasar Baru, Purwakarta',
      tags: ['InfrastrukturKota', 'SmartCity'],
      status: 'Selesai'
    },
    {
      id: 4,
      category: 'Kriminalitas',
      title: 'Pencegahan Pencurian',
      description: 'AI mendeteksi aktivitas mencurigakan di area parkir. Tim keamanan berhasil mencegah aksi pencurian.',
      timestamp: '1 hari yang lalu',
      confidence: 95,
      location: 'Parkir Alun-alun',
      tags: ['PrevensiKriminal', 'AIMonitoring'],
      status: 'Ditangani'
    },
    {
      id: 5,
      category: 'Aktivitas Pejabat',
      title: 'Validasi LHKPN Bulanan',
      description: '48 pejabat telah menyelesaikan pelaporan LHKPN periode bulan ini dengan status terverifikasi.',
      timestamp: '2 hari yang lalu',
      confidence: 100,
      location: 'Kantor Inspektorat',
      tags: ['TransparansiPejabat', 'LHKPN'],
      status: 'Terverifikasi'
    },
    {
      id: 6,
      category: 'Publikasi Kota',
      title: 'Pelatihan Sistem LATIVA',
      description: 'Pelatihan penggunaan sistem LATIVA untuk 30 petugas lapangan dan operator monitoring.',
      timestamp: '3 hari yang lalu',
      confidence: 100,
      location: 'Gedung Diklat Pemkab',
      tags: ['KapasitasSDM', 'SmartGovernance'],
      status: 'Selesai'
    }
  ];

  const filteredPosts = activeFilter === 'Semua'
    ? posts
    : posts.filter(post => post.category === activeFilter);

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Kriminalitas':
        return <AlertTriangle className="w-5 h-5" />;
      case 'Aktivitas Pejabat':
        return <Shield className="w-5 h-5" />;
      case 'Publikasi Kota':
        return <Users className="w-5 h-5" />;
      default:
        return <Camera className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Kriminalitas':
        return 'from-red-500 to-orange-500';
      case 'Aktivitas Pejabat':
        return 'from-blue-500 to-cyan-500';
      case 'Publikasi Kota':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0A4D8C] mb-4">
            Transparency Feed
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Informasi publik real-time tentang keamanan kota dan aktivitas pejabat
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-3">
          <div className="flex items-center space-x-2 text-gray-600 mr-4">
            <Filter className="w-5 h-5" />
            <span className="font-semibold">Filter:</span>
          </div>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-[#0A4D8C] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-[#009688] group fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`h-2 bg-gradient-to-r ${getCategoryColor(post.category)}`}></div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${getCategoryColor(post.category)} text-white`}>
                    {getCategoryIcon(post.category)}
                  </div>
                  <span className="text-xs text-gray-500">{post.timestamp}</span>
                </div>

                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-[#0A4D8C]/10 text-[#0A4D8C] rounded-full text-xs font-semibold mb-2">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold text-[#0A4D8C] mb-2 group-hover:text-[#009688] transition-colors">
                    {post.title}
                  </h3>
                </div>

                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {post.description}
                </p>

                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
                  <Camera className="w-4 h-4" />
                  <span>{post.location}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs">
                    <span className="text-gray-500">AI Confidence: </span>
                    <span className="font-bold text-[#009688]">{post.confidence}%</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    post.status === 'Terverifikasi'
                      ? 'bg-blue-100 text-blue-700'
                      : post.status === 'Ditangani'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {post.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="bg-[#0A4D8C] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#083a6b] transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center space-x-2">
            <span>Lihat Semua Publikasi</span>
            <Camera className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
