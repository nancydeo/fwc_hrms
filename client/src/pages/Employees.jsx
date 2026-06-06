import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getEmployees, deleteEmployee, getDepartments } from '../utils/api';
import { Search, Filter, Trash2, Edit, Eye, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const Employees = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // Sync search state when URL search param changes
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  const fetchEmployees = () => {
    setLoading(true);
    getEmployees({ search, department: filter, limit: 50 })
      .then(res => setEmployees(res.data.employees))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEmployees(); }, [search, filter]);
  useEffect(() => { getDepartments().then(res => setDepartments(res.data)); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteEmployee(id);
      toast.success('Employee removed');
      fetchEmployees();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const getStatusColor = (s) => {
    const colors = { active: 'bg-success-500/20 text-success-400', inactive: 'bg-dark-600/50 text-dark-300', on_leave: 'bg-warning-500/20 text-warning-400', terminated: 'bg-danger-400/20 text-danger-400' };
    return colors[s] || 'bg-dark-600/50 text-dark-300';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Employees</h1>
          <p className="text-dark-400 mt-1">{employees.length} total employees</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
          <input type="text" placeholder="Search by name, email, ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-dark-800/60 border border-dark-600/50 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-dark-400" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-dark-800/60 border border-dark-600/50 rounded-xl px-4 py-2.5 text-white text-sm min-w-[180px]">
          <option value="">All Departments</option>
          {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>
      </div>

      {/* Employee Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700/50">
                <th className="text-left p-4 text-xs font-medium text-dark-400 uppercase tracking-wider">Employee</th>
                <th className="text-left p-4 text-xs font-medium text-dark-400 uppercase tracking-wider hidden md:table-cell">ID</th>
                <th className="text-left p-4 text-xs font-medium text-dark-400 uppercase tracking-wider hidden lg:table-cell">Department</th>
                <th className="text-left p-4 text-xs font-medium text-dark-400 uppercase tracking-wider hidden md:table-cell">Designation</th>
                <th className="text-left p-4 text-xs font-medium text-dark-400 uppercase tracking-wider">Status</th>
                <th className="text-right p-4 text-xs font-medium text-dark-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-12"><div className="spinner mx-auto" /></td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12 text-dark-400">No employees found</td></tr>
              ) : employees.map((emp) => (
                <tr key={emp._id} className="table-row border-b border-dark-800/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {emp.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{emp.name}</p>
                        <p className="text-xs text-dark-400">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-dark-300 hidden md:table-cell font-mono">{emp.employeeId}</td>
                  <td className="p-4 text-sm text-dark-300 hidden lg:table-cell">{emp.department?.name || '—'}</td>
                  <td className="p-4 text-sm text-dark-300 hidden md:table-cell">{emp.designation || '—'}</td>
                  <td className="p-4"><span className={`badge ${getStatusColor(emp.status)}`}>{emp.status}</span></td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setSelected(emp)} className="p-1.5 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 transition-colors"><Eye size={16} /></button>
                      <button onClick={() => handleDelete(emp._id)} className="p-1.5 rounded-lg text-dark-400 hover:text-danger-400 hover:bg-danger-400/10 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="glass rounded-2xl p-6 w-full max-w-lg animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-xl font-bold">
                {selected.name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark-100">{selected.name}</h3>
                <p className="text-dark-400">{selected.designation} · {selected.employeeId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Email', selected.email], ['Phone', selected.phone || 'N/A'],
                ['Department', selected.department?.name || 'N/A'], ['Status', selected.status],
                ['Joined', new Date(selected.dateOfJoining).toLocaleDateString()], ['Salary', `₹${selected.salary?.toLocaleString()}`],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-xs text-dark-400 mb-1">{label}</p>
                  <p className="text-sm font-medium text-dark-100 capitalize">{val}</p>
                </div>
              ))}
            </div>
            {selected.skills?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-dark-400 mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.skills.map(s => <span key={s} className="badge bg-primary-500/15 text-primary-300">{s}</span>)}
                </div>
              </div>
            )}
            <button onClick={() => setSelected(null)} className="mt-6 w-full bg-dark-700 hover:bg-dark-600 text-dark-200 py-2.5 rounded-xl text-sm transition-colors font-medium">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
