import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {},
      textColor: {
        primary: {
          main: '#d6dbe0',
        },
        secondary: {
          main: '#b2b6bd',
        },
      },
      backgroundColor: {
        primary: {
          main: '#6989fc',
        },
        paper: {
          main: '#202329',
          light: '#2e343d',
        },
      },
      borderColor: {
        DEFAULT: '#32363f',
        primary: {
          main: '#6989fc',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
