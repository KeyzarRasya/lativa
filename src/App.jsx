import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Integration from './pages/Integration';
import Dashboard from './pages/Dashboard';
import Transparency from './pages/Transparency';
import Impact from './pages/Impact';
import Testimonials from './pages/Testimonials';
import CTA from './pages/CTA';
import CCTVMonitoring from './pages/CCTVMonitoring';
import LHKPNDetection from './pages/LHKPNDetection';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Account from './pages/Account';
import AdminDashboard from './pages/AdminDashboard';
import ManageIncidents from './pages/ManageIncidents';

// Component wrapper untuk conditional rendering
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-white">
      {!isAdminRoute && !isAuthRoute && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/integration" element={<Integration />} />
        <Route path="/transparency" element={<Transparency />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/cta" element={<CTA />} />
        <Route path="/cctv-monitoring" element={<CCTVMonitoring />} />
        <Route path="/lhkpn-detection" element={<LHKPNDetection />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route 
          path="/account" 
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Only Routes - Without Footer */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/incidents" 
          element={
            <ProtectedRoute adminOnly>
              <ManageIncidents />
            </ProtectedRoute>
          } 
        />
      </Routes>
      {!isAdminRoute && !isAuthRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
