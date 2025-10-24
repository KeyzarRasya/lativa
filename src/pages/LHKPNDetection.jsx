import { useState } from 'react';
import { Upload, Search, AlertCircle, CheckCircle, FileText, DollarSign, TrendingUp, X } from 'lucide-react';

export default function LHKPNDetection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedOfficial, setSelectedOfficial] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  // Data dummy pejabat
  const officials = [
    { 
      id: 1, 
      name: 'Budi Santoso', 
      position: 'Kepala Dinas Pendidikan',
      salary: 'Rp 8.000.000 - Rp 12.000.000',
      salaryRange: [8000000, 12000000]
    },
    { 
      id: 2, 
      name: 'Siti Nurhaliza', 
      position: 'Camat Purwakarta',
      salary: 'Rp 6.500.000 - Rp 10.000.000',
      salaryRange: [6500000, 10000000]
    },
    { 
      id: 3, 
      name: 'Ahmad Dahlan', 
      position: 'Kepala Dinas Kesehatan',
      salary: 'Rp 9.000.000 - Rp 13.000.000',
      salaryRange: [9000000, 13000000]
    },
    { 
      id: 4, 
      name: 'Rina Wijaya', 
      position: 'Sekretaris Daerah',
      salary: 'Rp 12.000.000 - Rp 18.000.000',
      salaryRange: [12000000, 18000000]
    },
    { 
      id: 5, 
      name: 'Hendra Gunawan', 
      position: 'Kepala BPKAD',
      salary: 'Rp 10.000.000 - Rp 15.000.000',
      salaryRange: [10000000, 15000000]
    },
    { 
      id: 6, 
      name: 'Dewi Kartika', 
      position: 'Kepala Dinas Sosial',
      salary: 'Rp 7.000.000 - Rp 11.000.000',
      salaryRange: [7000000, 11000000]
    },
  ];

  // Data dummy hasil deteksi untuk berbagai jenis barang
  const itemDatabase = [
    { name: 'Mobil Sedan Mewah', priceRange: [800000000, 1500000000], category: 'Kendaraan' },
    { name: 'Motor Sport', priceRange: [150000000, 400000000], category: 'Kendaraan' },
    { name: 'Jam Tangan Mewah', priceRange: [50000000, 500000000], category: 'Aksesoris' },
    { name: 'Tas Branded', priceRange: [30000000, 200000000], category: 'Fashion' },
    { name: 'Smartphone Premium', priceRange: [15000000, 30000000], category: 'Elektronik' },
    { name: 'Laptop Gaming', priceRange: [25000000, 60000000], category: 'Elektronik' },
    { name: 'Sepeda Motor Biasa', priceRange: [15000000, 35000000], category: 'Kendaraan' },
  ];

  const filteredOfficials = officials.filter(official =>
    official.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    official.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePredict = () => {
    if (!selectedImage || !selectedOfficial) {
      alert('Mohon upload foto dan pilih pejabat terlebih dahulu');
      return;
    }

    // Simulasi AI prediction
    const randomItem = itemDatabase[Math.floor(Math.random() * itemDatabase.length)];
    const official = officials.find(o => o.id === parseInt(selectedOfficial));
    
    const itemMaxPrice = randomItem.priceRange[1];
    const officialMaxSalary = official.salaryRange[1];
    
    // Hitung berapa bulan gaji untuk beli barang
    const monthsNeeded = Math.ceil(itemMaxPrice / officialMaxSalary);
    
    // Anomali jika perlu lebih dari 24 bulan gaji (2 tahun)
    const isAnomaly = monthsNeeded > 24;

    setPredictionResult({
      status: isAnomaly ? 'anomaly' : 'normal',
      item: randomItem,
      official: official,
      monthsNeeded: monthsNeeded,
      confidence: Math.floor(Math.random() * 15) + 85, // 85-99%
    });

    setShowResults(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A4D8C] to-[#009688] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-bold">Deteksi LHKPN</h1>
          </div>
          <p className="text-xl text-white/90">
            Sistem AI untuk mendeteksi kewajaran kepemilikan harta berdasarkan gaji pejabat
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#0A4D8C] mb-6">Input Data</h2>
              
              {/* Upload Foto */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Upload Foto Barang <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#0A4D8C] transition-colors">
                  {!imagePreview ? (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">Klik untuk upload foto</p>
                      <p className="text-xs text-gray-500">Format: JPG, PNG (Max 5MB)</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-block mt-3 bg-[#0A4D8C] text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-[#083a6b] transition-colors"
                      >
                        Pilih Foto
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                          setShowResults(false);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Pilih Pejabat */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nama Pejabat <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari nama pejabat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A4D8C] focus:outline-none transition-colors"
                  />
                </div>
                
                {searchQuery && (
                  <div className="mt-2 bg-white border-2 border-gray-200 rounded-xl max-h-48 overflow-y-auto shadow-lg">
                    {filteredOfficials.length > 0 ? (
                      filteredOfficials.map((official) => (
                        <button
                          key={official.id}
                          onClick={() => {
                            setSelectedOfficial(official.id.toString());
                            setSearchQuery(official.name);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                        >
                          <p className="font-semibold text-gray-800">{official.name}</p>
                          <p className="text-xs text-gray-500">{official.position}</p>
                          <p className="text-xs text-[#009688] mt-1">{official.salary}</p>
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-3 text-gray-500 text-sm">Pejabat tidak ditemukan</p>
                    )}
                  </div>
                )}
              </div>

              {/* Button Prediksi */}
              <button
                onClick={handlePredict}
                disabled={!selectedImage || !selectedOfficial}
                className="w-full bg-gradient-to-r from-[#0A4D8C] to-[#009688] text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-[#083a6b] hover:to-[#007d71] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <TrendingUp className="w-6 h-6" />
                <span>Analisis Sekarang</span>
              </button>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Informasi</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Upload foto barang yang akan dianalisis</li>
                    <li>• Pilih nama pejabat yang memiliki barang tersebut</li>
                    <li>• Sistem AI akan menganalisis kewajaran kepemilikan</li>
                    <li>• Hasil akan menunjukkan status Normal atau Anomali</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            {!showResults ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">Belum Ada Hasil</h3>
                <p className="text-gray-500">Upload foto dan pilih pejabat untuk memulai analisis</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Status Result */}
                <div className={`rounded-2xl shadow-lg p-6 ${
                  predictionResult.status === 'anomaly' 
                    ? 'bg-gradient-to-br from-red-500 to-red-600' 
                    : 'bg-gradient-to-br from-green-500 to-green-600'
                } text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {predictionResult.status === 'anomaly' ? (
                        <AlertCircle className="w-8 h-8" />
                      ) : (
                        <CheckCircle className="w-8 h-8" />
                      )}
                      <h2 className="text-2xl font-bold">
                        {predictionResult.status === 'anomaly' ? 'ANOMALI TERDETEKSI' : 'STATUS NORMAL'}
                      </h2>
                    </div>
                    <div className="text-right">
                      <div className="text-sm opacity-90">Confidence</div>
                      <div className="text-3xl font-bold">{predictionResult.confidence}%</div>
                    </div>
                  </div>
                  <p className="text-white/90">
                    {predictionResult.status === 'anomaly' 
                      ? 'Kepemilikan barang tidak wajar berdasarkan pendapatan yang dilaporkan'
                      : 'Kepemilikan barang masih dalam batas kewajaran berdasarkan pendapatan'}
                  </p>
                </div>

                {/* Detail Analysis */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-[#0A4D8C] mb-4">Detail Analisis</h3>
                  
                  {/* Detected Item */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Barang Terdeteksi:</span>
                      <span className="font-semibold text-gray-800">{predictionResult.item.name}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Kategori:</span>
                      <span className="font-semibold text-gray-800">{predictionResult.item.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Range Harga:</span>
                      <span className="font-semibold text-[#0A4D8C]">
                        {formatCurrency(predictionResult.item.priceRange[0])} - {formatCurrency(predictionResult.item.priceRange[1])}
                      </span>
                    </div>
                  </div>

                  {/* Official Info */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Nama Pejabat:</span>
                      <span className="font-semibold text-gray-800">{predictionResult.official.name}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Jabatan:</span>
                      <span className="font-semibold text-gray-800">{predictionResult.official.position}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Range Gaji:</span>
                      <span className="font-semibold text-[#009688]">{predictionResult.official.salary}</span>
                    </div>
                  </div>

                  {/* Calculation */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <DollarSign className="w-5 h-5 text-[#0A4D8C]" />
                      <h4 className="font-bold text-gray-800">Perhitungan Kewajaran</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Harga Maksimal Barang:</span>
                        <span className="font-semibold">{formatCurrency(predictionResult.item.priceRange[1])}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Gaji Maksimal/Bulan:</span>
                        <span className="font-semibold">{formatCurrency(predictionResult.official.salaryRange[1])}</span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-gray-300">
                        <div className="flex justify-between">
                          <span className="text-gray-800 font-semibold">Butuh Waktu:</span>
                          <span className={`font-bold text-lg ${
                            predictionResult.monthsNeeded > 24 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {predictionResult.monthsNeeded} Bulan Gaji
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className={`rounded-2xl shadow-lg p-6 ${
                  predictionResult.status === 'anomaly' 
                    ? 'bg-red-50 border-2 border-red-200' 
                    : 'bg-green-50 border-2 border-green-200'
                }`}>
                  <h3 className={`font-bold mb-3 flex items-center space-x-2 ${
                    predictionResult.status === 'anomaly' ? 'text-red-900' : 'text-green-900'
                  }`}>
                    <AlertCircle className="w-5 h-5" />
                    <span>Catatan</span>
                  </h3>
                  <div className={`text-sm space-y-2 ${
                    predictionResult.status === 'anomaly' ? 'text-red-800' : 'text-green-800'
                  }`}>
                    {predictionResult.status === 'anomaly' ? (
                      <>
                        <p>• Barang yang dimiliki memerlukan <strong>{predictionResult.monthsNeeded} bulan gaji</strong> untuk membelinya</p>
                        <p>• Standar kewajaran maksimal adalah 24 bulan (2 tahun) gaji</p>
                        <p>• Perlu dilakukan investigasi lebih lanjut tentang sumber pendapatan lain</p>
                        <p>• Pejabat wajib melaporkan aset dan sumber pendapatan dalam LHKPN</p>
                      </>
                    ) : (
                      <>
                        <p>• Barang yang dimiliki hanya memerlukan <strong>{predictionResult.monthsNeeded} bulan gaji</strong></p>
                        <p>• Masih dalam batas kewajaran (maksimal 24 bulan gaji)</p>
                        <p>• Kepemilikan sesuai dengan kapasitas pendapatan yang dilaporkan</p>
                        <p>• Status LHKPN: Sesuai standar transparansi</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
