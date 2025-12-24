import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-gold': '#D4AF37',
        'deep-red': '#8B0000',
        'rich-green': '#006400',
        'cream': '#FFFDD0',
        'dark-brown': '#3E2723',
        'light-gold': '#FFF8DC',
      },
      fontFamily: {
        serif: ['Noto Serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;

