import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTodayAttendance, checkIn, checkOut, getLeaveBalance } from '../../utils/api';
import { Clock, CalendarCheck, CalendarOff, Wallet, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [today, setToday] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTodayAttendance(), getLeaveBalance()])
      .then(([t, b]) => { setToday(t.data); setBalance(b.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleCheckIn = async () => {
    try {
      const { data } = await checkIn();
      setToday(data);
      toast.success('Checked in successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      const { data } = await checkOut();
      setToday(data);
      toast.success('Checked out successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-out failed');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="spinner" /></div>;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Hello, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-dark-400 mt-1">{dateStr}</p>
      </div>

      {/* Attendance Card */}
      <div className="glass rounded-2xl p-6 glow-primary">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-dark-400 text-sm mb-1">Current Time</p>
            <p className="text-4xl font-bold gradient-text">{timeStr}</p>
            <p className="text-dark-400 text-sm mt-2">
              {today?.checkIn ? `Checked in at ${new Date(today.checkIn).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}` : 'Not checked in yet'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCheckIn}
              disabled={today?.checkIn}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${today?.checkIn ? 'bg-dark-700 text-dark-400 cursor-not-allowed' : 'bg-success-500 hover:bg-success-400 text-white shadow-lg shadow-success-500/25'}`}
            >
              <CheckCircle size={18} />
              Check In
            </button>
            <button
              onClick={handleCheckOut}
              disabled={!today?.checkIn || today?.checkOut}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${!today?.checkIn || today?.checkOut ? 'bg-dark-700 text-dark-400 cursor-not-allowed' : 'bg-danger-500 hover:bg-danger-400 text-white shadow-lg shadow-danger-500/25'}`}
            >
              <XCircle size={18} />
              Check Out
            </button>
          </div>
        </div>
        {today?.workHours > 0 && (
          <div className="mt-4 pt-4 border-t border-dark-700/50">
            <p className="text-sm text-dark-400">Work Hours: <span className="text-white font-semibold">{today.workHours} hrs</span></p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card card-hover">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-dark-400 mb-1">Employee ID</p>
              <p className="text-lg font-bold text-white">{user?.employeeId || 'N/A'}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-primary-500"><Clock size={20} className="text-white" /></div>
          </div>
        </div>
        <div className="stat-card card-hover">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-dark-400 mb-1">Designation</p>
              <p className="text-lg font-bold text-white">{user?.designation || 'N/A'}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-accent-500"><Wallet size={20} className="text-white" /></div>
          </div>
        </div>
        <div className="stat-card card-hover">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-dark-400 mb-1">Today Status</p>
              <p className="text-lg font-bold text-white capitalize">{today?.status || 'Not marked'}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-success-500"><CalendarCheck size={20} className="text-white" /></div>
          </div>
        </div>
        <div className="stat-card card-hover">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-dark-400 mb-1">Role</p>
              <p className="text-lg font-bold text-white">Employee</p>
            </div>
            <div className="p-2.5 rounded-xl bg-warning-500"><CalendarOff size={20} className="text-white" /></div>
          </div>
        </div>
      </div>

      {/* Leave Balance */}
      {balance && (
        <div className="glass rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Leave Balance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(balance).map(([type, data]) => (
              <div key={type} className="bg-dark-800/40 rounded-xl p-4">
                <p className="text-sm text-dark-400 capitalize mb-2">{type} Leave</p>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-2xl font-bold text-white">{data.remaining}</span>
                  <span className="text-sm text-dark-400 mb-0.5">/ {data.total}</span>
                </div>
                <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
                    style={{ width: `${(data.remaining / data.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
