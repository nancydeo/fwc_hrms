import { useState, useEffect } from 'react';
import { getDepartments, createDepartment } from '../utils/api';
import { Building2, Plus, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchDepts = () => { getDepartments().then(res => setDepartments(res.data)).finally(() => setLoading(false)); };
  useEffect(() => { fetchDepts(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try { await createDepartment(form); toast.success('Department created!'); setShowForm(false); setForm({ name: '', description: '' }); fetchDepts(); } catch (err) { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Departments</h1><p className="text-dark-400 mt-1">Manage organization departments</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors"><Plus size={16} /> Add Department</button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-5 animate-fadeIn">
          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Department name" required className="flex-1 bg-dark-800/60 border border-dark-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-dark-400" />
            <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" className="flex-1 bg-dark-800/60 border border-dark-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-dark-400" />
            <button type="submit" className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm">Create</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? <div className="col-span-full flex justify-center py-12"><div className="spinner" /></div> :
          departments.map((d) => (
            <div key={d._id} className="glass rounded-2xl p-5 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-primary-500/15"><Building2 size={20} className="text-primary-400" /></div>
                <span className={`badge ${d.status === 'active' ? 'bg-success-500/20 text-success-400' : 'bg-dark-600/50 text-dark-300'}`}>{d.status}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{d.name}</h3>
              <p className="text-sm text-dark-400 mb-3 line-clamp-2">{d.description || 'No description'}</p>
              <div className="flex items-center gap-4 text-sm text-dark-400">
                <span className="flex items-center gap-1"><Users size={14} /> {d.employeeCount} members</span>
              </div>
              {d.head && <p className="text-xs text-dark-400 mt-2">Head: <span className="text-white">{d.head.name}</span></p>}
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Departments;
