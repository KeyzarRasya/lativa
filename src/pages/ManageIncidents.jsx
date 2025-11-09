import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Edit, 
  MapPin, 
  Clock,
  Search,
  Filter
} from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';
import { useAuth } from '../contexts/AuthContext';
import { getIncidents, subscribeToIncidents, formatIncidentForMap } from '../services/incidentService';
import Swal from 'sweetalert2';

export default function ManageIncidents() {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterZone, setFilterZone] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && !isAdmin) {
      navigate('/login');
      return;
    }

    // Fetch incidents
    const fetchIncidents = async () => {
      try {
        const data = await getIncidents({ limitCount: 1000 });
        const formatted = data.map(formatIncidentForMap);
        setIncidents(formatted);
        setFilteredIncidents(formatted);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching incidents:', error);
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchIncidents();

      // Subscribe to real-time updates
      const unsubscribe = subscribeToIncidents((data) => {
        const formatted = data.map(formatIncidentForMap);
        setIncidents(formatted);
        applyFilters(formatted, searchQuery, filterStatus, filterZone);
      }, { limitCount: 1000 });

      return () => unsubscribe();
    }
  }, [isAdmin, authLoading, navigate]);

  // Apply filters
  const applyFilters = (data, search, status, zone) => {
    let filtered = data;

    // Search filter
    if (search) {
      filtered = filtered.filter(incident =>
        incident.description.toLowerCase().includes(search.toLowerCase()) ||
        incident.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (status !== 'all') {
      filtered = filtered.filter(incident => incident.status === status);
    }

    // Zone filter
    if (zone !== 'all') {
      filtered = filtered.filter(incident => (incident.zone || 'yellow') === zone);
    }

    setFilteredIncidents(filtered);
  };

  useEffect(() => {
    applyFilters(incidents, searchQuery, filterStatus, filterZone);
  }, [searchQuery, filterStatus, filterZone, incidents]);

  const handleEditIncident = (incident) => {
    setSelectedIncident(incident);
    setShowModal(true);
  };

  if (authLoading || loading) {
    return (
      <>
        <AdminNavbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0A4D8C] mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data laporan...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Manage Laporan Incident
            </h1>
            <p className="text-gray-600">
              Kelola status dan zona semua laporan incident
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari lokasi atau deskripsi..."
                  className="block w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#0A4D8C] focus:outline-none transition-colors"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#0A4D8C] focus:outline-none transition-colors appearance-none bg-white"
                >
                  <option value="all">Semua Status</option>
                  <option value="unverified">Unverified</option>
                  <option value="verified">Verified</option>
                  <option value="handled">Ditangani</option>
                  <option value="resolved">Selesai</option>
                </select>
              </div>

              {/* Zone Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={filterZone}
                  onChange={(e) => setFilterZone(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#0A4D8C] focus:outline-none transition-colors appearance-none bg-white"
                >
                  <option value="all">Semua Zona</option>
                  <option value="green">Green Zone</option>
                  <option value="yellow">Yellow Zone</option>
                  <option value="red">Red Zone</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Menampilkan <strong>{filteredIncidents.length}</strong> dari <strong>{incidents.length}</strong> laporan
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lokasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deskripsi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Zone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIncidents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        Tidak ada data laporan
                      </td>
                    </tr>
                  ) : (
                    filteredIncidents.map((incident, idx) => (
                      <tr key={incident.id || idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{incident.location}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900 line-clamp-2 max-w-md">
                            {incident.description}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            incident.status === 'resolved'
                              ? 'bg-green-100 text-green-800'
                              : incident.status === 'handled'
                              ? 'bg-orange-100 text-orange-800'
                              : incident.status === 'verified'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {incident.status === 'unverified' ? 'Unverified' : 
                             incident.status === 'verified' ? 'Verified' :
                             incident.status === 'handled' ? 'Ditangani' : 'Selesai'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            (incident.zone || 'yellow') === 'green'
                              ? 'bg-green-100 text-green-800'
                              : (incident.zone || 'yellow') === 'red'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {(incident.zone || 'yellow').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{incident.time}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleEditIncident(incident)}
                            className="bg-[#0A4D8C] hover:bg-[#083a6b] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Manage</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {showModal && selectedIncident && (
        <UpdateIncidentModal
          incident={selectedIncident}
          onClose={() => {
            setShowModal(false);
            setSelectedIncident(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setSelectedIncident(null);
          }}
        />
      )}
    </>
  );
}

// Update Incident Modal Component
function UpdateIncidentModal({ incident, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    status: incident.status || 'unverified',
    zone: incident.zone || 'yellow'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { updateIncidentStatus, updateIncident } = await import('../services/incidentService');
      
      // Update status
      await updateIncidentStatus(incident.id, formData.status);
      
      // Update zone (independent from status)
      await updateIncident(incident.id, {
        zone: formData.zone
      });

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Status dan zona laporan berhasil diupdate',
        confirmButtonColor: '#0A4D8C',
        timer: 2000,
        timerProgressBar: true
      });

      onSuccess();
    } catch (error) {
      console.error('Error updating incident:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: error.message || 'Gagal mengupdate laporan',
        confirmButtonColor: '#0A4D8C'
      });
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0A4D8C] to-[#009688] text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold">Update Laporan</h2>
          <p className="text-white/80 text-sm mt-1">Ubah status dan zona laporan</p>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Incident Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Lokasi:</p>
            <p className="text-gray-900">{incident.location}</p>
            <p className="text-sm font-semibold text-gray-700 mt-3 mb-2">Deskripsi:</p>
            <p className="text-gray-900 text-sm">{incident.description}</p>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Update Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'unverified', label: 'Unverified', color: 'yellow' },
                { value: 'verified', label: 'Verified', color: 'blue' },
                { value: 'handled', label: 'Ditangani', color: 'orange' },
                { value: 'resolved', label: 'Selesai', color: 'green' }
              ].map((status) => (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: status.value }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.status === status.value
                      ? `border-${status.color}-500 bg-${status.color}-50`
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    status.color === 'yellow' ? 'bg-yellow-500 text-white' :
                    status.color === 'blue' ? 'bg-blue-500 text-white' :
                    status.color === 'orange' ? 'bg-orange-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {status.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Zone Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Update Zona
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'green', label: 'Green', desc: 'Aman' },
                { value: 'yellow', label: 'Yellow', desc: 'Hati-hati' },
                { value: 'red', label: 'Red', desc: 'Berbahaya' }
              ].map((zone) => (
                <button
                  key={zone.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, zone: zone.value }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.zone === zone.value
                      ? `border-${zone.value}-500 bg-${zone.value}-50`
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full bg-${zone.value}-500 mx-auto mb-2`}></div>
                  <p className="text-sm font-semibold text-gray-800">{zone.label}</p>
                  <p className="text-xs text-gray-600">{zone.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-[#0A4D8C] to-[#009688] text-white rounded-xl font-semibold hover:from-[#083a6b] hover:to-[#007d71] transition-all duration-300 shadow-lg disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Perubahan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
