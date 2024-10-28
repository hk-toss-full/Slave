/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{html,js,ts,jsx,tsx}',
    './src/**/*.{html,js,ts,jsx,tsx}',
    './src/main.jsx'
  ],
  theme: {
    extend: {
      backgroundColor: {
        'workspace-rgba': 'rgba(249, 237, 255, 0.25)',
        'conversation-rgba': 'rgba(249, 237, 255, 0.08)',
        'convermenu-rgba': 'rgba(29, 28, 29, 0.06)'

      },
    },
  },
  plugins: [],
}

