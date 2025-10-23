import { MapPin, AlertCircle, CheckCircle, Clock, TrendingUp, Plus, X, MapPinned } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function DashboardPreview() {
  const [activeIncidents, setActiveIncidents] = useState(12);
  const [integrityScore, setIntegrityScore] = useState(85);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    coordinates: null,
    description: '',
    address: ''
  });
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIncidents(prev => Math.max(8, Math.min(15, prev + (Math.random() > 0.5 ? 1 : -1))));
      setIntegrityScore(prev => Math.max(82, Math.min(95, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Koordinat Purwakarta: -6.5569, 107.4433
  const purwakartaCenter = [-6.5569, 107.4433];

  const incidents = [
    {
      type: 'Active',
      location: 'Jl. Veteran, Kec. Purwakarta',
      description: 'Terdeteksi aktivitas mencurigakan dengan potensi konflik antar kelompok',
      coordinates: [-6.5550, 107.4410], // Dekat pusat kota
      confidence: 92,
      status: 'active',
      time: '2 menit lalu'
    },
    {
      type: 'Unverified',
      location: 'Kantor Kecamatan Jatiluhur',
      description: 'Laporan warga tentang aktivitas tidak biasa di area kantor kecamatan',
      coordinates: [-6.5700, 107.4600], // Area Jatiluhur
      confidence: 88,
      status: 'unverified',
      time: '15 menit lalu'
    },
    {
      type: 'Resolved',
      location: 'Pasar Baru, Purwakarta',
      description: 'Kasus pencurian berhasil ditangani, pelaku diamankan petugas',
      coordinates: [-6.5580, 107.4450], // Area pasar
      confidence: 95,
      status: 'resolved',
      time: '1 jam lalu'
    }
  ];

  // Custom marker icons based on incident status
  const getMarkerColor = (status) => {
    switch(status) {
      case 'active': return '#ef4444'; // red
      case 'unverified': return '#eab308'; // yellow
      case 'resolved': return '#22c55e'; // green
      default: return '#6b7280'; // gray
    }
  };

  const createCustomIcon = (status) => {
    const color = getMarkerColor(status);
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // Handle map click untuk memilih koordinat
  const handleMapClick = async (e) => {
    if (!isSelectingLocation) return;
    
    const { lat, lng } = e.latlng;
    setReportForm(prev => ({
      ...prev,
      coordinates: [lat, lng]
    }));

    // Generate address dari koordinat (simulasi reverse geocoding)
    const address = `Jl. ${['Veteran', 'Bungursari', 'KK Singawinata', 'Ibrahim Singadilaga'][Math.floor(Math.random() * 4)]}, Kec. Purwakarta`;
    setReportForm(prev => ({
      ...prev,
      address
    }));
    
    setIsSelectingLocation(false);
  };

  const handleSubmitReport = () => {
    console.log('Report submitted:', reportForm);
    // Tambahkan logika submit di sini
    setShowReportModal(false);
    setReportForm({
      coordinates: null,
      description: '',
      address: ''
    });
  };

  // Component untuk handle map click events
  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  return (
    <section id="dashboard" className="py-24 pt-40 bg-gradient-to-b from-white to-[#F5F7FA]">
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
                  Peta Incident Real-Time Purwakarta
                </h3>

                <div className="relative h-80 rounded-xl overflow-hidden shadow-inner">
                  <MapContainer
                    center={purwakartaCenter}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {incidents.map((incident, idx) => (
                      <Marker 
                        key={idx} 
                        position={incident.coordinates}
                        icon={createCustomIcon(incident.status)}
                      >
                        <Popup>
                          <div className="p-2">
                            <div className={`px-2 py-1 rounded-full text-xs font-semibold mb-2 inline-block ${
                              incident.status === 'active'
                                ? 'bg-red-500 text-white'
                                : incident.status === 'unverified'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-green-500 text-white'
                            }`}>
                              {incident.type}
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{incident.location}</p>
                            <p className="text-sm font-semibold text-gray-800 mb-1">{incident.description}</p>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
                              <span>Confidence: {incident.confidence}%</span>
                              <span>{incident.time}</span>
                            </div>
                          </div>
                        </Popup>
                        {incident.status === 'active' && (
                          <Circle
                            center={incident.coordinates}
                            radius={150}
                            pathOptions={{
                              color: '#ef4444',
                              fillColor: '#ef4444',
                              fillOpacity: 0.2,
                              weight: 2,
                            }}
                          />
                        )}
                      </Marker>
                    ))}
                  </MapContainer>

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg z-[1000]">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white"></div>
                        <span className="font-medium text-gray-700">Active</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-white"></div>
                        <span className="font-medium text-gray-700">Unverified</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                        <span className="font-medium text-gray-700">Resolved</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg z-[1000]">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-700">{incidents.length} Incidents</span>
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
                          : incident.status === 'unverified'
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-green-50 border-green-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              incident.status === 'active'
                                ? 'bg-red-500 text-white'
                                : incident.status === 'unverified'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-green-500 text-white'
                            }`}>
                              {incident.type}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {incident.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 font-medium mb-1">{incident.description}</p>
                          <p className="text-xs text-gray-600">{incident.location}</p>
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
              {/* Button Buat Laporan */}
              <button
                onClick={() => setShowReportModal(true)}
                className="w-full bg-gradient-to-r from-[#0A4D8C] to-[#009688] text-white px-6 py-4 rounded-2xl font-bold text-lg hover:from-[#083a6b] hover:to-[#007d71] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Plus className="w-6 h-6 py-4" />
                <span>Buat Laporan Incident</span>
              </button>

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
            </div>
          </div>
        </div>
      </div>

      {/* Modal Buat Laporan */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0A4D8C] to-[#009688] text-white p-6 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold mb-1">Buat Laporan Incident</h2>
                <p className="text-white/90 text-sm">Laporkan kejadian mencurigakan di area Purwakarta</p>
              </div>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportForm({ coordinates: null, description: '', address: '' });
                  setIsSelectingLocation(false);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Map untuk pilih lokasi */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lokasi Incident <span className="text-red-500">*</span>
                </label>
                <div className="relative h-64 rounded-xl overflow-hidden border-2 border-gray-200">
                  <MapContainer
                    center={purwakartaCenter}
                    zoom={13}
                    style={{ height: '100%', width: '100%', zIndex: 0 }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapClickHandler />
                    
                    {reportForm.coordinates && (
                      <Marker 
                        position={reportForm.coordinates}
                        icon={L.divIcon({
                          className: 'custom-marker',
                          html: `<div style="background-color: #0A4D8C; width: 28px; height: 28px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 12px rgba(0,0,0,0.4);"></div>`,
                          iconSize: [28, 28],
                          iconAnchor: [14, 14],
                        })}
                      >
                        <Popup>
                          <div className="p-2 text-center">
                            <p className="text-sm font-semibold text-gray-800">Lokasi Terpilih</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {reportForm.coordinates[0].toFixed(6)}, {reportForm.coordinates[1].toFixed(6)}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                  </MapContainer>
                  
                  {!isSelectingLocation && !reportForm.coordinates && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <button
                        onClick={() => setIsSelectingLocation(true)}
                        className="bg-white text-[#0A4D8C] px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-colors shadow-lg"
                      >
                        <MapPinned className="w-5 h-5" />
                        <span>Klik untuk Pilih Lokasi</span>
                      </button>
                    </div>
                  )}
                  
                  {isSelectingLocation && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-pulse">
                      Klik pada peta untuk memilih lokasi
                    </div>
                  )}
                  
                  {reportForm.coordinates && (
                    <button
                      onClick={() => {
                        setReportForm(prev => ({ ...prev, coordinates: null, address: '' }));
                        setIsSelectingLocation(true);
                      }}
                      className="absolute bottom-4 right-4 bg-white text-[#0A4D8C] px-4 py-2 rounded-lg shadow-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                      Ubah Lokasi
                    </button>
                  )}
                </div>
                {reportForm.coordinates && (
                  <p className="text-xs text-gray-500 mt-2">
                    Koordinat: {reportForm.coordinates[0].toFixed(6)}, {reportForm.coordinates[1].toFixed(6)}
                  </p>
                )}
              </div>

              {/* Alamat Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={reportForm.address}
                  onChange={(e) => setReportForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Alamat akan terisi otomatis saat memilih lokasi"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A4D8C] focus:outline-none transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Anda dapat mengedit alamat yang ter-generate</p>
              </div>

              {/* Deskripsi Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi Incident <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reportForm.description}
                  onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Jelaskan detail kejadian yang Anda laporkan..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A4D8C] focus:outline-none transition-colors resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">Minimal 20 karakter</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3 sticky bottom-0">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportForm({ coordinates: null, description: '', address: '' });
                  setIsSelectingLocation(false);
                }}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitReport}
                disabled={!reportForm.coordinates || !reportForm.address || reportForm.description.length < 5}
                className="px-6 py-2.5 bg-gradient-to-r from-[#0A4D8C] to-[#009688] text-white rounded-xl font-semibold hover:from-[#083a6b] hover:to-[#007d71] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kirim Laporan
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
