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
      }
    },
  },
  plugins: [],
} 