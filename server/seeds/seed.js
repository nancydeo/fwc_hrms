import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Department from '../models/Department.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import JobPosting from '../models/JobPosting.js';
import Application from '../models/Application.js';
import Performance from '../models/Performance.js';
import Payroll from '../models/Payroll.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB');

    // Clear all
    await Promise.all([
      User.deleteMany({}), Department.deleteMany({}), Attendance.deleteMany({}),
      Leave.deleteMany({}), JobPosting.deleteMany({}), Application.deleteMany({}),
      Performance.deleteMany({}), Payroll.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create departments
    const departments = await Department.insertMany([
      { name: 'Engineering', description: 'Software Development & Engineering', budget: 5000000 },
      { name: 'Human Resources', description: 'HR Operations & Talent Acquisition', budget: 2000000 },
      { name: 'Marketing', description: 'Digital Marketing & Brand Management', budget: 3000000 },
      { name: 'Finance', description: 'Financial Planning & Accounting', budget: 1500000 },
      { name: 'Design', description: 'UI/UX & Product Design', budget: 2500000 },
      { name: 'Operations', description: 'Business Operations & Support', budget: 1800000 },
      { name: 'Data Science', description: 'AI/ML & Data Analytics', budget: 4000000 },
      { name: 'Sales', description: 'Sales & Business Development', budget: 3500000 },
    ]);
    console.log('🏢 Created departments');

    // Create users
    const password = await bcrypt.hash('password123', 12);
    const users = await User.insertMany([
      // Admin
      { name: 'Rajesh Kumar', email: 'admin@fwc.com', password, role: 'admin', employeeId: 'FWC0001', department: departments[0]._id, designation: 'CTO', salary: 250000, phone: '+91 9876543210', skills: ['Leadership', 'Strategy', 'Technology'], status: 'active', dateOfJoining: new Date('2020-01-15') },
      // Senior Managers
      { name: 'Priya Sharma', email: 'manager@fwc.com', password, role: 'senior_manager', employeeId: 'FWC0002', department: departments[0]._id, designation: 'Engineering Manager', salary: 180000, phone: '+91 9876543211', skills: ['Team Management', 'Agile', 'Node.js'], status: 'active', dateOfJoining: new Date('2021-03-10') },
      { name: 'Amit Patel', email: 'manager2@fwc.com', password, role: 'senior_manager', employeeId: 'FWC0003', department: departments[2]._id, designation: 'Marketing Director', salary: 160000, phone: '+91 9876543212', skills: ['Marketing Strategy', 'Brand Management', 'Analytics'], status: 'active', dateOfJoining: new Date('2021-06-20') },
      // HR Recruiters
      { name: 'Sneha Gupta', email: 'hr@fwc.com', password, role: 'hr_recruiter', employeeId: 'FWC0004', department: departments[1]._id, designation: 'Senior HR Manager', salary: 120000, phone: '+91 9876543213', skills: ['Recruitment', 'Employee Relations', 'HRIS'], status: 'active', dateOfJoining: new Date('2021-08-05') },
      { name: 'Ravi Verma', email: 'hr2@fwc.com', password, role: 'hr_recruiter', employeeId: 'FWC0005', department: departments[1]._id, designation: 'HR Recruiter', salary: 80000, phone: '+91 9876543214', skills: ['Talent Acquisition', 'Screening', 'Onboarding'], status: 'active', dateOfJoining: new Date('2022-01-15') },
      // Employees
      { name: 'Ananya Singh', email: 'employee@fwc.com', password, role: 'employee', employeeId: 'FWC0006', department: departments[0]._id, designation: 'Full Stack Developer', salary: 95000, phone: '+91 9876543215', skills: ['React', 'Node.js', 'MongoDB', 'Python'], status: 'active', dateOfJoining: new Date('2022-04-10') },
      { name: 'Vikram Reddy', email: 'vikram@fwc.com', password, role: 'employee', employeeId: 'FWC0007', department: departments[0]._id, designation: 'Backend Developer', salary: 85000, phone: '+91 9876543216', skills: ['Java', 'Spring Boot', 'PostgreSQL'], status: 'active', dateOfJoining: new Date('2022-06-15') },
      { name: 'Meera Nair', email: 'meera@fwc.com', password, role: 'employee', employeeId: 'FWC0008', department: departments[4]._id, designation: 'UI/UX Designer', salary: 90000, phone: '+91 9876543217', skills: ['Figma', 'Adobe XD', 'CSS', 'User Research'], status: 'active', dateOfJoining: new Date('2022-07-20') },
      { name: 'Arjun Kapoor', email: 'arjun@fwc.com', password, role: 'employee', employeeId: 'FWC0009', department: departments[6]._id, designation: 'Data Scientist', salary: 110000, phone: '+91 9876543218', skills: ['Python', 'TensorFlow', 'Machine Learning', 'NLP'], status: 'active', dateOfJoining: new Date('2022-09-01') },
      { name: 'Kavita Joshi', email: 'kavita@fwc.com', password, role: 'employee', employeeId: 'FWC0010', department: departments[2]._id, designation: 'Marketing Specialist', salary: 70000, phone: '+91 9876543219', skills: ['SEO', 'Content Marketing', 'Social Media'], status: 'active', dateOfJoining: new Date('2023-01-10') },
      { name: 'Rahul Mehta', email: 'rahul@fwc.com', password, role: 'employee', employeeId: 'FWC0011', department: departments[3]._id, designation: 'Financial Analyst', salary: 75000, phone: '+91 9876543220', skills: ['Excel', 'Financial Modeling', 'Power BI'], status: 'active', dateOfJoining: new Date('2023-03-15') },
      { name: 'Divya Krishnan', email: 'divya@fwc.com', password, role: 'employee', employeeId: 'FWC0012', department: departments[7]._id, designation: 'Sales Executive', salary: 65000, phone: '+91 9876543221', skills: ['Sales', 'CRM', 'Negotiation'], status: 'active', dateOfJoining: new Date('2023-05-20') },
      { name: 'Sanjay Iyer', email: 'sanjay@fwc.com', password, role: 'employee', employeeId: 'FWC0013', department: departments[5]._id, designation: 'Operations Manager', salary: 100000, phone: '+91 9876543222', skills: ['Operations', 'Project Management', 'Six Sigma'], status: 'active', dateOfJoining: new Date('2022-11-10') },
      { name: 'Neha Agarwal', email: 'neha@fwc.com', password, role: 'employee', employeeId: 'FWC0014', department: departments[0]._id, designation: 'Frontend Developer', salary: 82000, phone: '+91 9876543223', skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'], status: 'active', dateOfJoining: new Date('2023-07-01') },
      { name: 'Rohan Das', email: 'rohan@fwc.com', password, role: 'employee', employeeId: 'FWC0015', department: departments[6]._id, designation: 'ML Engineer', salary: 105000, phone: '+91 9876543224', skills: ['PyTorch', 'Deep Learning', 'Computer Vision'], status: 'active', dateOfJoining: new Date('2023-02-15') },
    ]);
    console.log('👥 Created users');

    // Update department heads
    await Department.findByIdAndUpdate(departments[0]._id, { head: users[1]._id, employeeCount: 5 });
    await Department.findByIdAndUpdate(departments[1]._id, { head: users[3]._id, employeeCount: 2 });
    await Department.findByIdAndUpdate(departments[2]._id, { head: users[2]._id, employeeCount: 2 });
    await Department.findByIdAndUpdate(departments[3]._id, { head: users[0]._id, employeeCount: 1 });
    await Department.findByIdAndUpdate(departments[4]._id, { head: users[0]._id, employeeCount: 1 });
    await Department.findByIdAndUpdate(departments[5]._id, { head: users[0]._id, employeeCount: 1 });
    await Department.findByIdAndUpdate(departments[6]._id, { head: users[0]._id, employeeCount: 2 });
    await Department.findByIdAndUpdate(departments[7]._id, { head: users[0]._id, employeeCount: 1 });

    // Create attendance for last 30 days
    const attendanceRecords = [];
    for (let d = 29; d >= 0; d--) {
      const date = new Date(); date.setDate(date.getDate() - d); date.setHours(0, 0, 0, 0);
      if (date.getDay() === 0 || date.getDay() === 6) continue; // Skip weekends
      for (const user of users) {
        const rand = Math.random();
        let status = 'present', checkIn = new Date(date), checkOut = new Date(date);
        checkIn.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
        checkOut.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
        if (rand < 0.05) status = 'absent';
        else if (rand < 0.1) status = 'late';
        else if (rand < 0.15) status = 'half_day';
        const workHours = status === 'absent' ? 0 : status === 'half_day' ? 4 : ((checkOut - checkIn) / 3600000).toFixed(2);
        attendanceRecords.push({ user: user._id, date, checkIn: status === 'absent' ? null : checkIn, checkOut: status === 'absent' ? null : checkOut, status, workHours });
      }
    }
    await Attendance.insertMany(attendanceRecords);
    console.log(`📅 Created ${attendanceRecords.length} attendance records`);

    // Create leaves
    const leaveRecords = [];
    const leaveTypes = ['sick', 'casual', 'earned'];
    for (const user of users.slice(5)) {
      for (let i = 0; i < 3; i++) {
        const start = new Date(); start.setDate(start.getDate() - Math.floor(Math.random() * 90));
        const end = new Date(start); end.setDate(end.getDate() + Math.floor(Math.random() * 3) + 1);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const statuses = ['approved', 'approved', 'pending', 'rejected'];
        leaveRecords.push({
          user: user._id, type: leaveTypes[i % 3], startDate: start, endDate: end, days,
          reason: ['Family emergency', 'Medical appointment', 'Personal work', 'Vacation', 'Festival'][Math.floor(Math.random() * 5)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          approvedBy: users[3]._id,
        });
      }
    }
    await Leave.insertMany(leaveRecords);
    console.log(`🏖️  Created ${leaveRecords.length} leave records`);

    // Create job postings
    const jobs = await JobPosting.insertMany([
      { title: 'Senior React Developer', department: departments[0]._id, description: 'We are looking for an experienced React developer to join our frontend team.', requirements: ['5+ years experience', 'React, Redux', 'TypeScript', 'REST APIs'], skills: ['React', 'TypeScript', 'Redux', 'CSS', 'Git'], experience: '5-7 years', salary: { min: 1500000, max: 2500000 }, status: 'open', postedBy: users[3]._id, applicationsCount: 5 },
      { title: 'Python ML Engineer', department: departments[6]._id, description: 'Join our data science team to build cutting-edge ML models.', requirements: ['3+ years ML experience', 'Python', 'TensorFlow/PyTorch', 'Strong math background'], skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Docker'], experience: '3-5 years', salary: { min: 1800000, max: 3000000 }, status: 'open', postedBy: users[3]._id, applicationsCount: 3 },
      { title: 'UI/UX Designer', department: departments[4]._id, description: 'Create beautiful, intuitive user experiences for our products.', requirements: ['3+ years design experience', 'Figma/Adobe XD', 'User research', 'Design systems'], skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'], experience: '3-5 years', salary: { min: 1200000, max: 2000000 }, status: 'open', postedBy: users[3]._id, applicationsCount: 4 },
      { title: 'DevOps Engineer', department: departments[0]._id, description: 'Manage our cloud infrastructure and CI/CD pipelines.', requirements: ['AWS/GCP experience', 'Docker', 'Kubernetes', 'CI/CD'], skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'], experience: '4-6 years', salary: { min: 1600000, max: 2800000 }, status: 'open', postedBy: users[3]._id, applicationsCount: 2 },
    ]);
    console.log('💼 Created job postings');

    // Create sample applications
    const sampleApps = [
      { candidateName: 'Arun Sharma', candidateEmail: 'arun.sharma@email.com', phone: '+91 8765432100', experience: '6 years', skills: ['React', 'TypeScript', 'Node.js', 'Redux'], education: 'B.Tech CS - IIT Delhi', aiScore: 87, aiSummary: 'Strong frontend candidate with excellent React experience.', status: 'shortlisted' },
      { candidateName: 'Pooja Desai', candidateEmail: 'pooja.desai@email.com', phone: '+91 8765432101', experience: '4 years', skills: ['React', 'JavaScript', 'CSS', 'HTML'], education: 'MCA - Pune University', aiScore: 72, aiSummary: 'Good mid-level candidate, needs TypeScript experience.', status: 'screening' },
      { candidateName: 'Karthik M', candidateEmail: 'karthik.m@email.com', phone: '+91 8765432102', experience: '7 years', skills: ['React', 'Angular', 'TypeScript', 'AWS'], education: 'B.Tech - NIT Trichy', aiScore: 92, aiSummary: 'Excellent candidate with full-stack experience and strong fundamentals.', status: 'interview' },
      { candidateName: 'Swati Roy', candidateEmail: 'swati.roy@email.com', phone: '+91 8765432103', experience: '3 years', skills: ['Python', 'TensorFlow', 'NLP', 'Data Analysis'], education: 'M.Tech AI/ML - IIIT Hyderabad', aiScore: 85, aiSummary: 'Strong ML fundamentals with relevant project experience.', status: 'shortlisted' },
      { candidateName: 'Deep Patel', candidateEmail: 'deep.patel@email.com', phone: '+91 8765432104', experience: '5 years', skills: ['Python', 'PyTorch', 'Computer Vision', 'MLOps'], education: 'MS CS - IISc Bangalore', aiScore: 95, aiSummary: 'Outstanding candidate with published papers and industry experience.', status: 'offered' },
    ];
    const appDocs = sampleApps.map((app, i) => ({ ...app, jobPosting: jobs[i < 3 ? 0 : 1]._id, resumeText: `Professional with ${app.experience} of experience in ${app.skills.join(', ')}. Education: ${app.education}.` }));
    await Application.insertMany(appDocs);
    console.log('📄 Created sample applications');

    // Create performance reviews
    const perfRecords = [];
    for (const user of users.slice(5, 12)) {
      perfRecords.push({
        user: user._id, reviewer: users[1]._id, period: 'Q1 2026',
        ratings: { productivity: 3 + Math.floor(Math.random() * 2), quality: 3 + Math.floor(Math.random() * 2), communication: 2 + Math.floor(Math.random() * 3), teamwork: 3 + Math.floor(Math.random() * 2), leadership: 2 + Math.floor(Math.random() * 3) },
        overallRating: (3 + Math.random() * 1.5).toFixed(1),
        goals: [{ title: 'Complete project deliverables', status: 'completed' }, { title: 'Learn new technology', status: 'in_progress' }, { title: 'Mentor junior developers', status: 'pending' }],
        strengths: 'Strong technical skills and good team player.',
        improvements: 'Could improve on documentation and time management.',
        status: 'submitted',
      });
    }
    await Performance.insertMany(perfRecords);
    console.log('⭐ Created performance reviews');

    // Create payroll
    const payrollRecords = [];
    const months = [1, 2, 3, 4, 5];
    for (const user of users) {
      for (const month of months) {
        const basic = Math.round(user.salary * 0.5);
        const hra = Math.round(user.salary * 0.2);
        const allowances = Math.round(user.salary * 0.15);
        const tax = Math.round(user.salary * 0.1);
        const deductions = Math.round(user.salary * 0.05);
        const net = user.salary - tax - deductions;
        payrollRecords.push({
          user: user._id, month, year: 2026, basicSalary: basic, hra, allowances, deductions, tax, netSalary: net,
          status: month < 5 ? 'paid' : 'pending', paidDate: month < 5 ? new Date(2026, month - 1, 28) : null,
        });
      }
    }
    await Payroll.insertMany(payrollRecords);
    console.log(`💰 Created ${payrollRecords.length} payroll records`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login Credentials (password for all: password123):');
    console.log('   Admin:          admin@fwc.com');
    console.log('   Senior Manager: manager@fwc.com');
    console.log('   HR Recruiter:   hr@fwc.com');
    console.log('   Employee:       employee@fwc.com');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
