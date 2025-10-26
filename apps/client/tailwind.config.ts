// apps/client/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../packages/ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'nhls-primary': '#16a34a',
        'nhls-primary-dark': '#15803d',
        'nhls-secondary': '#059669',
        'nhls-accent': '#10b981',
      },
    },
  },
  plugins: [],
};

export default config;