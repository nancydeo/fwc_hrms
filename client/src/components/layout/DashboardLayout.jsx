import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, Search } from 'lucide-react';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, getRoleName, notifications, unreadCount, markAsRead, markAllAsRead } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    if (user?.role === 'employee') {
      navigate(`/attendance?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(`/employees?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleNotificationClick = (id) => {
    markAsRead(id);
    setNotificationsOpen(false);
    
    // Contextual routing based on user role
    if (user?.role === 'employee') {
      if (location.pathname !== '/attendance' && location.pathname !== '/leave') {
        navigate('/attendance');
      }
    } else {
      if (location.pathname !== '/employees') {
        navigate('/employees');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-dark-950">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 md:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 glass border-b border-dark-700/50">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-dark-300 hover:text-primary-600 hover:bg-dark-800 p-1.5 rounded-lg transition-colors"
              >
                <Menu size={22} />
              </button>
              
              <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center gap-2 bg-dark-800/60 rounded-xl px-3 py-2 border border-dark-700/50 w-64">
                <Search size={16} className="text-dark-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm text-dark-200 placeholder-dark-400 outline-none w-full font-medium"
                />
              </form>
            </div>

            <div className="flex items-center gap-3">
              {/* Notification Popover */}
              <div className="relative">
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-xl text-dark-400 hover:text-primary-600 hover:bg-dark-800 transition-colors"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
                  )}
                </button>

                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                    
                    <div className="absolute right-0 mt-2 w-80 max-h-[400px] overflow-hidden glass rounded-2xl shadow-xl z-50 animate-fadeIn">
                      <div className="p-4 border-b border-dark-700/50 flex items-center justify-between bg-dark-800/20">
                        <h4 className="text-sm font-semibold text-dark-100">Notifications</h4>
                        {unreadCount > 0 && (
                          <button 
                            onClick={() => {
                              markAllAsRead();
                              setNotificationsOpen(false);
                            }}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="overflow-y-auto max-h-[300px] divide-y divide-dark-700/30">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-dark-400 text-xs">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              onClick={() => handleNotificationClick(n.id)}
                              className={`p-3.5 hover:bg-dark-800/40 transition-colors cursor-pointer text-left flex items-start gap-3 ${n.unread ? 'bg-primary-500/5 font-medium' : ''}`}
                            >
                              <div className="mt-0.5 shrink-0 text-sm">
                                {n.type === 'success' ? '✅' : n.type === 'warning' ? '⚠️' : n.type === 'error' ? '❌' : '📢'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <p className={`text-xs font-semibold truncate ${n.unread ? 'text-dark-100 font-bold' : 'text-dark-300'}`}>
                                    {n.title}
                                  </p>
                                  <span className="text-[10px] text-dark-400 shrink-0">{n.time}</span>
                                </div>
                                <p className="text-xs text-dark-400 mt-0.5 line-clamp-2 leading-relaxed">
                                  {n.message}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-dark-700/50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">{user?.name?.charAt(0)?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-100 leading-tight">{user?.name}</p>
                  <p className="text-xs text-dark-400">{getRoleName(user?.role)}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-4 md:p-6 animate-fadeIn">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
