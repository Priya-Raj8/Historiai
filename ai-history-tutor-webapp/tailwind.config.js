/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode
  theme: {
    extend: {
      colors: {
        // Dark mode color palette
        dark: {
          primary: '#121212', // Dark gray (primary background)
          secondary: '#1E1E1E', // Slightly lighter gray (secondary background)
          text: {
            primary: '#FFFFFF', // White (primary text)
            secondary: '#B3B3B3', // Light gray (secondary text)
          },
        },
        accent: {
          primary: '#7B68EE', // Medium slate blue (primary accent)
          secondary: '#FF6B6B', // Light red (secondary accent)
        },
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'roboto-mono': ['Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
