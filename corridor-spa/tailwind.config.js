/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#004b9e',
          light:   '#1a73e8',
          dark:    '#003580',
        },
        page:    '#f0f2f5',
        sidebar: '#0e2246',
        'sidebar-hover': 'rgba(255,255,255,0.06)',
        'sidebar-active': 'rgba(64,158,255,0.15)',
      },
      fontFamily: {
        sans: [
          '"Helvetica Neue"',
          'Helvetica',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
