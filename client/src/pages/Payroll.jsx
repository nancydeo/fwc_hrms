import { useState, useEffect } from 'react';
import { getPayroll, generatePayroll } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Wallet, Download, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const Payroll = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setLoading(true);
    getPayroll({ month, year }).then(res => setRecords(res.data)).finally(() => setLoading(false));
  }, [month, year]);

  const handleGenerate = async () => {
    try { await generatePayroll({ month, year }); toast.success('Payroll generated!'); getPayroll({ month, year }).then(res => setRecords(res.data)); } catch (err) { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Payroll</h1>
          <p className="text-dark-400 mt-1">Salary management & payslips</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'hr_recruiter') && (
          <button onClick={handleGenerate} className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors">
            <RefreshCw size={16} /> Generate Payroll
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <select value={month} onChange={e => setMonth(Number(e.target.value))} className="bg-dark-800/60 border border-dark-600/50 rounded-xl px-4 py-2.5 text-white text-sm">
          {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={year} onChange={e => setYear(Number(e.target.value))} className="bg-dark-800/60 border border-dark-600/50 rounded-xl px-4 py-2.5 text-white text-sm">
          <option value={2026}>2026</option><option value={2025}>2025</option>
        </select>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700/50">
                <th className="text-left p-4 text-xs font-medium text-dark-400 uppercase">Employee</th>
                <th className="text-right p-4 text-xs font-medium text-dark-400 uppercase hidden md:table-cell">Basic</th>
                <th className="text-right p-4 text-xs font-medium text-dark-400 uppercase hidden lg:table-cell">HRA</th>
                <th className="text-right p-4 text-xs font-medium text-dark-400 uppercase hidden md:table-cell">Deductions</th>
                <th className="text-right p-4 text-xs font-medium text-dark-400 uppercase">Net Pay</th>
                <th className="text-center p-4 text-xs font-medium text-dark-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-12"><div className="spinner mx-auto" /></td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12 text-dark-400">No payroll records</td></tr>
              ) : records.map((r) => (
                <tr key={r._id} className="table-row border-b border-dark-800/50">
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium text-white">{r.user?.name}</p>
                      <p className="text-xs text-dark-400">{r.user?.employeeId}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-dark-300 text-right hidden md:table-cell">₹{r.basicSalary?.toLocaleString()}</td>
                  <td className="p-4 text-sm text-dark-300 text-right hidden lg:table-cell">₹{r.hra?.toLocaleString()}</td>
                  <td className="p-4 text-sm text-danger-400 text-right hidden md:table-cell">-₹{(r.deductions + r.tax)?.toLocaleString()}</td>
                  <td className="p-4 text-sm font-semibold text-success-400 text-right">₹{r.netSalary?.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <span className={`badge ${r.status === 'paid' ? 'bg-success-500/20 text-success-400' : r.status === 'processed' ? 'bg-accent-500/20 text-accent-400' : 'bg-warning-500/20 text-warning-400'}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
