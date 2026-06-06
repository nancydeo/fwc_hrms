import { useState } from 'react';
import { screenResume, chatWithAI, generateInterviewQuestions, generatePerformanceSummary, predictAttrition, generateJD } from '../utils/api';
import { Bot, FileSearch, MessageSquare, HelpCircle, BarChart3, AlertTriangle, FileText, Send, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const tools = [
  { id: 'resume', label: 'Resume Screening', icon: FileSearch, desc: 'AI-powered resume analysis & scoring', color: 'from-primary-500 to-primary-600' },
  { id: 'chatbot', label: 'HR Chatbot', icon: MessageSquare, desc: 'Ask HR policy questions', color: 'from-accent-500 to-accent-600' },
  { id: 'interview', label: 'Interview Questions', icon: HelpCircle, desc: 'Generate role-specific questions', color: 'from-success-400 to-success-500' },
  { id: 'performance', label: 'Performance Summary', icon: BarChart3, desc: 'Auto-generate review summaries', color: 'from-warning-400 to-warning-500' },
  { id: 'attrition', label: 'Attrition Predictor', icon: AlertTriangle, desc: 'Predict employee flight risk', color: 'from-danger-400 to-danger-500' },
  { id: 'jd', label: 'JD Generator', icon: FileText, desc: 'Create job descriptions with AI', color: 'from-purple-500 to-purple-600' },
];

const AIHub = () => {
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Resume Screening
  const [resumeText, setResumeText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobReqs, setJobReqs] = useState('');

  // Chatbot
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Interview
  const [intTitle, setIntTitle] = useState('');
  const [intSkills, setIntSkills] = useState('');
  const [intLevel, setIntLevel] = useState('Mid-level');

  // Performance
  const [perfName, setPerfName] = useState('');
  const [perfPeriod, setPerfPeriod] = useState('Q1 2026');
  const [perfRatings, setPerfRatings] = useState({ productivity: 4, quality: 4, communication: 3, teamwork: 4, leadership: 3 });

  // Attrition
  const [attrData, setAttrData] = useState({ tenure: '2 years', salary: '₹8 LPA', lastRating: '3.5/5', leavesUsed: '20/39', overtimeHours: '15/month', promotions: '0', teamChanges: '2' });

  // JD Generator
  const [jdTitle, setJdTitle] = useState('');
  const [jdDept, setJdDept] = useState('');
  const [jdSkills, setJdSkills] = useState('');
  const [jdExp, setJdExp] = useState('2-4 years');

  const handleResumeScreen = async () => {
    if (!resumeText) return toast.error('Paste resume text');
    setLoading(true); setResult(null);
    try { const { data } = await screenResume({ resumeText, jobTitle, jobRequirements: jobReqs }); setResult(data); } catch { toast.error('AI failed'); }
    setLoading(false);
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput; setChatInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const { data } = await chatWithAI({ message: msg });
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch { toast.error('AI failed'); }
    setLoading(false);
  };

  const handleInterview = async () => {
    if (!intTitle) return toast.error('Enter job title');
    setLoading(true); setResult(null);
    try { const { data } = await generateInterviewQuestions({ jobTitle: intTitle, skills: intSkills.split(',').map(s => s.trim()), experience: intLevel }); setResult(data); } catch { toast.error('AI failed'); }
    setLoading(false);
  };

  const handlePerformance = async () => {
    if (!perfName) return toast.error('Enter employee name');
    setLoading(true); setResult(null);
    try { const { data } = await generatePerformanceSummary({ employeeName: perfName, ratings: perfRatings, period: perfPeriod }); setResult(data); } catch { toast.error('AI failed'); }
    setLoading(false);
  };

  const handleAttrition = async () => {
    setLoading(true); setResult(null);
    try { const { data } = await predictAttrition({ employeeData: attrData }); setResult(data); } catch { toast.error('AI failed'); }
    setLoading(false);
  };

  const handleJD = async () => {
    if (!jdTitle) return toast.error('Enter title');
    setLoading(true); setResult(null);
    try { const { data } = await generateJD({ title: jdTitle, department: jdDept, skills: jdSkills.split(',').map(s => s.trim()), experience: jdExp }); setResult(data); } catch { toast.error('AI failed'); }
    setLoading(false);
  };

  const inputClass = "w-full bg-dark-800/60 border border-dark-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-dark-400";

  if (!active) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-white">AI Hub <Sparkles className="inline text-primary-400" size={24} /></h1><p className="text-dark-400 mt-1">Powered by Google Gemini AI</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((t, i) => (
            <button key={t.id} onClick={() => { setActive(t.id); setResult(null); }} className="glass rounded-2xl p-6 text-left card-hover animate-fadeIn group" style={{ animationDelay: `${i * 80}ms` }}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <t.icon size={22} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{t.label}</h3>
              <p className="text-sm text-dark-400">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentTool = tools.find(t => t.id === active);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => { setActive(null); setResult(null); setMessages([]); }} className="text-dark-400 hover:text-primary-600 transition-colors text-sm">← Back</button>
        <h1 className="text-2xl font-bold text-white">{currentTool?.label}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Input</h3>

          {active === 'resume' && (
            <div className="space-y-4">
              <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="Job Title (e.g. React Developer)" className={inputClass} />
              <input value={jobReqs} onChange={e => setJobReqs(e.target.value)} placeholder="Requirements (comma-separated)" className={inputClass} />
              <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste resume text here..." rows={8} className={`${inputClass} resize-none`} />
              <button onClick={handleResumeScreen} disabled={loading} className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : <><FileSearch size={16} /> Screen Resume</>}
              </button>
            </div>
          )}

          {active === 'chatbot' && (
            <div className="flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2">
                {messages.length === 0 && <p className="text-center text-dark-400 text-sm py-12">Ask me anything about HR policies, leave, payroll...</p>}
                {messages.map((m, i) => (
                  <div key={i} className={`chat-bubble ${m.role}`}>
                    <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                  </div>
                ))}
                {loading && <div className="chat-bubble bot"><Loader2 size={16} className="animate-spin text-primary-400" /></div>}
              </div>
              <div className="flex gap-2">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} placeholder="Type a message..." className={`${inputClass} flex-1`} />
                <button onClick={handleChat} disabled={loading} className="px-4 py-2.5 bg-primary-600 text-white rounded-xl"><Send size={16} /></button>
              </div>
            </div>
          )}

          {active === 'interview' && (
            <div className="space-y-4">
              <input value={intTitle} onChange={e => setIntTitle(e.target.value)} placeholder="Job Title" className={inputClass} />
              <input value={intSkills} onChange={e => setIntSkills(e.target.value)} placeholder="Skills (comma-separated)" className={inputClass} />
              <select value={intLevel} onChange={e => setIntLevel(e.target.value)} className={inputClass}>
                <option>Junior</option><option>Mid-level</option><option>Senior</option><option>Lead</option>
              </select>
              <button onClick={handleInterview} disabled={loading} className="w-full bg-gradient-to-r from-success-400 to-success-500 text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <><HelpCircle size={16} /> Generate Questions</>}
              </button>
            </div>
          )}

          {active === 'performance' && (
            <div className="space-y-4">
              <input value={perfName} onChange={e => setPerfName(e.target.value)} placeholder="Employee Name" className={inputClass} />
              <input value={perfPeriod} onChange={e => setPerfPeriod(e.target.value)} placeholder="Review Period" className={inputClass} />
              {Object.entries(perfRatings).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm text-dark-300 capitalize">{key}</label>
                  <input type="range" min="1" max="5" value={val} onChange={e => setPerfRatings({...perfRatings, [key]: Number(e.target.value)})} className="w-32" />
                  <span className="text-sm text-white w-6 text-right">{val}</span>
                </div>
              ))}
              <button onClick={handlePerformance} disabled={loading} className="w-full bg-gradient-to-r from-warning-400 to-warning-500 text-dark-900 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <><BarChart3 size={16} /> Generate Summary</>}
              </button>
            </div>
          )}

          {active === 'attrition' && (
            <div className="space-y-4">
              {Object.entries(attrData).map(([key, val]) => (
                <div key={key}>
                  <label className="block text-sm text-dark-300 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                  <input value={val} onChange={e => setAttrData({...attrData, [key]: e.target.value})} className={inputClass} />
                </div>
              ))}
              <button onClick={handleAttrition} disabled={loading} className="w-full bg-gradient-to-r from-danger-400 to-danger-500 text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : <><AlertTriangle size={16} /> Predict Risk</>}
              </button>
            </div>
          )}

          {active === 'jd' && (
            <div className="space-y-4">
              <input value={jdTitle} onChange={e => setJdTitle(e.target.value)} placeholder="Job Title" className={inputClass} />
              <input value={jdDept} onChange={e => setJdDept(e.target.value)} placeholder="Department" className={inputClass} />
              <input value={jdSkills} onChange={e => setJdSkills(e.target.value)} placeholder="Skills (comma-separated)" className={inputClass} />
              <input value={jdExp} onChange={e => setJdExp(e.target.value)} placeholder="Experience" className={inputClass} />
              <button onClick={handleJD} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <><FileText size={16} /> Generate JD</>}
              </button>
            </div>
          )}
        </div>

        {/* Result Panel */}
        {active !== 'chatbot' && (
          <div className="glass rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">AI Result</h3>
            {!result && !loading && <p className="text-dark-400 text-sm text-center py-12">Results will appear here</p>}
            {loading && <div className="flex justify-center py-12"><div className="spinner" /></div>}

            {result && active === 'resume' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/40">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${result.score >= 80 ? 'bg-success-500/20 text-success-400' : result.score >= 60 ? 'bg-warning-500/20 text-warning-400' : 'bg-danger-400/20 text-danger-400'}`}>
                    {result.score}
                  </div>
                  <div>
                    <p className="text-sm text-dark-400">AI Score</p>
                    <p className="font-medium text-white capitalize">Recommendation: {result.recommendation}</p>
                  </div>
                </div>
                <div><p className="text-sm text-dark-400 mb-1">Summary</p><p className="text-sm text-white">{result.summary}</p></div>
                {result.skills_matched?.length > 0 && <div><p className="text-sm text-dark-400 mb-1">Skills Matched</p><div className="flex flex-wrap gap-1.5">{result.skills_matched.map(s => <span key={s} className="badge bg-success-500/20 text-success-400">{s}</span>)}</div></div>}
                {result.skills_missing?.length > 0 && <div><p className="text-sm text-dark-400 mb-1">Skills Missing</p><div className="flex flex-wrap gap-1.5">{result.skills_missing.map(s => <span key={s} className="badge bg-danger-400/20 text-danger-400">{s}</span>)}</div></div>}
                {result.strengths?.length > 0 && <div><p className="text-sm text-dark-400 mb-1">Strengths</p><ul className="text-sm text-white space-y-1">{result.strengths.map((s, i) => <li key={i}>✓ {s}</li>)}</ul></div>}
              </div>
            )}

            {result && active === 'interview' && result.questions && (
              <div className="space-y-3 animate-fadeIn max-h-[500px] overflow-y-auto">
                {result.questions.map((q, i) => (
                  <div key={i} className="p-3 rounded-xl bg-dark-800/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-primary-400 font-medium">Q{i + 1}</span>
                      <div className="flex gap-1.5">
                        <span className="badge bg-primary-500/15 text-primary-300">{q.category}</span>
                        <span className="badge bg-dark-600/50 text-dark-300">{q.difficulty}</span>
                      </div>
                    </div>
                    <p className="text-sm text-white mb-2">{q.question}</p>
                    {q.expected_answer_points && <div className="text-xs text-dark-400 space-y-0.5">{q.expected_answer_points.map((p, j) => <p key={j}>• {p}</p>)}</div>}
                  </div>
                ))}
              </div>
            )}

            {result && active === 'performance' && (
              <div className="animate-fadeIn"><p className="text-sm text-white whitespace-pre-wrap leading-relaxed">{result.summary}</p></div>
            )}

            {result && active === 'attrition' && (
              <div className="space-y-4 animate-fadeIn">
                <div className={`p-4 rounded-xl text-center ${result.riskLevel === 'low' ? 'bg-success-500/20' : result.riskLevel === 'medium' ? 'bg-warning-500/20' : 'bg-danger-400/20'}`}>
                  <p className="text-3xl font-bold text-white mb-1">{result.riskScore}%</p>
                  <p className={`text-sm font-medium capitalize ${result.riskLevel === 'low' ? 'text-success-400' : result.riskLevel === 'medium' ? 'text-warning-400' : 'text-danger-400'}`}>{result.riskLevel} Risk</p>
                </div>
                <p className="text-sm text-white">{result.summary}</p>
                {result.factors?.length > 0 && <div className="space-y-2">{result.factors.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className={f.impact === 'positive' ? 'text-success-400' : 'text-danger-400'}>{f.impact === 'positive' ? '↑' : '↓'}</span>
                    <span className="text-white">{f.factor}:</span><span className="text-dark-400">{f.detail}</span>
                  </div>
                ))}</div>}
                {result.recommendations?.length > 0 && <div><p className="text-sm text-dark-400 mb-1">Recommendations</p><ul className="text-sm text-white space-y-1">{result.recommendations.map((r, i) => <li key={i}>→ {r}</li>)}</ul></div>}
              </div>
            )}

            {result && active === 'jd' && (
              <div className="animate-fadeIn"><p className="text-sm text-white whitespace-pre-wrap leading-relaxed">{result.jobDescription}</p></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIHub;
