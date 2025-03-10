/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      colors: {
        // Custom professional green palette
        'green': {
          '50': '#f0f9f1',
          '100': '#dcf0de',
          '200': '#b9e1be',
          '300': '#8ccc95',
          '400': '#5eb06c',
          '500': '#3c914d',
          '600': '#2d743e',
          '700': '#276536',
          '800': '#235530',
          '900': '#1e462a',
        },
        // Custom professional blue palette
        'blue': {
          '50': '#f0f7fc',
          '100': '#dbeaf8',
          '200': '#bed8f1',
          '300': '#92bbe6',
          '400': '#6498d8',
          '500': '#4178c8',
          '600': '#3460af',
          '700': '#2d5091',
          '800': '#284476',
          '900': '#253a61',
        }
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'fadeOut': 'fadeOut 0.3s ease-in-out',
        'fadeInScale': 'fadeInScale 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
} 