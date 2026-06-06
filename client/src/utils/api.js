import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('hrms_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hrms_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

// Employees
export const getEmployees = (params) => API.get('/employees', { params });
export const getEmployee = (id) => API.get(`/employees/${id}`);
export const updateEmployee = (id, data) => API.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);

// Attendance
export const checkIn = () => API.post('/attendance/check-in');
export const checkOut = () => API.post('/attendance/check-out');
export const getAttendance = (params) => API.get('/attendance', { params });
export const getTodayAttendance = () => API.get('/attendance/today');

// Leave
export const applyLeave = (data) => API.post('/leave', data);
export const getLeaves = (params) => API.get('/leave', { params });
export const approveLeave = (id, data) => API.put(`/leave/${id}/approve`, data);
export const rejectLeave = (id, data) => API.put(`/leave/${id}/reject`, data);
export const getLeaveBalance = () => API.get('/leave/balance');

// Departments
export const getDepartments = () => API.get('/departments');
export const createDepartment = (data) => API.post('/departments', data);

// Payroll
export const getPayroll = (params) => API.get('/payroll', { params });
export const generatePayroll = (data) => API.post('/payroll/generate', data);
export const markPaid = (id) => API.put(`/payroll/${id}/pay`);

// Recruitment
export const getJobs = (params) => API.get('/recruitment/jobs', { params });
export const createJob = (data) => API.post('/recruitment/jobs', data);
export const updateJob = (id, data) => API.put(`/recruitment/jobs/${id}`, data);
export const getApplications = (params) => API.get('/recruitment/applications', { params });
export const createApplication = (data) => API.post('/recruitment/applications', data);
export const updateApplicationStatus = (id, data) => API.put(`/recruitment/applications/${id}/status`, data);

// Performance
export const getPerformanceReviews = (params) => API.get('/performance', { params });
export const createPerformanceReview = (data) => API.post('/performance', data);

// Dashboard
export const getDashboardStats = () => API.get('/dashboard/stats');
export const getRecentActivities = () => API.get('/dashboard/recent-activities');

// AI
export const screenResume = (data) => API.post('/ai/screen-resume', data);
export const chatWithAI = (data) => API.post('/ai/chatbot', data);
export const generateInterviewQuestions = (data) => API.post('/ai/interview-questions', data);
export const generatePerformanceSummary = (data) => API.post('/ai/performance-summary', data);
export const predictAttrition = (data) => API.post('/ai/attrition-risk', data);
export const generateJD = (data) => API.post('/ai/generate-jd', data);

export default API;
