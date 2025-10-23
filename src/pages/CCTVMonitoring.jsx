import { useState } from 'react';
import { Search, MapPin, Video, X, Maximize2 } from 'lucide-react';

export default function CCTVMonitoring() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Data lokasi CCTV di Purwakarta (dummy data)
  const locations = [
    'Alun-alun Purwakarta',
    'Jl. Veteran',
    'Jl. Bungursari',
    'Pasar Baru',
    'Terminal Purwakarta',
    'Stasiun Purwakarta',
    'Taman Sri Baduga',
    'Jl. Ipik Gandamanah',
    'Jl. KK Singawinata',
    'Jl. Industri Raya',
    'Jl. Raya Ciganea',
    'Jl. Raya Sadang',
    'Bundaran Kota',
    'Jl. Ibrahim Singadilaga',
    'Jl. Raya Cibatu'
  ];

  // Data CCTV dengan video sample
  const cctvData = [
    {
      id: 1,
      name: 'Alun-alun Purwakarta',
      location: 'Pusat Kota',
      video: '/sample/cctv1.mp4',
      status: 'online',
      kecamatan: 'Purwakarta'
    },
    {
      id: 2,
      name: 'Jl. Veteran',
      location: 'Dekat Kantor Bupati',
      video: '/sample/cctv2.mp4',
      status: 'online',
      kecamatan: 'Purwakarta'
    },
    {
      id: 3,
      name: 'Jl. Bungursari',
      location: 'Kawasan Perdagangan',
      video: '/sample/cctv1.mp4',
      status: 'online',
      kecamatan: 'Purwakarta'
    },
    {
      id: 4,
      name: 'Pasar Baru',
      location: 'Area Pasar',
      video: '/sample/cctv2.mp4',
      status: 'online',
      kecamatan: 'Purwakarta'
    },
    {
      id: 5,
      name: 'Terminal Purwakarta',
      location: 'Terminal Bus',
      video: '/sample/cctv1.mp4',
      status: 'online',
      kecamatan: 'Maniis'
    },
    {
      id: 6,
      name: 'Stasiun Purwakarta',
      location: 'Stasiun Kereta',
      video: '/sample/cctv1.mp4',
      status: 'online',
      kecamatan: 'Maniis'
    },
    {
      id: 7,
      name: 'Taman Sri Baduga',
      location: 'Taman Kota',
      video: '/sample/cctv1.mp4',
      status: 'online',
      kecamatan: 'Purwakarta'
    },
    {
      id: 8,
      name: 'Jl. Ipik Gandamanah',
      location: 'Jalan Utama',
      video: '/sample/cctv1.mp4',
      status: 'online',
      kecamatan: 'Purwakarta'
    }
  ];

  // Filter CCTV berdasarkan search dan dropdown
  const filteredCCTV = cctvData.filter(cctv => {
    const matchSearch = cctv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       cctv.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLocation = selectedLocation === '' || cctv.name === selectedLocation;
    return matchSearch && matchLocation;
  });

  const openModal = (cctv) => {
    setSelectedVideo(cctv);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#0A4D8C] to-[#009688] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-4">
            <Video className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-bold">Pengawasan CCTV Kota</h1>
          </div>
          <p className="text-xl text-white/90">
            Monitoring real-time keamanan dan aktivitas kota Purwakarta
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari lokasi CCTV..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A4D8C] focus:outline-none transition-colors"
              />
            </div>

            {/* Location Dropdown */}
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A4D8C] focus:outline-none transition-colors appearance-none bg-white"
              >
                <option value="">Semua Lokasi</option>
                {locations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">{filteredCCTV.length} CCTV Online</span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Kabupaten Purwakarta</span>
            </div>
          </div>
        </div>

        {/* CCTV Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCCTV.map((cctv) => (
            <div
              key={cctv.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Video Container */}
              <div className="relative aspect-video bg-black cursor-pointer" onClick={() => openModal(cctv)}>
                <video
                  src={cctv.video}
                  autoPlay
                  loop
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center">
                    <Maximize2 className="w-12 h-12 text-white mx-auto mb-2" />
                    <p className="text-white font-semibold">Klik untuk memperbesar</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4 flex items-center space-x-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>LIVE</span>
                </div>
              </div>

              {/* Card Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-[#0A4D8C] mb-1">
                      {cctv.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{cctv.location}</span>
                    </div>
                  </div>
                  <Video className="w-6 h-6 text-[#009688]" />
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Kec. {cctv.kecamatan}</span>
                  <button
                    onClick={() => openModal(cctv)}
                    className="text-[#0A4D8C] hover:text-[#009688] font-medium text-sm flex items-center space-x-1 transition-colors"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>Lihat Detail</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCCTV.length === 0 && (
          <div className="text-center py-12">
            <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Tidak ada CCTV ditemukan
            </h3>
            <p className="text-gray-500">
              Coba ubah kata kunci pencarian atau filter lokasi
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0A4D8C] to-[#009688] text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">{selectedVideo.name}</h2>
                <div className="flex items-center text-white/90">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{selectedVideo.location} - Kec. {selectedVideo.kecamatan}</span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Video */}
            <div className="relative aspect-video bg-black">
              <video
                src={selectedVideo.video}
                autoPlay
                loop
                muted
                controls
                className="w-full h-full"
              />
              
              {/* Live Badge */}
              <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-full font-medium shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span>LIVE STREAMING</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">Status: Online</span>
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Resolusi: </span>1080p HD
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="bg-[#0A4D8C] text-white px-6 py-2 rounded-lg hover:bg-[#083a6b] transition-colors font-medium"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
