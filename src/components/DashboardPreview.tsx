import { MapPin, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DashboardPreview() {
  const [activeIncidents, setActiveIncidents] = useState(12);
  const [integrityScore, setIntegrityScore] = useState(85);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIncidents(prev => Math.max(8, Math.min(15, prev + (Math.random() > 0.5 ? 1 : -1))));
      setIntegrityScore(prev => Math.max(82, Math.min(95, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const incidents = [
    {
      type: 'Tawuran',
      location: 'Jl. Veteran, Kec. Purwakarta',
      confidence: 92,
      status: 'active',
      time: '2 menit lalu'
    },
    {
      type: 'Aktivitas Pejabat',
      location: 'Kantor Kecamatan Jatiluhur',
      confidence: 88,
      status: 'verified',
      time: '15 menit lalu'
    },
    {
      type: 'Pencurian',
      location: 'Pasar Baru, Purwakarta',
      confidence: 95,
      status: 'resolved',
      time: '1 jam lalu'
    }
  ];

  const cctvPoints = [
    { x: 15, y: 20, active: true },
    { x: 35, y: 45, active: true },
    { x: 55, y: 30, active: false },
    { x: 70, y: 60, active: true },
    { x: 80, y: 25, active: true },
    { x: 25, y: 70, active: true },
    { x: 60, y: 75, active: true },
    { x: 45, y: 55, active: true }
  ];

  return (
    <section id="dashboard" className="py-24 bg-gradient-to-b from-white to-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0A4D8C] mb-4">
            Smart Dashboard Preview
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Analisis Data Real-Time. Tindakan Cepat. Tata Kelola yang Bersih.
          </p>
        </div>

        <div className="glass-card rounded-3xl shadow-2xl p-8 border-2 border-white/50">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-6 relative overflow-hidden">
                <h3 className="text-xl font-bold text-[#0A4D8C] mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Peta CCTV Kota Purwakarta
                </h3>

                <div className="relative h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path
                      d="M20,30 Q30,20 40,25 T60,30 Q70,35 80,30"
                      fill="none"
                      stroke="#0A4D8C"
                      strokeWidth="0.5"
                      opacity="0.3"
                    />
                    <path
                      d="M10,50 Q30,45 50,50 T90,55"
                      fill="none"
                      stroke="#009688"
                      strokeWidth="0.5"
                      opacity="0.3"
                    />
                  </svg>

                  {cctvPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${point.x}%`, top: `${point.y}%` }}
                    >
                      <div className={`w-4 h-4 rounded-full ${point.active ? 'bg-green-500 glow-animation' : 'bg-gray-400'} border-2 border-white shadow-lg`}></div>
                      {point.active && (
                        <div className="absolute inset-0 w-4 h-4 rounded-full bg-green-500 animate-ping opacity-75"></div>
                      )}
                    </div>
                  ))}

                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-700">7 CCTV Aktif</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-[#0A4D8C] mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Realtime Incident Stream
                </h3>

                <div className="space-y-3">
                  {incidents.map((incident, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                        incident.status === 'active'
                          ? 'bg-red-50 border-red-200 glow-animation'
                          : incident.status === 'verified'
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-green-50 border-green-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              incident.status === 'active'
                                ? 'bg-red-500 text-white'
                                : incident.status === 'verified'
                                ? 'bg-blue-500 text-white'
                                : 'bg-green-500 text-white'
                            }`}>
                              {incident.type}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {incident.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 font-medium">{incident.location}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-lg font-bold text-[#0A4D8C]">{incident.confidence}%</div>
                          <div className="text-xs text-gray-500">Confidence</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#0A4D8C] to-[#009688] rounded-2xl p-6 text-white shadow-lg">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  AI Insights Panel
                </h3>

                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-sm mb-2 opacity-90">Incident Aktif</div>
                    <div className="text-4xl font-bold">{activeIncidents}</div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-sm mb-2 opacity-90">Skor Integritas Daerah</div>
                    <div className="flex items-end space-x-2">
                      <div className="text-4xl font-bold">{integrityScore}</div>
                      <div className="text-xl mb-1">/100</div>
                    </div>
                    <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-1000"
                        style={{ width: `${integrityScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-sm mb-3 opacity-90">Tren Mingguan</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Keamanan</span>
                        <span className="text-sm font-semibold flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +15%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Transparansi</span>
                        <span className="text-sm font-semibold flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +22%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Partisipasi</span>
                        <span className="text-sm font-semibold flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +8%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-[#0A4D8C] mb-4">Verifikasi LHKPN</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Terverifikasi</span>
                    <span className="flex items-center text-green-600 font-semibold">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      95%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Proses Review</span>
                    <span className="flex items-center text-yellow-600 font-semibold">
                      <Clock className="w-4 h-4 mr-1" />
                      3%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Perlu Tindakan</span>
                    <span className="flex items-center text-red-600 font-semibold">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      2%
                    </span>
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
