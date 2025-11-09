import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, LogOut, Shield, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { logout, getCurrentUser } from '../services/authService';
import Swal from 'sweetalert2';

export default function Account() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch user details
    const fetchUserDetails = async () => {
      try {
        const userData = await getCurrentUser();
        setUserDetails(userData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserDetails();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Apakah Anda yakin ingin keluar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Logout',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await logout();
        
        await Swal.fire({
          icon: 'success',
          title: 'Logout Berhasil',
          text: 'Anda telah keluar dari sistem',
          confirmButtonColor: '#0A4D8C',
          timer: 2000,
          timerProgressBar: true
        });

        navigate('/login');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Logout',
          text: error.message || 'Terjadi kesalahan saat logout',
          confirmButtonColor: '#0A4D8C'
        });
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F7FA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0A4D8C] mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data akun...</p>
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F7FA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Data akun tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 pt-40 bg-gradient-to-b from-white to-[#F5F7FA] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A4D8C] mb-4">
            Akun Saya
          </h1>
          <p className="text-xl text-gray-600">
            Kelola informasi akun dan pengaturan Anda
          </p>
        </div>

        {/* Profile Card */}
        <div className="glass-card rounded-3xl shadow-2xl p-8 border-2 border-white/50 mb-8">
          {/* Profile Header */}
          <div className="flex items-center space-x-6 mb-8 pb-8 border-b-2 border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-[#0A4D8C] to-[#009688] rounded-full flex items-center justify-center shadow-lg">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-1">
                {userDetails.fullName}
              </h2>
              <p className="text-gray-600 mb-2">@{userDetails.username}</p>
              <div className="flex items-center space-x-2">
                <Shield className={`w-4 h-4 ${
                  userDetails.role === 'admin' ? 'text-purple-600' : 'text-blue-600'
                }`} />
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  userDetails.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {userDetails.role === 'admin' ? 'Administrator' : 'User'}
                </span>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Informasi Akun
            </h3>

            {/* Email */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-start space-x-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Mail className="w-5 h-5 text-[#0A4D8C]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 mb-1">Email</p>
                <p className="text-lg text-gray-800">{userDetails.email}</p>
                {userDetails.emailVerified ? (
                  <p className="text-xs text-green-600 mt-1">✓ Email terverifikasi</p>
                ) : (
                  <p className="text-xs text-yellow-600 mt-1">⚠ Email belum terverifikasi</p>
                )}
              </div>
            </div>

            {/* Username */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-start space-x-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-[#0A4D8C]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 mb-1">Username</p>
                <p className="text-lg text-gray-800">@{userDetails.username}</p>
              </div>
            </div>

            {/* Role */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-start space-x-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Shield className="w-5 h-5 text-[#0A4D8C]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 mb-1">Role</p>
                <p className="text-lg text-gray-800">
                  {userDetails.role === 'admin' ? 'Administrator' : 'User'}
                </p>
              </div>
            </div>

            {/* Account ID */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-start space-x-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Calendar className="w-5 h-5 text-[#0A4D8C]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 mb-1">User ID</p>
                <p className="text-sm text-gray-600 font-mono break-all">{userDetails.uid}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:border-[#0A4D8C] hover:text-[#0A4D8C] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            ← Kembali ke Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-blue-900 mb-1">Tips Keamanan</h4>
              <p className="text-sm text-blue-700">
                Jangan bagikan password Anda kepada siapa pun. Pastikan selalu logout setelah selesai menggunakan sistem, terutama di komputer bersama.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
