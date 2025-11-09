import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../services/authService';
import Swal from 'sweetalert2';

export default function AdminNavbar() {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  return (
    <nav className="bg-gradient-to-r from-[#0A4D8C] to-[#009688] shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to="/admin/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-[#0A4D8C]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">LATIVA Admin</h1>
              <p className="text-xs text-white/80">Dashboard Management</p>
            </div>
          </Link>

          {/* Menu Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/admin/dashboard" 
              className="text-white/90 hover:text-white font-medium transition-colors flex items-center space-x-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/admin/incidents" 
              className="text-white/90 hover:text-white font-medium transition-colors flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Manage Laporan</span>
            </Link>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-white">
                {user?.fullName || 'Admin'}
              </p>
              <p className="text-xs text-white/70">
                @{user?.username || 'admin'}
              </p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User className="w-5 h-5 text-white" />
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
