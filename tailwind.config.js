/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#FFE66D',
        surface: '#FFF5F5',
        background: '#FAFAFA',
        success: '#95E1D3',
        warning: '#F4A261',
        error: '#EE6C4D',
        info: '#74C0FC',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: { 
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], 
        heading: ['Poppins', 'ui-sans-serif', 'system-ui'] 
      }
    },
  },
  plugins: [],
}