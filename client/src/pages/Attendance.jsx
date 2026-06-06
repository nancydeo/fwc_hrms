import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAttendance, getTodayAttendance, checkIn, checkOut } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { CalendarCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Attendance = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [records, setRecords] = useState([]);
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setLoading(true);
    Promise.all([getAttendance({ month, year }), getTodayAttendance()])
      .then(([a, t]) => { setRecords(a.data.records || []); setToday(t.data); })
      .finally(() => setLoading(false));
  }, [month, year]);

  const handleCheckIn = async () => {
    try { const { data } = await checkIn(); setToday(data); toast.success('Checked in!'); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };
  const handleCheckOut = async () => {
    try { const { data } = await checkOut(); setToday(data); toast.success('Checked out!'); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const getStatusBadge = (s) => {
    const styles = { present: 'bg-success-500/20 text-success-400', absent: 'bg-danger-400/20 text-danger-400', late: 'bg-warning-500/20 text-warning-400', half_day: 'bg-accent-500/20 text-accent-400', on_leave: 'bg-primary-500/20 text-primary-400' };
    return styles[s] || 'bg-dark-600/50 text-dark-300';
  };

  const filteredRecords = records.filter(r => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const dateStr = new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', weekday: 'short' }).toLowerCase();
    const statusStr = (r.status || '').toLowerCase().replace('_', ' ');
    const empName = (r.user?.name || '').toLowerCase();
    return dateStr.includes(q) || statusStr.includes(q) || empName.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Attendance</h1>
          <p className="text-dark-400 mt-1">Track daily attendance</p>
        </div>
        {user?.role === 'employee' && (
          <div className="flex gap-2">
            <button onClick={handleCheckIn} disabled={today?.checkIn} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${today?.checkIn ? 'bg-dark-700 text-dark-400 cursor-not-allowed' : 'bg-success-500 text-white hover:bg-success-400'}`}>
              <CheckCircle size={16} /> Check In
            </button>
            <button onClick={handleCheckOut} disabled={!today?.checkIn || today?.checkOut} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${!today?.checkIn || today?.checkOut ? 'bg-dark-700 text-dark-400 cursor-not-allowed' : 'bg-danger-500 text-white hover:bg-danger-400'}`}>
              <XCircle size={16} /> Check Out
            </button>
          </div>
        )}
      </div>

      {/* Month picker */}
      <div className="flex gap-3">
        <select value={month} onChange={e => setMonth(Number(e.target.value))} className="bg-dark-800/60 border border-dark-600/50 rounded-xl px-4 py-2.5 text-white text-sm">
          {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={year} onChange={e => setYear(Number(e.target.value))} className="bg-dark-800/60 border border-dark-600/50 rounded-xl px-4 py-2.5 text-white text-sm">
          <option value={2026}>2026</option><option value={2025}>2025</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700/50">
                <th className="text-left p-4 text-xs font-medium text-dark-400 uppercase">Date</th>
                {user?.role !== 'employee' && <th className="text-left p-4 text-xs font-medium text-dark-400 uppercase hidden md:table-cell">Employee</th>}
                <th className="text-left p-4 text-xs font-medium text-dark-400 uppercase">Check In</th>
                <th className="text-left p-4 text-xs font-medium text-dark-400 uppercase hidden sm:table-cell">Check Out</th>
                <th className="text-left p-4 text-xs font-medium text-dark-400 uppercase hidden md:table-cell">Hours</th>
                <th className="text-left p-4 text-xs font-medium text-dark-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-12"><div className="spinner mx-auto" /></td></tr>
              ) : filteredRecords.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12 text-dark-400">No records found matching "{searchQuery}"</td></tr>
              ) : filteredRecords.map((r, i) => (
                <tr key={i} className="table-row border-b border-dark-800/50">
                  <td className="p-4 text-sm text-white">{new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', weekday: 'short' })}</td>
                  {user?.role !== 'employee' && <td className="p-4 text-sm text-dark-300 hidden md:table-cell">{r.user?.name}</td>}
                  <td className="p-4 text-sm text-dark-300">{r.checkIn ? new Date(r.checkIn).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                  <td className="p-4 text-sm text-dark-300 hidden sm:table-cell">{r.checkOut ? new Date(r.checkOut).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                  <td className="p-4 text-sm text-dark-300 hidden md:table-cell">{r.workHours || '—'}</td>
                  <td className="p-4"><span className={`badge ${getStatusBadge(r.status)}`}>{r.status?.replace('_', ' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
