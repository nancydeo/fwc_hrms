import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Users, CalendarCheck, TrendingUp, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(res => { setStats(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-96"><div className="spinner" /></div>;

  const deptData = stats?.deptStats?.map(d => ({ name: d.name, employees: d.count })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Manager Dashboard 📊</h1>
        <p className="text-dark-400 mt-1">Team performance & department overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Team Members', value: stats?.totalEmployees || 0, color: 'bg-primary-500' },
          { icon: CalendarCheck, label: 'Present Today', value: stats?.presentToday || 0, color: 'bg-success-500' },
          { icon: TrendingUp, label: 'Attendance Rate', value: `${stats?.attendanceRate || 0}%`, color: 'bg-accent-500' },
          { icon: Target, label: 'Departments', value: stats?.totalDepartments || 0, color: 'bg-warning-500' },
        ].map((s, i) => (
          <div key={i} className="stat-card card-hover animate-fadeIn" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-dark-400 mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-white">{s.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${s.color}`}><s.icon size={20} className="text-white" /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Department Size</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={deptData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b' }} />
            <Bar dataKey="employees" fill="#0f5fc2" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ManagerDashboard;
