/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        "gradient-cyber-punk": "linear-gradient(to top, #6F35A5, #200122)",
      },
      backgroundImage: {
        "gradient-cyber-punk": "linear-gradient(to top, #6F35A5, #200122)",
      },
      colors: {
        primary: "#040A20",
        primary2: "#141E4333",
        cta: "#11D9C5",
      },
      
    },
  },
  plugins: [],
};
