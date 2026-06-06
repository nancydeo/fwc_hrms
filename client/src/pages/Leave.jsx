import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getLeaves, applyLeave, approveLeave, rejectLeave, getLeaveBalance } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { CalendarOff, Plus, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Leave = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'casual', startDate: '', endDate: '', reason: '' });

  const fetchData = () => {
    setLoading(true);
    Promise.all([getLeaves({}), getLeaveBalance()])
      .then(([l, b]) => { setLeaves(l.data); setBalance(b.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    try { await applyLeave(form); toast.success('Leave applied!'); setShowForm(false); setForm({ type: 'casual', startDate: '', endDate: '', reason: '' }); fetchData(); } catch (err) { toast.error('Failed'); }
  };

  const handleApprove = async (id) => {
    try { await approveLeave(id, {}); toast.success('Approved'); fetchData(); } catch (err) { toast.error('Failed'); }
  };

  const handleReject = async (id) => {
    try { await rejectLeave(id, {}); toast.success('Rejected'); fetchData(); } catch (err) { toast.error('Failed'); }
  };

  const getStatusColor = (s) => {
    return s === 'approved' ? 'bg-success-500/20 text-success-400' : s === 'pending' ? 'bg-warning-500/20 text-warning-400' : 'bg-danger-400/20 text-danger-400';
  };

  const filteredLeaves = leaves.filter(l => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const typeStr = (l.type || '').toLowerCase();
    const statusStr = (l.status || '').toLowerCase();
    const reasonStr = (l.reason || '').toLowerCase();
    const empName = (l.user?.name || '').toLowerCase();
    return typeStr.includes(q) || statusStr.includes(q) || reasonStr.includes(q) || empName.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Leave Management</h1>
          <p className="text-dark-400 mt-1">Apply and manage leaves</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors">
          <Plus size={16} /> Apply Leave
        </button>
      </div>

      {/* Leave Balance */}
      {balance && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(balance).map(([type, data]) => (
            <div key={type} className="stat-card">
              <p className="text-sm text-dark-400 capitalize mb-1">{type} Leave</p>
              <p className="text-2xl font-bold text-white">{data.remaining} <span className="text-sm font-normal text-dark-400">/ {data.total}</span></p>
              <div className="w-full h-1.5 bg-dark-700 rounded-full mt-2 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500" style={{ width: `${(data.remaining / data.total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Form */}
      {showForm && (
        <div className="glass rounded-2xl p-5 animate-fadeIn">
          <h3 className="text-lg font-semibold text-white mb-4">Apply for Leave</h3>
          <form onSubmit={handleApply} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-300 mb-1.5">Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-dark-800/60 border border-dark-600/50 rounded-xl px-4 py-2.5 text-white text-sm">
                <option value="casual">Casual</option><option value="sick">Sick</option><option value="earned">Earned</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-dark-300 mb-1.5">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} required className="w-full bg-dark-800/60 border border-dark-600/50 rounded-xl px-4 py-2.5 text-white text-sm" />
            </div>
            <div>
              <label className="block text-sm text-dark-300 mb-1.5">End Date</label>
              <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} required className="w-full bg-dark-800/60 border border-dark-600/50 rounded-xl px-4 py-2.5 text-white text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-dark-300 mb-1.5">Reason</label>
              <textarea value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} required rows={2} className="w-full bg-dark-800/60 border border-dark-600/50 rounded-xl px-4 py-2.5 text-white text-sm resize-none" />
            </div>
            <div className="sm:col-span-2 flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-dark-700 text-dark-200 hover:bg-dark-600 rounded-xl text-sm transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm">Submit</button>
            </div>
          </form>
        </div>
      )}

      {/* Leaves Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700/50">
                {user?.role !== 'employee' && <th className="text-left p-4 text-xs font-medium text-dark-400 uppercase">Employee</th>}
                <th className="text-left p-4 text-xs font-medium text-dark-400 uppercase">Type</th>
                <th className="text-left p-4 text-xs font-medium text-dark-400 uppercase">Duration</th>
                <th className="text-left p-4 text-xs font-medium text-dark-400 uppercase hidden md:table-cell">Reason</th>
                <th className="text-left p-4 text-xs font-medium text-dark-400 uppercase">Status</th>
                {user?.role !== 'employee' && <th className="text-right p-4 text-xs font-medium text-dark-400 uppercase">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-12"><div className="spinner mx-auto" /></td></tr>
              ) : filteredLeaves.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12 text-dark-400">No leaves found matching "{searchQuery}"</td></tr>
              ) : filteredLeaves.map((l) => (
                <tr key={l._id} className="table-row border-b border-dark-800/50">
                  {user?.role !== 'employee' && <td className="p-4 text-sm text-white">{l.user?.name}</td>}
                  <td className="p-4 text-sm text-dark-300 capitalize">{l.type}</td>
                  <td className="p-4 text-sm text-dark-300">{new Date(l.startDate).toLocaleDateString('en-IN', {day:'2-digit',month:'short'})} — {new Date(l.endDate).toLocaleDateString('en-IN', {day:'2-digit',month:'short'})} ({l.days}d)</td>
                  <td className="p-4 text-sm text-dark-400 hidden md:table-cell max-w-[200px] truncate">{l.reason}</td>
                  <td className="p-4"><span className={`badge ${getStatusColor(l.status)}`}>{l.status}</span></td>
                  {user?.role !== 'employee' && (
                    <td className="p-4 text-right">
                      {l.status === 'pending' && (
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleApprove(l._id)} className="p-1.5 rounded-lg text-success-400 hover:bg-success-500/10"><Check size={16} /></button>
                          <button onClick={() => handleReject(l._id)} className="p-1.5 rounded-lg text-danger-400 hover:bg-danger-400/10"><X size={16} /></button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leave;
