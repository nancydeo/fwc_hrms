import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, CalendarCheck, CalendarOff, Wallet,
  Briefcase, Star, Bot, Building2, ChevronLeft, LogOut, X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, getRoleName } = useAuth();
  const location = useLocation();

  const allLinks = [
    { path: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin'] },
    { path: '/dashboard/manager', label: 'Dashboard', icon: LayoutDashboard, roles: ['senior_manager'] },
    { path: '/dashboard/hr', label: 'Dashboard', icon: LayoutDashboard, roles: ['hr_recruiter'] },
    { path: '/dashboard/employee', label: 'Dashboard', icon: LayoutDashboard, roles: ['employee'] },
    { path: '/employees', label: 'Employees', icon: Users, roles: ['admin', 'senior_manager', 'hr_recruiter'] },
    { path: '/departments', label: 'Departments', icon: Building2, roles: ['admin', 'senior_manager'] },
    { path: '/attendance', label: 'Attendance', icon: CalendarCheck, roles: ['admin', 'senior_manager', 'hr_recruiter', 'employee'] },
    { path: '/leave', label: 'Leave', icon: CalendarOff, roles: ['admin', 'senior_manager', 'hr_recruiter', 'employee'] },
    { path: '/payroll', label: 'Payroll', icon: Wallet, roles: ['admin', 'hr_recruiter', 'employee'] },
    { path: '/recruitment', label: 'Recruitment', icon: Briefcase, roles: ['admin', 'hr_recruiter'] },
    { path: '/performance', label: 'Performance', icon: Star, roles: ['admin', 'senior_manager', 'hr_recruiter', 'employee'] },
    { path: '/ai', label: 'AI Hub', icon: Bot, roles: ['admin', 'senior_manager', 'hr_recruiter'] },
  ];

  const links = allLinks.filter(l => l.roles.includes(user?.role));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="sidebar-overlay md:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-dark-900/95 backdrop-blur-xl
        border-r border-dark-700/50 flex flex-col transition-transform duration-300
        md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-dark-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">FWC HRMS</h1>
                {/* <p className="text-xs text-dark-400">AI-Powered</p> */}
              </div>
            </div>
            <button onClick={onClose} className="md:hidden text-dark-400 hover:text-primary-600 hover:bg-dark-800/40 p-1.5 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                ${isActive ? 'active bg-primary-500/15 text-primary-400' : 'text-dark-300 hover:text-primary-600 hover:bg-dark-800/40'}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-dark-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-dark-400 truncate">{getRoleName(user?.role)}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-sm text-dark-400 hover:text-danger-400 hover:bg-danger-400/10 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
