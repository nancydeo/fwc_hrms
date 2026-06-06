import { useState, useEffect } from 'react';
import { getJobs, createJob, getApplications, updateApplicationStatus, getDepartments } from '../utils/api';
import { Briefcase, Plus, Eye, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Recruitment = () => {
  const [tab, setTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', department: '', description: '', requirements: '', skills: '', experience: '2-4 years' });
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    Promise.all([getJobs({}), getApplications({}), getDepartments()])
      .then(([j, a, d]) => { setJobs(j.data); setApps(a.data); setDepartments(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await createJob({ ...form, requirements: form.requirements.split(',').map(s => s.trim()), skills: form.skills.split(',').map(s => s.trim()) });
      toast.success('Job posted!'); setShowForm(false);
      getJobs({}).then(r => setJobs(r.data));
    } catch (err) { toast.error('Failed'); }
  };

  const handleStatusChange = async (appId, status) => {
    try { await updateApplicationStatus(appId, { status }); toast.success('Status updated'); getApplications({}).then(r => setApps(r.data)); } catch { toast.error('Failed'); }
  };

  const getStatusColor = (s) => {
    const c = { applied: 'bg-dark-600/50 text-dark-300', screening: 'bg-accent-500/20 text-accent-400', shortlisted: 'bg-primary-500/20 text-primary-400', interview: 'bg-warning-500/20 text-warning-400', offered: 'bg-success-500/20 text-success-400', hired: 'bg-success-500/30 text-success-400', rejected: 'bg-danger-400/20 text-danger-400' };
    return c[s] || 'bg-dark-600/50 text-dark-300';
  };

  const filteredApps = selectedJob ? apps.filter(a => a.jobPosting?._id === selectedJob) : apps;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Recruitment</h1><p className="text-dark-400 mt-1">Job postings & applications</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium"><Plus size={16} /> Post Job</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['jobs', 'applications'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-primary-500/15 text-primary-400 font-bold' : 'text-dark-400 hover:text-primary-600 hover:bg-dark-800'}`}>{t}</button>
        ))}
      </div>

      {/* Create Job Form */}
      {showForm && (
        <div className="glass rounded-2xl p-5 animate-fadeIn">
          <h3 className="text-lg font-semibold text-white mb-4">Post New Job</h3>
          <form onSubmit={handleCreateJob} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Job Title" required className="bg-dark-800/60 border border-dark-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-dark-400" />
            <select value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="bg-dark-800/60 border border-dark-600/50 rounded-xl px-4 py-2.5 text-white text-sm">
              <option value="">Select Department</option>
              {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Job Description" required rows={2} className="sm:col-span-2 bg-dark-800/60 border border-dark-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-dark-400 resize-none" />
            <input type="text" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} placeholder="Skills (comma-separated)" className="bg-dark-800/60 border border-dark-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-dark-400" />
            <input type="text" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} placeholder="Experience" className="bg-dark-800/60 border border-dark-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-dark-400" />
            <div className="sm:col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-dark-700 text-dark-200 hover:bg-dark-600 rounded-xl text-sm transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm">Post Job</button>
            </div>
          </form>
        </div>
      )}

      {/* Jobs Grid */}
      {tab === 'jobs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? <div className="col-span-full flex justify-center py-12"><div className="spinner" /></div> :
            jobs.map(j => (
              <div key={j._id} className="glass rounded-2xl p-5 card-hover cursor-pointer" onClick={() => { setSelectedJob(j._id); setTab('applications'); }}>
                <div className="flex items-start justify-between mb-3">
                  <span className={`badge ${j.status === 'open' ? 'bg-success-500/20 text-success-400' : 'bg-dark-600/50 text-dark-300'}`}>{j.status}</span>
                  <span className="text-xs text-dark-400">{j.applicationsCount} applicants</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{j.title}</h3>
                <p className="text-sm text-dark-400 mb-3 line-clamp-2">{j.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {j.skills?.slice(0, 4).map(s => <span key={s} className="badge bg-primary-500/10 text-primary-300 text-xs">{s}</span>)}
                </div>
                <div className="flex items-center justify-between text-xs text-dark-400">
                  <span>{j.experience}</span>
                  <span className="flex items-center gap-1 text-primary-400">View <ChevronRight size={14} /></span>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* Applications */}
      {tab === 'applications' && (
        <div className="glass rounded-2xl overflow-hidden">
          {selectedJob && <div className="p-4 border-b border-dark-700/50 flex justify-between items-center">
            <p className="text-sm text-dark-400">Showing applications for selected job</p>
            <button onClick={() => setSelectedJob(null)} className="text-xs text-primary-400 hover:text-primary-300">Show All</button>
          </div>}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700/50">
                  <th className="text-left p-4 text-xs font-medium text-dark-400 uppercase">Candidate</th>
                  <th className="text-left p-4 text-xs font-medium text-dark-400 uppercase hidden md:table-cell">Position</th>
                  <th className="text-center p-4 text-xs font-medium text-dark-400 uppercase">AI Score</th>
                  <th className="text-left p-4 text-xs font-medium text-dark-400 uppercase">Status</th>
                  <th className="text-right p-4 text-xs font-medium text-dark-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map(a => (
                  <tr key={a._id} className="table-row border-b border-dark-800/50">
                    <td className="p-4">
                      <p className="text-sm font-medium text-white">{a.candidateName}</p>
                      <p className="text-xs text-dark-400">{a.candidateEmail}</p>
                    </td>
                    <td className="p-4 text-sm text-dark-300 hidden md:table-cell">{a.jobPosting?.title}</td>
                    <td className="p-4 text-center">
                      <span className={`text-sm font-bold ${a.aiScore >= 80 ? 'text-success-400' : a.aiScore >= 60 ? 'text-warning-400' : 'text-danger-400'}`}>{a.aiScore}%</span>
                    </td>
                    <td className="p-4"><span className={`badge ${getStatusColor(a.status)}`}>{a.status}</span></td>
                    <td className="p-4 text-right">
                      <select value={a.status} onChange={e => handleStatusChange(a._id, e.target.value)} className="bg-dark-800/60 border border-dark-600/50 rounded-lg px-2 py-1 text-xs text-white">
                        {['applied','screening','shortlisted','interview','offered','hired','rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruitment;
