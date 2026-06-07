import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ManagerDashboard from './pages/dashboard/ManagerDashboard';
import HRDashboard from './pages/dashboard/HRDashboard';
import EmployeeDashboard from './pages/dashboard/EmployeeDashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Payroll from './pages/Payroll';
import Departments from './pages/Departments';
import Recruitment from './pages/Recruitment';
import Performance from './pages/Performance';
import AIHub from './pages/AIHub';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Protected Route
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-dark-950"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={`/dashboard/${user.role === 'admin' ? 'admin' : user.role === 'senior_manager' ? 'manager' : user.role === 'hr_recruiter' ? 'hr' : 'employee'}`} replace />;
  return children;
};

// Public Route (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading, getDashboardPath } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-dark-950"><div className="spinner" /></div>;
  if (user) return <Navigate to={getDashboardPath(user.role)} replace />;
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#ffffff', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '12px' },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Dashboard routes */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/manager" element={<ProtectedRoute roles={['senior_manager']}><ManagerDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/hr" element={<ProtectedRoute roles={['hr_recruiter']}><HRDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/employee" element={<ProtectedRoute roles={['employee']}><EmployeeDashboard /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute roles={['admin', 'senior_manager', 'hr_recruiter']}><Employees /></ProtectedRoute>} />
            <Route path="/departments" element={<ProtectedRoute roles={['admin', 'senior_manager']}><Departments /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
            <Route path="/leave" element={<ProtectedRoute><Leave /></ProtectedRoute>} />
            <Route path="/payroll" element={<ProtectedRoute roles={['admin', 'hr_recruiter', 'employee']}><Payroll /></ProtectedRoute>} />
            <Route path="/recruitment" element={<ProtectedRoute roles={['admin', 'hr_recruiter']}><Recruitment /></ProtectedRoute>} />
            <Route path="/performance" element={<ProtectedRoute><Performance /></ProtectedRoute>} />
            <Route path="/ai" element={<ProtectedRoute roles={['admin', 'senior_manager', 'hr_recruiter']}><AIHub /></ProtectedRoute>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
