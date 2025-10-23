import { Video, Brain, FileCheck, Globe } from 'lucide-react';

export default function IntegrationFlow() {
  const flows = [
    {
      icon: Video,
      title: 'CCTV Kota Real-time',
      description: 'AI mengenali aktivitas publik dan mendeteksi empat pola utama',
      items: [
        'Tawuran dan kekerasan fisik',
        'Maling / pencurian',
        'Pelecehan / tindak asusila',
        'Aktivitas pejabat (kunjungan, interaksi publik, pelanggaran etika dinas)'
      ],
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: Brain,
      title: 'Analisis AI Terpadu',
      description: 'Sistem menghubungkan hasil CCTV dengan data pejabat',
      items: [
        'Analisis LHKPN pejabat',
        'Publikasi resmi dan media sosial dinas',
        'Pattern recognition behavior',
        'Cross-reference data integrity'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FileCheck,
      title: 'Pelaporan & Validasi Otomatis',
      description: 'Hasil analisis diverifikasi oleh sistem dan tim pengawas',
      items: [
        'Automated report generation',
        'Multi-layer verification',
        'Human oversight approval',
        'Compliance checking'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Globe,
      title: 'Public Transparency Feed',
      description: 'Rangkuman aktivitas kota dan pejabat muncul di portal publik',
      items: [
        'Real-time public dashboard',
        'Curated transparency reports',
        'Privacy-protected disclosure',
        'Citizen engagement platform'
      ],
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-[#F5F7FA] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0A4D8C] mb-4">
            Integrasi Kota & Tata Kelola
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Alur kerja LATIVA yang menghubungkan pengawasan kota dengan transparansi pemerintahan
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#0A4D8C] via-[#009688] to-[#0A4D8C] transform -translate-y-1/2 z-0"></div>

          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {flows.map((flow, index) => (
              <div key={index} className="fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 h-full border-2 border-gray-100 hover:border-[#009688] group">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${flow.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                    <flow.icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0A4D8C] text-white font-bold mb-3">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-[#0A4D8C] mb-2">{flow.title}</h3>
                    <p className="text-sm text-gray-600">{flow.description}</p>
                  </div>

                  <ul className="space-y-2">
                    {flow.items.map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#009688] mt-1.5 mr-2 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#0A4D8C] to-[#009688] text-white px-8 py-4 rounded-2xl shadow-lg">
            <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
            <span className="font-semibold">Sistem Terintegrasi & Real-time</span>
          </div>
        </div>
      </div>
    </section>
  );
}
