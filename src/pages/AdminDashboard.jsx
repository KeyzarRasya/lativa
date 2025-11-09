import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  MapPin,
  Shield
} from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';
import { useAuth } from '../contexts/AuthContext';
import { getIncidentStats, getIncidents } from '../services/incidentService';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    unverified: 0,
    verified: 0,
    handled: 0,
    resolved: 0,
    greenZone: 0,
    yellowZone: 0,
    redZone: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && !isAdmin) {
      navigate('/login');
      return;
    }

    // Fetch stats
    const fetchStats = async () => {
      try {
        const incidents = await getIncidents({ limitCount: 1000 });
        
        const statsData = {
          total: incidents.length,
          unverified: incidents.filter(i => i.status === 'unverified').length,
          verified: incidents.filter(i => i.status === 'verified').length,
          handled: incidents.filter(i => i.status === 'handled').length,
          resolved: incidents.filter(i => i.status === 'resolved').length,
          greenZone: incidents.filter(i => (i.zone || 'yellow') === 'green').length,
          yellowZone: incidents.filter(i => (i.zone || 'yellow') === 'yellow').length,
          redZone: incidents.filter(i => (i.zone || 'yellow') === 'red').length
        };

        setStats(statsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <>
        <AdminNavbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0A4D8C] mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat dashboard...</p>
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
              Dashboard Admin
            </h1>
            <p className="text-gray-600">
              Kelola dan monitor laporan incident secara real-time
            </p>
          </div>

          {/* Stats Overview - Status */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-[#0A4D8C]" />
              Status Laporan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Total */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Laporan</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Unverified */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Unverified</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.unverified}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              {/* Verified */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Verified</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.verified}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Handled */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Ditangani</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.handled}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Resolved */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Selesai</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.resolved}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview - Zones */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-[#0A4D8C]" />
              Zona Bahaya
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Green Zone */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Green Zone</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.greenZone}</p>
                    <p className="text-xs text-gray-500 mt-1">Area Aman</p>
                  </div>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-10 h-10 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Yellow Zone */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Yellow Zone</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.yellowZone}</p>
                    <p className="text-xs text-gray-500 mt-1">Perlu Perhatian</p>
                  </div>
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Red Zone */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Red Zone</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.redZone}</p>
                    <p className="text-xs text-gray-500 mt-1">Prioritas Tinggi</p>
                  </div>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <div className="w-10 h-10 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Menu Admin
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/admin/incidents')}
                className="bg-gradient-to-r from-[#0A4D8C] to-[#009688] text-white p-6 rounded-xl hover:from-[#083a6b] hover:to-[#007d71] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-4"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold">Manage Laporan</h3>
                  <p className="text-sm text-white/80">Kelola semua laporan incident</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-4"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold">Dashboard Publik</h3>
                  <p className="text-sm text-white/80">Lihat dashboard publik</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
