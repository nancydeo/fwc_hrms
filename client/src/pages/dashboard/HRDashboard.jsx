import { useState, useEffect } from 'react';
import { getDashboardStats, getRecentActivities } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, FileText, Users, UserPlus } from 'lucide-react';

const HRDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getRecentActivities()])
      .then(([s, a]) => { setStats(s.data); setActivities(a.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-96"><div className="spinner" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">HR Dashboard 🎯</h1>
        <p className="text-dark-400 mt-1">Recruitment pipeline & employee overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Briefcase, label: 'Open Positions', value: stats?.openJobs || 0, color: 'bg-primary-500' },
          { icon: FileText, label: 'Applications', value: stats?.totalApplications || 0, color: 'bg-accent-500' },
          { icon: Users, label: 'Total Employees', value: stats?.totalEmployees || 0, color: 'bg-success-500' },
          { icon: UserPlus, label: 'Pending Leaves', value: stats?.pendingLeaves || 0, color: 'bg-warning-500' },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Applications</h3>
          <div className="space-y-3">
            {activities?.recentApps?.map((app, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-dark-800/40 card-hover">
                <div>
                  <p className="text-sm font-medium text-white">{app.candidateName}</p>
                  <p className="text-xs text-dark-400">{app.jobPosting?.title}</p>
                </div>
                <span className={`badge ${app.status === 'shortlisted' ? 'bg-success-500/20 text-success-400' : app.status === 'interview' ? 'bg-primary-500/20 text-primary-400' : 'bg-dark-600/50 text-dark-300'}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Pending Leave Approvals</h3>
          <div className="space-y-3">
            {activities?.recentLeaves?.filter(l => l.status === 'pending').length > 0 ? (
              activities.recentLeaves.filter(l => l.status === 'pending').map((leave, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-dark-800/40">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-warning-400 to-warning-500 flex items-center justify-center text-white text-xs font-semibold">
                      {leave.user?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{leave.user?.name}</p>
                      <p className="text-xs text-dark-400">{leave.type} · {leave.days} days</p>
                    </div>
                  </div>
                  <span className="badge bg-warning-500/20 text-warning-400">Pending</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-dark-400 text-center py-8">No pending requests</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
