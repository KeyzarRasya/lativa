import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { login } from '../services/authService';
import Swal from 'sweetalert2';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(formData.email, formData.password);
      
      await Swal.fire({
        icon: 'success',
        title: 'Login Berhasil!',
        html: `<p class="text-gray-600">Selamat datang kembali, <strong>${userData.fullName}</strong>!</p>`,
        confirmButtonColor: '#0A4D8C',
        timer: 2000,
        timerProgressBar: true
      });

      // Redirect based on role
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Gagal login. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A4D8C] via-[#009688] to-[#0A4D8C] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <LogIn className="w-10 h-10 text-[#0A4D8C]" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Lativa Admin
          </h2>
          <p className="text-white/80">
            Masuk ke dashboard admin
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A4D8C] focus:outline-none transition-colors"
                  placeholder="admin@lativa.id"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A4D8C] focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#0A4D8C] to-[#009688] text-white py-3 rounded-xl font-bold hover:from-[#083a6b] hover:to-[#007d71] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Masuk</span>
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link
                to="/signup"
                className="font-semibold text-[#0A4D8C] hover:text-[#009688] transition-colors"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Kembali ke beranda
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-white/60">
            © 2024 Lativa. Platform Anti-Korupsi & Transparansi
          </p>
        </div>
      </div>
    </div>
  );
}
