import { MapPin, AlertCircle, CheckCircle, Clock, TrendingUp, Plus, X, MapPinned } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Swal from 'sweetalert2';
import { 
  getIncidents, 
  subscribeToIncidents, 
  createIncident,
  formatIncidentForMap,
  getIncidentStats 
} from '../services/incidentService';

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
    address: '',
    zone: 'yellow' // default zone untuk laporan baru
  });
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const mapRef = useRef(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  
  // Firestore data states
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, unverified, verified, handled, resolved

  // Helper function to check if date is today
  const isToday = (timestamp) => {
    if (!timestamp) return false;
    const today = new Date();
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  useEffect(() => {
    // Fetch initial incidents data
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const data = await getIncidents({ limitCount: 100 });
        // Filter only today's incidents
        const todayIncidents = data.filter(incident => 
          isToday(incident.timestamp || incident.createdAt)
        );
        const formatted = todayIncidents.map(formatIncidentForMap);
        setIncidents(formatted);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching incidents:', error);
        setLoading(false);
        // Fallback to sample data if Firebase fails
        setIncidents(getSampleIncidents());
      }
    };

    fetchIncidents();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToIncidents((data) => {
      // Filter only today's incidents
      const todayIncidents = data.filter(incident => 
        isToday(incident.timestamp || incident.createdAt)
      );
      const formatted = todayIncidents.map(formatIncidentForMap);
      setIncidents(formatted);
    }, { limitCount: 100 });

    // Update stats periodically
    const statsInterval = setInterval(async () => {
      try {
        const stats = await getIncidentStats();
        setActiveIncidents(stats.active);
        setIntegrityScore(Math.min(95, Math.max(82, Math.floor(stats.averageConfidence))));
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(statsInterval);
    };
  }, []);

  // Koordinat Purwakarta: -6.5569, 107.4433
  const purwakartaCenter = [-6.5569, 107.4433];

  // Filter incidents berdasarkan search query dan status
  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = searchQuery === '' || 
      incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Sample data fallback jika Firebase error
  const getSampleIncidents = () => [
    {
      type: 'Unverified',
      location: 'Jl. Veteran, Kec. Purwakarta',
      description: 'Terdeteksi aktivitas mencurigakan dengan potensi konflik antar kelompok',
      coordinates: [-6.5550, 107.4410],
      confidence: 88,
      status: 'unverified',
      zone: 'yellow',
      time: '2 menit lalu'
    },
    {
      type: 'Verified',
      location: 'Kantor Kecamatan Jatiluhur',
      description: 'Laporan terverifikasi - Aktivitas tidak biasa di area kantor kecamatan',
      coordinates: [-6.5700, 107.4600],
      confidence: 92,
      status: 'verified',
      zone: 'red',
      time: '15 menit lalu'
    },
    {
      type: 'Handled',
      location: 'Jl. Bungursari, Purwakarta',
      description: 'Sedang ditangani pihak berwajib - Kasus pencurian',
      coordinates: [-6.5600, 107.4500],
      confidence: 95,
      status: 'handled',
      zone: 'yellow',
      time: '30 menit lalu'
    },
    {
      type: 'Resolved',
      location: 'Pasar Baru, Purwakarta',
      description: 'Kasus pencurian berhasil ditangani, pelaku diamankan petugas',
      coordinates: [-6.5580, 107.4450],
      confidence: 95,
      status: 'resolved',
      zone: 'green',
      time: '1 jam lalu'
    }
  ];

  // Custom marker icons based on zone (not status)
  const getMarkerColor = (zone) => {
    switch(zone) {
      case 'red': return '#ef4444'; // red
      case 'yellow': return '#eab308'; // yellow
      case 'green': return '#22c55e'; // green
      default: return '#eab308'; // default yellow
    }
  };

  const createCustomIcon = (zone) => {
    const color = getMarkerColor(zone);
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

    // Fetch real address from coordinates using Nominatim (OpenStreetMap)
    await fetchAddressFromCoordinates(lat, lng);
    
    setIsSelectingLocation(false);
  };

  // Fungsi untuk fetch alamat dari koordinat menggunakan Nominatim OSM (GRATIS)
  const fetchAddressFromCoordinates = async (lat, lng) => {
    try {
      setIsFetchingAddress(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=id`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        // Format alamat yang lebih readable untuk Indonesia
        const addr = data.address;
        let formattedAddress = '';
        
        if (addr.road || addr.street) {
          formattedAddress += `Jl. ${addr.road || addr.street}`;
        } else if (addr.hamlet || addr.village) {
          formattedAddress += addr.hamlet || addr.village;
        }
        
        if (addr.suburb || addr.neighbourhood) {
          formattedAddress += `, ${addr.suburb || addr.neighbourhood}`;
        }
        
        if (addr.city || addr.town || addr.village) {
          formattedAddress += `, ${addr.city || addr.town || addr.village}`;
        }
        
        if (addr.state) {
          formattedAddress += `, ${addr.state}`;
        }
        
        // Jika format gagal, gunakan display_name
        if (!formattedAddress) {
          formattedAddress = data.display_name;
        }
        
        setReportForm(prev => ({
          ...prev,
          address: formattedAddress
        }));
      } else {
        // Fallback ke alamat generik Indonesia
        setReportForm(prev => ({
          ...prev,
          address: `Koordinat: ${lat.toFixed(6)}, ${lng.toFixed(6)}, Indonesia`
        }));
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      // Fallback ke alamat generik Indonesia
      setReportForm(prev => ({
        ...prev,
        address: `Koordinat: ${lat.toFixed(6)}, ${lng.toFixed(6)}, Indonesia`
      }));
    } finally {
      setIsFetchingAddress(false);
    }
  };

  // Fungsi untuk deteksi lokasi perangkat realtime (GRATIS - menggunakan browser Geolocation API)
  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      Swal.fire({
        icon: 'error',
        title: 'Geolocation Tidak Didukung',
        text: 'Browser Anda tidak mendukung deteksi lokasi',
        confirmButtonColor: '#0A4D8C',
      });
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        setReportForm(prev => ({
          ...prev,
          coordinates: [latitude, longitude]
        }));

        // Fetch alamat dari koordinat
        await fetchAddressFromCoordinates(latitude, longitude);
        
        setIsDetectingLocation(false);
        
        Swal.fire({
          icon: 'success',
          title: 'Lokasi Terdeteksi!',
          html: `
            <p class="text-gray-600 mb-2">Lokasi perangkat Anda berhasil terdeteksi</p>
            <p class="text-sm text-gray-500">Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}</p>
          `,
          confirmButtonColor: '#0A4D8C',
          timer: 3000,
          timerProgressBar: true
        });
      },
      (error) => {
        setIsDetectingLocation(false);
        let errorMessage = 'Gagal mendeteksi lokasi';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Anda menolak akses lokasi. Mohon aktifkan izin lokasi di browser.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informasi lokasi tidak tersedia';
            break;
          case error.TIMEOUT:
            errorMessage = 'Waktu deteksi lokasi habis';
            break;
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Gagal Deteksi Lokasi',
          text: errorMessage,
          confirmButtonColor: '#0A4D8C',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmitReport = async () => {
    if (!reportForm.coordinates || !reportForm.address || reportForm.description.length < 20) {
      Swal.fire({
        icon: 'warning',
        title: 'Data Tidak Lengkap',
        text: 'Mohon lengkapi semua field yang diperlukan',
        confirmButtonColor: '#0A4D8C',
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare incident data for Firestore sesuai struktur database
      const incidentData = {
        type: reportForm.zone === 'yellow' ? 'Unverified' : reportForm.zone === 'red' ? 'Verified' : 'Resolved',
        status: 'unverified', // semua laporan baru default unverified
        zone: reportForm.zone,
        location: reportForm.address,
        description: reportForm.description,
        coordinates: {
          lat: reportForm.coordinates[0],
          lng: reportForm.coordinates[1]
        },
        address: reportForm.address,
        confidence: reportForm.zone === 'red' ? 85 : reportForm.zone === 'yellow' ? 70 : 95,
        metadata: {
          source: 'citizen_report',
          priority: reportForm.zone === 'red' ? 'high' : reportForm.zone === 'yellow' ? 'medium' : 'low',
          category: 'general',
          reportedBy: 'anonymous',
          reportTime: new Date().toISOString(),
          deviceLocation: reportForm.coordinates
        }
      };

      // Submit to Firestore
      const docId = await createIncident(incidentData);
      console.log('Laporan berhasil dibuat dengan ID:', docId);

      // Show success message with SweetAlert2
      await Swal.fire({
        icon: 'success',
        title: 'Laporan Berhasil Dikirim!',
        html: `
          <p class="text-gray-600 mb-2">Laporan Anda telah berhasil dikirim.</p>
          <p class="text-sm text-gray-500">ID Laporan: <strong>${docId}</strong></p>
          <p class="text-sm text-gray-500 mt-2">Zona: <strong class="text-${reportForm.zone === 'red' ? 'red' : reportForm.zone === 'yellow' ? 'yellow' : 'green'}-600">${reportForm.zone.toUpperCase()}</strong></p>
          <p class="text-sm text-gray-500 mt-2">Tim kami akan segera menindaklanjuti laporan Anda.</p>
        `,
        confirmButtonColor: '#0A4D8C',
        confirmButtonText: 'OK',
        timer: 5000,
        timerProgressBar: true,
      });

      // Reset form dan tutup modal
      setShowReportModal(false);
      setReportForm({
        coordinates: null,
        description: '',
        address: '',
        zone: 'yellow'
      });
      setIsSelectingLocation(false);
      setSubmitting(false);

      // Data akan otomatis diperbarui karena subscribeToIncidents sudah running
      const stats = await getIncidentStats();
      setActiveIncidents(stats.active);
      
    } catch (error) {
      console.error('Error submitting report:', error);
      
      // Show error message with SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengirim Laporan',
        text: error.message || 'Terjadi kesalahan saat mengirim laporan. Silakan coba lagi.',
        confirmButtonColor: '#0A4D8C',
        confirmButtonText: 'Coba Lagi'
      });
      
      setSubmitting(false);
    }
  };

  // Component untuk handle map click events
  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  // Component untuk zoom map ke lokasi tertentu
  const MapViewController = ({ center, zoom }) => {
    const map = useMap();
    
    useEffect(() => {
      if (center && center.length === 2) {
        map.setView(center, zoom || 16, {
          animate: true,
          duration: 1
        });
      }
    }, [center, zoom, map]);
    
    return null;
  };

  return (
    <section id="dashboard" className="py-24 pt-40 bg-gradient-to-b from-white to-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0A4D8C] mb-4">
            Smart Dashboard Preview
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Analisis Data Real-Time. Tindakan Cepat. Tata Kelola yang Bersih.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Menampilkan laporan hari ini ({new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})
          </p>
        </div>

        {/* Floating Button Buat Laporan */}
        <button
          onClick={() => setShowReportModal(true)}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-[#0A4D8C] to-[#009688] text-white p-4 rounded-full font-bold hover:from-[#083a6b] hover:to-[#007d71] transition-all duration-300 shadow-2xl hover:shadow-3xl z-40 flex items-center space-x-3 group"
        >
          <Plus className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
            Buat Laporan
          </span>
        </button>

        <div className="glass-card rounded-3xl shadow-2xl p-8 border-2 border-white/50">
          {/* Full Width Layout - Map and List Side by Side */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Peta Incident */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-6 relative overflow-hidden">
                <h3 className="text-xl font-bold text-[#0A4D8C] mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Peta Incident Real-Time Purwakarta
                </h3>

                <div className="relative h-[600px] rounded-xl overflow-hidden shadow-inner">
                  {loading ? (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A4D8C] mx-auto mb-3"></div>
                        <p className="text-gray-600">Loading map data...</p>
                      </div>
                    </div>
                  ) : (
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
                    
                    {filteredIncidents.map((incident, idx) => (
                      <Marker 
                        key={incident.id || idx} 
                        position={incident.coordinates}
                        icon={createCustomIcon(incident.zone || 'yellow')}
                      >
                        <Popup>
                          <div className="p-2">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${
                                incident.status === 'resolved'
                                  ? 'bg-green-500 text-white'
                                  : incident.status === 'handled'
                                  ? 'bg-orange-500 text-white'
                                  : incident.status === 'verified'
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-yellow-500 text-white'
                              }`}>
                                {incident.status === 'unverified' ? 'Unverified' : 
                                 incident.status === 'verified' ? 'Verified' :
                                 incident.status === 'handled' ? 'Handled' : 'Resolved'}
                              </div>
                              <div className={`px-2 py-1 rounded text-xs font-semibold ${
                                (incident.zone || 'yellow') === 'green'
                                  ? 'bg-green-100 text-green-800'
                                  : (incident.zone || 'yellow') === 'red'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                Zone {(incident.zone || 'yellow').toUpperCase()}
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{incident.location}</p>
                            <p className="text-sm font-semibold text-gray-800 mb-1">{incident.description}</p>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
                              <span>Confidence: {incident.confidence}%</span>
                              <span>{incident.time}</span>
                            </div>
                          </div>
                        </Popup>
                        {(incident.zone || 'yellow') === 'red' && (
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
                  )}

                  {/* Legend - Updated */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg z-[1000]">
                    <div className="text-xs font-bold text-gray-800 mb-2">ZONA BAHAYA</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                        <div>
                          <div className="font-medium text-gray-700">Green Zone</div>
                          <div className="text-gray-500 text-[10px]">Area Aman</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-white"></div>
                        <div>
                          <div className="font-medium text-gray-700">Yellow Zone</div>
                          <div className="text-gray-500 text-[10px]">Perlu Hati- hati</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white"></div>
                        <div>
                          <div className="font-medium text-gray-700">Red Zone</div>
                          <div className="text-gray-500 text-[10px]">Area Berbahaya</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg z-[1000]">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-700">
                        {filteredIncidents.length} / {incidents.length} Incidents
                      </span>
                    </div>
                  </div>
                </div>

                {/* Zone Statistics */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {incidents.filter(i => (i.zone || 'yellow') === 'green').length}
                    </div>
                    <div className="text-xs text-green-700 font-semibold">Green Zone</div>
                    <div className="text-[10px] text-green-600">Area Aman</div>
                  </div>
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {incidents.filter(i => (i.zone || 'yellow') === 'yellow').length}
                    </div>
                    <div className="text-xs text-yellow-700 font-semibold">Yellow Zone</div>
                    <div className="text-[10px] text-yellow-600">Perlu Perhatian</div>
                  </div>
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {incidents.filter(i => (i.zone || 'yellow') === 'red').length}
                    </div>
                    <div className="text-xs text-red-700 font-semibold">Red Zone</div>
                    <div className="text-[10px] text-red-600">Prioritas Tinggi</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Incident List */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg h-full">
                <h3 className="text-xl font-bold text-[#0A4D8C] mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Realtime Incident Stream
                </h3>

                {/* Search dan Filter */}
                <div className="mb-4 space-y-3">
                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari berdasarkan lokasi atau deskripsi..."
                      className="w-full px-4 py-2 pl-10 border-2 border-gray-200 rounded-lg focus:border-[#0A4D8C] focus:outline-none transition-colors text-sm"
                    />
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                    <button
                      onClick={() => setFilterStatus('all')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                        filterStatus === 'all'
                          ? 'bg-[#0A4D8C] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Semua ({incidents.length})
                    </button>
                    <button
                      onClick={() => setFilterStatus('unverified')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                        filterStatus === 'unverified'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Unverified ({incidents.filter(i => i.status === 'unverified').length})
                    </button>
                    <button
                      onClick={() => setFilterStatus('verified')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                        filterStatus === 'verified'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Verified ({incidents.filter(i => i.status === 'verified').length})
                    </button>
                    <button
                      onClick={() => setFilterStatus('handled')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                        filterStatus === 'handled'
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Ditangani ({incidents.filter(i => i.status === 'handled').length})
                    </button>
                    <button
                      onClick={() => setFilterStatus('resolved')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                        filterStatus === 'resolved'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Selesai ({incidents.filter(i => i.status === 'resolved').length})
                    </button>
                  </div>
                </div>

                {/* Scrollable Incident List */}
                <div className="space-y-3 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A4D8C] mx-auto mb-2"></div>
                      <p className="text-gray-500 text-sm">Loading incidents...</p>
                    </div>
                  ) : filteredIncidents.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">
                        {searchQuery || filterStatus !== 'all' 
                          ? 'Tidak ada incident yang cocok dengan pencarian'
                          : 'Tidak ada incident hari ini'}
                      </p>
                    </div>
                  ) : (
                    filteredIncidents.map((incident, idx) => {
                      const zone = incident.zone || 'yellow';
                      return (
                        <div
                          key={incident.id || idx}
                          onClick={() => setSelectedIncident(incident)}
                          className={`p-4 rounded-xl border-2 transition-all hover:shadow-md cursor-pointer ${
                            zone === 'red'
                              ? 'bg-red-50 border-red-200 hover:border-red-300'
                              : zone === 'yellow'
                              ? 'bg-yellow-50 border-yellow-200 hover:border-yellow-300'
                              : 'bg-green-50 border-green-200 hover:border-green-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1 flex-wrap">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  incident.status === 'resolved'
                                    ? 'bg-green-500 text-white'
                                    : incident.status === 'handled'
                                    ? 'bg-orange-500 text-white'
                                    : incident.status === 'verified'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-yellow-500 text-white'
                                }`}>
                                  {incident.status === 'unverified' ? 'Unverified' : 
                                   incident.status === 'verified' ? 'Verified' :
                                   incident.status === 'handled' ? 'Handled' : 'Resolved'}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                  zone === 'green'
                                    ? 'bg-green-100 text-green-800'
                                    : zone === 'red'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  Zone {zone.toUpperCase()}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {incident.time}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 font-medium mb-1 line-clamp-2">{incident.description}</p>
                              <p className="text-xs text-gray-600">{incident.location}</p>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-lg font-bold text-[#0A4D8C]">{incident.confidence}%</div>
                              <div className="text-xs text-gray-500">Confidence</div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
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
                  setReportForm({ coordinates: null, description: '', address: '', zone: 'yellow' });
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
                
                {/* Buttons untuk deteksi lokasi dan pilih manual */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={detectCurrentLocation}
                    disabled={isDetectingLocation || isFetchingAddress}
                    className="flex-1 bg-blue-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isDetectingLocation ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span className="text-sm">Mendeteksi...</span>
                      </>
                    ) : (
                      <>
                        <MapPinned className="w-4 h-4" />
                        <span className="text-sm">Deteksi Lokasi Saya</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSelectingLocation(true)}
                    disabled={isDetectingLocation || isFetchingAddress}
                    className="flex-1 bg-[#0A4D8C] text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-[#083a6b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Pilih di Peta</span>
                  </button>
                </div>

                <div className="relative h-64 rounded-xl overflow-hidden border-2 border-gray-200">
                  <MapContainer
                    center={purwakartaCenter}
                    zoom={13}
                    style={{ height: '100%', width: '100%', zIndex: 0 }}
                    scrollWheelZoom={true}
                    ref={mapRef}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapClickHandler />
                    
                    {/* Auto zoom dan center ke lokasi yang dipilih */}
                    {reportForm.coordinates && (
                      <MapViewController 
                        center={reportForm.coordinates} 
                        zoom={16} 
                      />
                    )}
                    
                    {reportForm.coordinates && (
                      <Marker 
                        position={reportForm.coordinates}
                        icon={L.divIcon({
                          className: 'custom-marker',
                          html: `<div style="background-color: ${getMarkerColor(reportForm.zone)}; width: 28px; height: 28px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 12px rgba(0,0,0,0.4);"></div>`,
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
                            <p className="text-xs font-semibold mt-1" style={{ color: getMarkerColor(reportForm.zone) }}>
                              Zone {reportForm.zone.toUpperCase()}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                    
                    {/* Accuracy circle around detected location */}
                    {reportForm.coordinates && (
                      <Circle
                        center={reportForm.coordinates}
                        radius={50}
                        pathOptions={{
                          color: getMarkerColor(reportForm.zone),
                          fillColor: getMarkerColor(reportForm.zone),
                          fillOpacity: 0.1,
                          weight: 2,
                          opacity: 0.5,
                        }}
                      />
                    )}
                  </MapContainer>
                  
                  {isSelectingLocation && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-pulse z-[1000]">
                      Klik pada peta untuk memilih lokasi
                    </div>
                  )}

                  {isFetchingAddress && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-[1000] flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      <span>Mengambil alamat...</span>
                    </div>
                  )}

                  {reportForm.coordinates && !isFetchingAddress && !isSelectingLocation && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-[1000] flex items-center space-x-2">
                      <MapPinned className="w-4 h-4" />
                      <span>Lokasi dipilih</span>
                    </div>
                  )}
                  
                  {reportForm.coordinates && (
                    <button
                      type="button"
                      onClick={() => {
                        setReportForm(prev => ({ ...prev, coordinates: null, address: '' }));
                        setIsSelectingLocation(true);
                      }}
                      className="absolute bottom-4 right-4 bg-white text-[#0A4D8C] px-4 py-2 rounded-lg shadow-lg text-sm font-medium hover:bg-gray-100 transition-colors z-[1000]"
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
                  disabled={isFetchingAddress}
                />
                <p className="text-xs text-gray-500 mt-1">Alamat akan otomatis terisi dari koordinat (OpenStreetMap). Anda dapat mengeditnya.</p>
              </div>

              {/* Zone Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pilih Zona Bahaya <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setReportForm(prev => ({ ...prev, zone: 'green' }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      reportForm.zone === 'green'
                        ? 'border-green-500 bg-green-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white shadow"></div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-gray-800">Green</div>
                        <div className="text-xs text-gray-600">Aman</div>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setReportForm(prev => ({ ...prev, zone: 'yellow' }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      reportForm.zone === 'yellow'
                        ? 'border-yellow-500 bg-yellow-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-yellow-300'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-white shadow"></div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-gray-800">Yellow</div>
                        <div className="text-xs text-gray-600">Hati-hati</div>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setReportForm(prev => ({ ...prev, zone: 'red' }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      reportForm.zone === 'red'
                        ? 'border-red-500 bg-red-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-red-300'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow"></div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-gray-800">Red</div>
                        <div className="text-xs text-gray-600">Berbahaya</div>
                      </div>
                    </div>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Pilih zona sesuai tingkat bahaya: <strong>Green</strong> untuk area aman, 
                  <strong> Yellow</strong> untuk perlu perhatian, 
                  <strong> Red</strong> untuk situasi darurat/berbahaya
                </p>
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
                <p className="text-xs text-gray-500 mt-1">Minimal 20 karakter. Jelaskan dengan detail apa yang terjadi.</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3 sticky bottom-0">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportForm({ coordinates: null, description: '', address: '', zone: 'yellow' });
                  setIsSelectingLocation(false);
                }}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitReport}
                disabled={!reportForm.coordinates || !reportForm.address || reportForm.description.length < 20 || submitting}
                className="px-6 py-2.5 bg-gradient-to-r from-[#0A4D8C] to-[#009688] text-white rounded-xl font-semibold hover:from-[#083a6b] hover:to-[#007d71] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <span>Kirim Laporan</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Incident */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className={`p-6 flex items-center justify-between sticky top-0 z-10 ${
              (selectedIncident.zone || 'yellow') === 'red'
                ? 'bg-gradient-to-r from-red-500 to-red-600'
                : (selectedIncident.zone || 'yellow') === 'yellow'
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                : 'bg-gradient-to-r from-green-500 to-green-600'
            } text-white`}>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedIncident.status === 'resolved'
                      ? 'bg-green-700 text-white'
                      : selectedIncident.status === 'handled'
                      ? 'bg-orange-700 text-white'
                      : selectedIncident.status === 'verified'
                      ? 'bg-blue-700 text-white'
                      : 'bg-yellow-700 text-white'
                  }`}>
                    {selectedIncident.status === 'unverified' ? 'Unverified' : 
                     selectedIncident.status === 'verified' ? 'Verified' :
                     selectedIncident.status === 'handled' ? 'Handled' : 'Resolved'}
                  </span>
                  <span className="px-2 py-1 rounded bg-white/20 backdrop-blur-sm text-xs font-semibold">
                    Zone {(selectedIncident.zone || 'yellow').toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl font-bold">Detail Laporan Incident</h2>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Lokasi */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-5 h-5 text-[#0A4D8C]" />
                  <h3 className="text-lg font-bold text-gray-800">Lokasi</h3>
                </div>
                <p className="text-gray-700 ml-7">{selectedIncident.location}</p>
                <p className="text-xs text-gray-500 ml-7 mt-1">
                  Koordinat: {selectedIncident.coordinates[0].toFixed(6)}, {selectedIncident.coordinates[1].toFixed(6)}
                </p>
              </div>

              {/* Deskripsi */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-[#0A4D8C]" />
                  <h3 className="text-lg font-bold text-gray-800">Deskripsi Lengkap</h3>
                </div>
                <p className="text-gray-700 ml-7 leading-relaxed">{selectedIncident.description}</p>
              </div>

              {/* Info Tambahan */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#0A4D8C]" />
                    <h4 className="text-sm font-bold text-gray-700">Tingkat Kepercayaan</h4>
                  </div>
                  <div className="text-3xl font-bold text-[#0A4D8C]">{selectedIncident.confidence}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-[#0A4D8C] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${selectedIncident.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-[#0A4D8C]" />
                    <h4 className="text-sm font-bold text-gray-700">Waktu Laporan</h4>
                  </div>
                  <div className="text-lg font-bold text-gray-700">{selectedIncident.time}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Map Preview */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-5 h-5 text-[#0A4D8C]" />
                  <h3 className="text-lg font-bold text-gray-800">Lokasi di Peta</h3>
                </div>
                <div className="relative h-64 rounded-xl overflow-hidden border-2 border-gray-200 mt-2">
                  <MapContainer
                    center={selectedIncident.coordinates}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker 
                      position={selectedIncident.coordinates}
                      icon={createCustomIcon(selectedIncident.zone || 'yellow')}
                    >
                      <Popup>
                        <div className="p-2 text-center">
                          <p className="text-sm font-semibold text-gray-800">{selectedIncident.location}</p>
                        </div>
                      </Popup>
                    </Marker>
                    {(selectedIncident.zone || 'yellow') === 'red' && (
                      <Circle
                        center={selectedIncident.coordinates}
                        radius={150}
                        pathOptions={{
                          color: '#ef4444',
                          fillColor: '#ef4444',
                          fillOpacity: 0.2,
                          weight: 2,
                        }}
                      />
                    )}
                  </MapContainer>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3 sticky bottom-0">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-6 py-2.5 bg-gradient-to-r from-[#0A4D8C] to-[#009688] text-white rounded-xl font-semibold hover:from-[#083a6b] hover:to-[#007d71] transition-all duration-300 shadow-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
