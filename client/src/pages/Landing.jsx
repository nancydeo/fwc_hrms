import { Link } from 'react-router-dom';
import { Sparkles, Users, CalendarCheck, Brain, Shield, BarChart3, Briefcase, ArrowRight, Bot, Zap, Globe } from 'lucide-react';

const features = [
  { icon: Users, title: 'Employee Management', desc: 'Complete employee lifecycle management with profiles, documents, and org charts.' },
  { icon: CalendarCheck, title: 'Smart Attendance', desc: 'Real-time check-in/out with late detection, work hours tracking, and monthly reports.' },
  { icon: Brain, title: 'AI Resume Screening', desc: 'Automated resume analysis and scoring powered by Google Gemini AI.' },
  { icon: Bot, title: 'AI HR Chatbot', desc: 'Intelligent chatbot for employee queries about policies, leave, and payroll.' },
  { icon: BarChart3, title: 'Performance Analytics', desc: 'AI-generated performance summaries with goal tracking and 360° reviews.' },
  { icon: Shield, title: 'Multi-Role Access', desc: 'Role-based dashboards for Admin, Manager, HR, and Employee access levels.' },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-dark-950 overflow-hidden">
      {/* Nav */}
      <nav className="glass sticky top-0 z-50 border-b border-dark-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="text-lg font-bold text-white">FWC HRMS</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-dark-300 hover:text-primary-600 transition-colors px-4 py-2">Sign In</Link>
            <Link to="/register" className="text-sm bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl transition-colors">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-20 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm mb-6">
            <Sparkles size={14} /> Powered by Google Gemini AI
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            The Future of<br />
            <span className="gradient-text">HR Management</span>
          </h1>
          <p className="text-lg sm:text-xl text-dark-400 max-w-2xl mx-auto mb-10">
            AI-powered HRMS that automates recruitment, streamlines attendance, and delivers intelligent insights for modern workplaces.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white px-8 py-3.5 rounded-xl text-lg font-medium transition-all shadow-lg shadow-primary-500/25">
              Start Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 glass-light text-white px-8 py-3.5 rounded-xl text-lg font-medium transition-all hover:bg-dark-800/60">
              Demo Login
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-dark-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Employees Supported', value: '5,000+' },
            { label: 'AI Features', value: '6' },
            { label: 'User Roles', value: '4' },
            { label: 'Uptime', value: '99.9%' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold gradient-text mb-1">{s.value}</p>
              <p className="text-sm text-dark-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything you need</h2>
            <p className="text-dark-400 max-w-lg mx-auto">Comprehensive HRMS with AI superpowers to transform your HR operations.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="glass rounded-2xl p-6 card-hover animate-fadeIn" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mb-4">
                  <f.icon size={22} className="text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-dark-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-20 bg-gradient-to-b from-dark-950 via-primary-900/10 to-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm mb-6">
            <Zap size={14} /> 6 AI-Powered Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">AI That Actually Works</h2>
          <p className="text-dark-400 max-w-xl mx-auto mb-12">From resume screening to attrition prediction, our AI features automate the heavy lifting.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {['Resume Screening', 'HR Chatbot', 'Interview Questions', 'Performance Summary', 'Attrition Prediction', 'JD Generator'].map((f, i) => (
              <div key={i} className="glass rounded-xl p-4 text-center card-hover">
                <Bot size={24} className="text-primary-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="glass rounded-3xl p-10 sm:p-16 glow-primary">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to transform your HR?</h2>
            <p className="text-dark-400 mb-8 max-w-lg mx-auto">Join the future of HR management with our AI-powered platform.</p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-500 text-white px-8 py-3.5 rounded-xl text-lg font-medium shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all">
              Get Started Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-700/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">F</span>
            </div>
            <span className="text-sm text-dark-400">FWC IT Services Pvt. Ltd.</span>
          </div>
          <p className="text-xs text-dark-500">© 2026 FWC HRMS. Built for the FWC AI/ML Hackathon.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
