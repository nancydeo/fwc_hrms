# FWC HRMS - AI-Powered HR Management System

FWC HRMS is an AI-powered Human Resource Management System built for the FWC AI/ML Hackathon. It features full employee lifecycle management, daily attendance logging, leaves and payroll tracking, and an integrated AI Hub powered by Google Gemini AI (for chatbot policy assistance, resume screening, JD generation, and performance reviews).

---

## 🚀 Setup and Run Instructions

### 1. Configure the Environment
Create or update the `.env` file in the `server` directory:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```
*Note: We run the backend on port `5001` to avoid the default macOS AirPlay Receiver port conflict on port `5000`.*

### 2. Install Dependencies
Run the install command in the root folder to download packages for both backend and frontend:
```bash
npm run install-all
```

### 3. Seed the Database
Populate your database with initial mock accounts (Admin, HR, Manager, Employee) and logs:
```bash
npm run seed
```

### 4. Start the Application
Run the client and server concurrently in development mode:
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser to view the application.

---

## 📁 File Structure & How It Works

### Backend (`server/`)
*   **[server.js](file:///Users/luckyraj/fwc_project/server/server.js):** The starting point. It initializes Express, sets up middlewares (JSON parsing, CORS), registers API routes, and listens on port `5001`.
*   **[config/db.js](file:///Users/luckyraj/fwc_project/server/config/db.js):** Connects Mongoose to your MongoDB instance using the connection string in your `.env`.
*   **[middleware/auth.js](file:///Users/luckyraj/fwc_project/server/middleware/auth.js):** The security checkpoint. It decrypts JWT headers to verify if a user is logged in (`protect`) and verifies if their role permits them to open an endpoint (`authorize`).
*   **`models/`:** Holds data blueprints. For instance, `User.js` models employee logins/salaries, and `Attendance.js` logs check-ins.
*   **`routes/`:** Holds endpoints. For example, `ai.js` connects the app to Google Gemini, and `attendance.js` controls check-in/out logic.
*   **`seeds/seed.js`:** A script that automatically registers mock employees and logs for instant testing.

### Frontend (`client/`)
*   **`src/App.jsx`:** Controls the routing of the React application, defining public pages (Landing, Login) and protected dashboard pages.
*   **`src/components/layout/`:** Contains layout wrappers like the sidebar navigation (`Sidebar.jsx`) and top header.
*   **`src/pages/`:** Holds individual views (AI Hub, Attendance logs, Employee table, Payroll, Leaves).
*   **`src/utils/api.js`:** The single hub for making network requests using Axios. It automatically attaches user JWT tokens from storage to request headers.

---

## 🔄 Core Workflows

### A. Authentication Workflow
1.  **Register/Login:** The user submits credentials on the login screen.
2.  **JWT Issuance:** The backend validates credentials and returns a JSON Web Token (JWT) containing the user details and role.
3.  **Local Storage:** The frontend saves this token in the browser's `localStorage` (`hrms_user`).
4.  **Authorized Requests:** On page loads, React reads the stored token. Any API call made via `api.js` appends this token to the headers.

### B. Daily Attendance Workflow
1.  **Check-In:** When an employee clicks "Check In", a request goes to `/attendance/check-in`. Mongoose logs the current date and time.
2.  **Late Detection:** If checking in after 10:00 AM, the backend automatically flags the entry status as `"late"`.
3.  **Check-Out:** Clicking "Check Out" updates the record, calculates the exact work hours elapsed, and saves it.

### C. Gemini AI Chatbot Workflow
1.  **Submission:** The user types a question in the AI Hub chatbot (e.g., *"How many sick leaves do I get?"*).
2.  **Context Construction:** The server combines company guidelines (12 sick leaves, working hours) with the user query into a single string.
3.  **Inference:** This string is sent to `gemini-1.5-flash` via the `@google/generative-ai` SDK.
4.  **Response rendering:** The parsed text reply is returned and displayed in the chat window.

---

# -Gitbash
