# 🚀 FWC HRMS - AI-Powered HR Management System

FWC HRMS is a modern Human Resource Management System built with the MERN stack and Google Gemini AI.

The platform helps organizations manage employees, attendance, leave requests, payroll, recruitment, and performance reviews while leveraging AI for resume screening, job description generation, employee insights, and HR assistance.

## ✨ Features

* Employee Management
* Attendance Tracking
* Leave Management
* Payroll Management
* Recruitment & Applicant Tracking
* Performance Reviews
* Role-Based Authentication (Admin, HR, Manager, Employee)
* AI Resume Screening
* AI Job Description Generator
* AI Attrition Risk Analysis
* AI HR Policy Chatbot

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Google Gemini AI

## 📂 Project Structure

```bash
FWC-HRMS/
├── client/
├── server/
├── package.json
└── README.md
```

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/nancydeo/app.git
cd app
```

### Install Dependencies

```bash
npm run install-all
```

### Environment Variables

Create a `.env` file inside the `server` folder:

```env
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### Run Development Server

```bash
npm run dev
```

## 🔑 Demo Accounts

| Role     | Email                                       |
| -------- | ------------------------------------------- |
| Admin    | [admin@fwc.com](mailto:admin@fwc.com)       |
| Manager  | [manager@fwc.com](mailto:manager@fwc.com)   |
| HR       | [hr@fwc.com](mailto:hr@fwc.com)             |
| Employee | [employee@fwc.com](mailto:employee@fwc.com) |

Password for all accounts:

```text
password123
```

## 🌐 Deployment

Frontend: https://fwc-hr.vercel.app

Backend: https://fwc-hr.onrender.com

## 🤖 AI Capabilities

* Resume Screening
* Job Description Generation
* Employee Attrition Prediction
* HR Policy Assistant

## 📜 License

This project was developed for the FWC AI/ML Hackathon.
