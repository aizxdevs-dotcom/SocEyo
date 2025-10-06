/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",        // every App‑Router file
    "./components/**/*.{js,ts,jsx,tsx}", // all shared components
    "./pages/**/*.{js,ts,jsx,tsx}",      // optional: legacy pages dir
  ],
  theme: { extend: {} },
  plugins: [],
};