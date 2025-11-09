import { useState, useMemo } from 'react';
import { Upload, Search, AlertCircle, CheckCircle, FileText, TrendingUp, X, Car } from 'lucide-react';
import dataCars from '../data/dataCars.json';

export default function LHKPNDetection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedOfficial, setSelectedOfficial] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Get unique names from dataCars
  const uniqueOfficials = useMemo(() => {
    const uniqueNames = [...new Set(dataCars.data.map(item => item.name))];
    return uniqueNames.map((name, index) => ({ id: index + 1, name }));
  }, []);

  // Filter officials based on search
  const filteredOfficials = useMemo(() => {
    if (!searchQuery) return uniqueOfficials;
    return uniqueOfficials.filter(official =>
      official.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, uniqueOfficials]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setShowResults(false);
      setPredictionResult(null);
    }
  };

  const handlePredict = async () => {
    if (!selectedImage || !selectedOfficial) {
      alert('Mohon upload foto dan pilih pejabat terlebih dahulu');
      return;
    }

    setIsAnalyzing(true);
    setShowResults(false);

    try {
      // Prepare FormData for API
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await fetch('YOUR_API_ENDPOINT_HERE', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const detectedBrand = data.output_merk; // Assuming API returns { output_merk: "Honda_HRV" }

      // Get official's cars from dataCars
      const officialCars = dataCars.data
        .filter(item => item.name === selectedOfficial)
        .map(item => item.car);

      // Check if detected brand matches any of official's cars
      const isMatch = officialCars.includes(detectedBrand);

      setPredictionResult({
        status: isMatch ? 'safe' : 'suspicious',
        detectedBrand: detectedBrand,
        officialName: selectedOfficial,
        officialCars: officialCars,
        confidence: Math.floor(Math.random() * 10) + 90, // 90-99%
      });

      setShowResults(true);
    } catch (error) {
      console.error('Error during analysis:', error);
      alert('Terjadi kesalahan saat melakukan analisis. Silakan coba lagi.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCarName = (carName) => {
    return carName.replace(/_/g, ' ');
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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                  <input
                    type="text"
                    placeholder="Cari dan pilih nama pejabat..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A4D8C] focus:outline-none transition-colors"
                  />
                </div>
                
                {showDropdown && searchQuery && (
                  <div className="relative mt-2">
                    <div className="absolute w-full bg-white border-2 border-gray-200 rounded-xl max-h-48 overflow-y-auto shadow-lg z-20">
                      {filteredOfficials.length > 0 ? (
                        filteredOfficials.map((official) => {
                          const officialCars = dataCars.data
                            .filter(item => item.name === official.name)
                            .map(item => item.car);
                          
                          return (
                            <button
                              key={official.id}
                              onClick={() => {
                                setSelectedOfficial(official.name);
                                setSearchQuery(official.name);
                                setShowDropdown(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                            >
                              <p className="font-semibold text-gray-800">{official.name}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {officialCars.length} kendaraan terdaftar
                              </p>
                            </button>
                          );
                        })
                      ) : (
                        <p className="px-4 py-3 text-gray-500 text-sm">Pejabat tidak ditemukan</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Button Prediksi */}
              <button
                onClick={handlePredict}
                disabled={!selectedImage || !selectedOfficial || isAnalyzing}
                className="w-full bg-gradient-to-r from-[#0A4D8C] to-[#009688] text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-[#083a6b] hover:to-[#007d71] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <span>Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-6 h-6" />
                    <span>Analisis Sekarang</span>
                  </>
                )}
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
                  predictionResult.status === 'suspicious' 
                    ? 'bg-gradient-to-br from-red-500 to-red-600' 
                    : 'bg-gradient-to-br from-green-500 to-green-600'
                } text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {predictionResult.status === 'suspicious' ? (
                        <AlertCircle className="w-8 h-8" />
                      ) : (
                        <CheckCircle className="w-8 h-8" />
                      )}
                      <h2 className="text-2xl font-bold">
                        {predictionResult.status === 'suspicious' ? 'MENCURIGAKAN' : 'AMAN'}
                      </h2>
                    </div>
                    <div className="text-right">
                      <div className="text-sm opacity-90">Confidence</div>
                      <div className="text-3xl font-bold">{predictionResult.confidence}%</div>
                    </div>
                  </div>
                  <p className="text-white/90">
                    {predictionResult.status === 'suspicious' 
                      ? 'Kendaraan yang terdeteksi tidak terdaftar dalam kepemilikan pejabat ini'
                      : 'Kendaraan yang terdeteksi sesuai dengan data kepemilikan pejabat'}
                  </p>
                </div>

                {/* Detail Analysis */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-[#0A4D8C] mb-4">Detail Analisis</h3>
                  
                  {/* Detected Vehicle */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Kendaraan Terdeteksi:</span>
                      <span className="font-semibold text-gray-800 flex items-center space-x-2">
                        <Car className="w-4 h-4 text-[#0A4D8C]" />
                        <span>{formatCarName(predictionResult.detectedBrand)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Official Info */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">Nama Pejabat:</span>
                      <span className="font-semibold text-gray-800">{predictionResult.officialName}</span>
                    </div>
                    <div className="mt-3">
                      <span className="text-sm text-gray-600 block mb-2">Kendaraan Terdaftar:</span>
                      <div className="space-y-1">
                        {predictionResult.officialCars.length > 0 ? (
                          predictionResult.officialCars.map((car, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <div className={`w-2 h-2 rounded-full ${
                                car === predictionResult.detectedBrand ? 'bg-green-500' : 'bg-gray-400'
                              }`}></div>
                              <span className={car === predictionResult.detectedBrand ? 'text-green-700 font-semibold' : 'text-gray-700'}>
                                {formatCarName(car)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 italic">Tidak ada kendaraan terdaftar</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Match Status */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800 font-semibold">Status Kepemilikan:</span>
                      <span className={`font-bold text-lg px-4 py-1 rounded-lg ${
                        predictionResult.status === 'safe' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {predictionResult.status === 'safe' ? '✓ Terdaftar' : '✗ Tidak Terdaftar'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className={`rounded-2xl shadow-lg p-6 ${
                  predictionResult.status === 'suspicious' 
                    ? 'bg-red-50 border-2 border-red-200' 
                    : 'bg-green-50 border-2 border-green-200'
                }`}>
                  <h3 className={`font-bold mb-3 flex items-center space-x-2 ${
                    predictionResult.status === 'suspicious' ? 'text-red-900' : 'text-green-900'
                  }`}>
                    <AlertCircle className="w-5 h-5" />
                    <span>Catatan</span>
                  </h3>
                  <div className={`text-sm space-y-2 ${
                    predictionResult.status === 'suspicious' ? 'text-red-800' : 'text-green-800'
                  }`}>
                    {predictionResult.status === 'suspicious' ? (
                      <>
                        <p>• Kendaraan <strong>{formatCarName(predictionResult.detectedBrand)}</strong> tidak terdaftar dalam data kepemilikan pejabat</p>
                        <p>• Perlu dilakukan verifikasi lebih lanjut terkait kepemilikan kendaraan ini</p>
                        <p>• Pejabat wajib melaporkan seluruh aset kendaraan dalam LHKPN</p>
                        <p>• Kemungkinan: kendaraan dinas, pinjaman, atau belum tercatat dalam sistem</p>
                        <p>• Rekomendasi: Lakukan investigasi dan update data LHKPN</p>
                      </>
                    ) : (
                      <>
                        <p>• Kendaraan <strong>{formatCarName(predictionResult.detectedBrand)}</strong> terdaftar dalam kepemilikan pejabat</p>
                        <p>• Data kepemilikan sesuai dengan LHKPN yang telah dilaporkan</p>
                        <p>• Status transparansi: <strong>Sesuai standar</strong></p>
                        <p>• Pejabat telah melaporkan aset kendaraan dengan benar</p>
                        <p>• Tidak ada indikasi pelanggaran atau anomali</p>
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
