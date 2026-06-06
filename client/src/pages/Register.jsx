import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerAPI } from '../utils/api';
import { User, Mail, Lock, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' });
  const [loading, setLoading] = useState(false);
  const { loginUser, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerAPI(form);
      loginUser(data);
      toast.success('Account created successfully!');
      navigate(getDashboardPath(data.role));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 mb-4 shadow-lg shadow-primary-500/25">
            <Sparkles className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Create Account</h1>
          <p className="text-dark-400">Join FWC HRMS</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Enter your name" required className="w-full bg-dark-800/60 border border-dark-600/50 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-dark-400 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="Enter your email" required className="w-full bg-dark-800/60 border border-dark-600/50 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-dark-400 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                <input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder="Min 6 characters" required minLength={6} className="w-full bg-dark-800/60 border border-dark-600/50 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-dark-400 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Role</label>
              <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="w-full bg-dark-800/60 border border-dark-600/50 rounded-xl px-4 py-3 text-white text-sm transition-all">
                <option value="employee">Employee</option>
                <option value="hr_recruiter">HR Recruiter</option>
                <option value="senior_manager">Senior Manager</option>
                <option value="admin">Management Admin</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/25 disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">Already have an account? Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
