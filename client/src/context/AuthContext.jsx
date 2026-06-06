import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const addNotification = (notif) => {
    const newNotif = {
      id: Date.now() + Math.random(),
      time: 'Just now',
      unread: true,
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Trigger toast popup
    toast(
      (t) => (
        <div className="flex flex-col text-left">
          <span className="font-semibold text-xs text-primary-600 uppercase tracking-wider">
            {newNotif.type === 'success' ? '⚡ Success' : newNotif.type === 'warning' ? '⚠️ Attention' : newNotif.type === 'error' ? '🚨 Alert' : '📢 Update'}
          </span>
          <span className="font-bold text-sm text-dark-100 mt-0.5">{newNotif.title}</span>
          <span className="text-xs text-dark-400 mt-0.5">{newNotif.message}</span>
        </div>
      ),
      {
        duration: 4000,
        style: {
          background: '#ffffff',
          color: '#1e293b',
          border: '1px solid #0f5fc220',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(15, 95, 194, 0.1)',
          padding: '12px'
        }
      }
    );
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, unread: false }))
    );
    toast.success('All notifications marked as read', { duration: 1500 });
  };

  useEffect(() => {
    const stored = localStorage.getItem('hrms_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem('hrms_user');
      }
    }
    setLoading(false);
  }, []);

  // Setup notifications when user logs in
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    // Set up role-specific initial notifications
    let initialList = [];
    if (user.role === 'employee') {
      initialList = [
        { id: 1, title: 'Leave Request Approved', message: 'Your casual leave request for June 10 has been approved.', time: '10m ago', type: 'success', unread: true },
        { id: 2, title: 'Payslip Available', message: 'Your payslip for May 2026 is now ready for download.', time: '1h ago', type: 'info', unread: true },
        { id: 3, title: 'Clock-out Reminder', message: 'Please remember to check out at the end of your shift today.', time: '4h ago', type: 'warning', unread: false }
      ];
    } else {
      initialList = [
        { id: 1, title: 'New Application', message: 'Sarah Jenkins applied for Senior Developer. AI Score: 88%', time: '5m ago', type: 'info', unread: true },
        { id: 2, title: 'Leave Request', message: 'Amit Patel requested 3 days of medical leave.', time: '20m ago', type: 'warning', unread: true },
        { id: 3, title: 'Late Attendance Alert', message: 'Vikram Singh checked in at 10:15 AM today.', time: '1h ago', type: 'error', unread: false }
      ];
    }
    setNotifications(initialList);

    // Dynamic simulator for new notifications arriving
    const interval = setInterval(() => {
      const templates = user.role === 'employee' ? [
        { title: 'New System Announcement', message: 'The Company Townhall is scheduled for this Friday at 4:00 PM.', type: 'info' },
        { title: 'Performance Appraisal', message: 'Your self-evaluation window is open. Please complete by next Friday.', type: 'warning' },
        { title: 'Holiday Announcement', message: 'The office will remain closed on Friday, June 19 for Eid-al-Adha.', type: 'success' },
      ] : [
        { title: 'New Candidate Applied', message: 'Neha Sharma applied for QA Engineer. AI Score: 85%', type: 'info' },
        { title: 'Employee Late Alert', message: 'Pooja Roy checked in late today at 10:32 AM.', type: 'error' },
        { title: 'JD Approved', message: 'AI Job Description for Devops Lead has been generated and approved.', type: 'success' },
        { title: 'Leave Approval Pending', message: 'Suresh Kumar\'s leave application is pending review for 3 days.', type: 'warning' }
      ];

      const random = templates[Math.floor(Math.random() * templates.length)];
      addNotification(random);
    }, 45000); // simulation interval: 45 seconds

    return () => clearInterval(interval);
  }, [user]);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('hrms_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hrms_user');
  };

  const getRoleName = (role) => {
    const names = {
      admin: 'Management Admin',
      senior_manager: 'Senior Manager',
      hr_recruiter: 'HR Recruiter',
      employee: 'Employee',
    };
    return names[role] || role;
  };

  const getDashboardPath = (role) => {
    const paths = {
      admin: '/dashboard/admin',
      senior_manager: '/dashboard/manager',
      hr_recruiter: '/dashboard/hr',
      employee: '/dashboard/employee',
    };
    return paths[role] || '/dashboard/employee';
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loginUser,
      logout,
      getRoleName,
      getDashboardPath,
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead
    }}>
      {children}
    </AuthContext.Provider>
  );
};
