import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            DEFAULT: '#00A8E8',
            light: '#38C1F3',
            dark: '#007EA7',
          },
          orange: {
            DEFAULT: '#F26419',
            hover: '#D9530E',
            light: '#F88243',
          },
          cream: {
            DEFAULT: '#F6F7D7',
            light: '#FCFCEF',
          },
          navy: {
            DEFAULT: '#0B192C',
            light: '#1E3E62',
            dark: '#000814',
          },
          bgLight: '#F8FAFC',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-soft': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
