/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#f0f7ff', 100: '#e0effe', 200: '#bae0fd', 300: '#7cc7fb', 400: '#38a9f8', 500: '#0f8df2', 600: '#0f5fc2', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e' },
        accent: { 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7' },
        success: { 400: '#4ade80', 500: '#22c55e' },
        warning: { 400: '#facc15', 500: '#eab308' },
        danger: { 400: '#f87171', 500: '#ef4444' },
        dark: { 50: '#090d16', 100: '#0f172a', 200: '#1e293b', 300: '#334155', 400: '#64748b', 500: '#94a3b8', 600: '#cbd5e1', 700: '#e2e8f0', 800: '#f8fafc', 900: '#ffffff', 950: '#ffffff' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
