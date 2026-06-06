import { useState, useEffect } from 'react';
import { getDashboardStats, getRecentActivities } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Users, CalendarCheck, Briefcase, CalendarOff, Building2, TrendingUp, Wallet, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

const StatCard = ({ icon: Icon, label, value, sub, color, delay }) => (
  <div className="stat-card card-hover animate-fadeIn" style={{ animationDelay: `${delay}ms` }}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-dark-400 mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {sub && <p className="text-xs text-dark-400 mt-1">{sub}</p>}
      </div>
      <div className={`p-2.5 rounded-xl ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  </div>
);

const COLORS = ['#0f5fc2', '#0ea5e9', '#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#f97316', '#06b6d4'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([getDashboardStats(), getRecentActivities()]);
        setStats(statsRes.data);
        setActivities(activitiesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="spinner" />
    </div>
  );

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const attendanceTrend = stats?.attendanceTrend?.map(t => ({
    name: monthNames[t._id.month - 1],
    present: t.present,
    absent: t.absent
  })) || [];

  const deptData = stats?.deptStats?.map(d => ({ name: d.name, value: d.count })) || [];
  const roleData = stats?.roleDistribution?.map(r => ({
    name: r._id === 'admin' ? 'Admin' : r._id === 'senior_manager' ? 'Managers' : r._id === 'hr_recruiter' ? 'HR' : 'Employees',
    value: r.count
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-dark-400 mt-1">Here's what's happening at FWC today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Employees" value={stats?.totalEmployees || 0} sub="Active employees" color="bg-primary-500" delay={0} />
        <StatCard icon={CalendarCheck} label="Present Today" value={stats?.presentToday || 0} sub={`${stats?.attendanceRate}% attendance`} color="bg-success-500" delay={100} />
        <StatCard icon={CalendarOff} label="On Leave" value={stats?.onLeaveToday || 0} sub={`${stats?.pendingLeaves || 0} pending`} color="bg-warning-500" delay={200} />
        <StatCard icon={Briefcase} label="Open Positions" value={stats?.openJobs || 0} sub={`${stats?.totalApplications || 0} applications`} color="bg-accent-500" delay={300} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={attendanceTrend}>
              <defs>
                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f5fc2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0f5fc2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b' }} />
              <Area type="monotone" dataKey="present" stroke="#0f5fc2" fill="url(#colorPresent)" strokeWidth={2} />
              <Area type="monotone" dataKey="absent" stroke="#ef4444" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={deptData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leave Requests */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Leave Requests</h3>
          <div className="space-y-3">
            {activities?.recentLeaves?.map((leave, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-dark-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-xs font-semibold">
                    {leave.user?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{leave.user?.name}</p>
                    <p className="text-xs text-dark-400">{leave.type} · {leave.days} days</p>
                  </div>
                </div>
                <span className={`badge ${leave.status === 'approved' ? 'bg-success-500/20 text-success-400' : leave.status === 'pending' ? 'bg-warning-500/20 text-warning-400' : 'bg-danger-400/20 text-danger-400'}`}>
                  {leave.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">New Applications</h3>
          <div className="space-y-3">
            {activities?.recentApps?.map((app, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-dark-800/40">
                <div>
                  <p className="text-sm font-medium text-white">{app.candidateName}</p>
                  <p className="text-xs text-dark-400">{app.jobPosting?.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary-400">{app.aiScore}%</p>
                  <p className="text-xs text-dark-400">AI Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role Distribution */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Role Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={roleData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={80} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b' }} />
              <Bar dataKey="value" fill="#0f5fc2" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
