/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        appGradient:
          "linear-gradient(106.37deg, #b3d9ff 29.63%, #84c4f3 51.55%, #67bfff 90.85%)",
      },
      colors: {
        sunriseYellow: "var(--sunriseYellow)",
        warmOrange: "var(--warmOrange)",
        deepBlack: "var(--deepBlack)",
        naturalGrey: "var(--naturalGrey)",
        skyBlue: "var(--skyBlue)",
        darkBlue: "var(--darkBlue)",
        boxShadow: "var(--boxShadow)",
        smboxShadow: "var(--smboxShadow)",
        activeItem: "var(--activeItem)",
      },
    },
  },
  plugins: [],
}
