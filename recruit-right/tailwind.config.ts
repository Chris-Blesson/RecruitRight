import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        brown: {
          50: "#fdf8f6",
          100: "#f2e8e5",
          //Light palette - https://colorhunt.co/palette/fdf7e4faeed1ded0b6bbab8c
          200: "#FDF7E4",
          300: "#FAEED1",
          400: "#DED0B6",
          500: "#BBAB8C",
          //Dark palette - https://colorhunt.co/palette/884a39c38154ffc26ff9e0bb
          600: "#F9E0BB",
          700: "#FFC26F",
          800: "#C38154",
          900: "#884A39",
        },
      },
    },
  },
  plugins: [],
};
export default config;
