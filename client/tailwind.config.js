/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      yellow: "var(--yellow)",
      orange: "var(--orange)",
      black: "var(--black)",
      gray: "var(--gray)",
      blue: "var(--blue)",
      darkBlue: "var(--darkBlue)",
      boxShadow: "var(--boxShadow)",
      smboxShadow: "var(--smboxShadow)",
      activeItem: "var(--activeItem)",
    },
  },
  plugins: [],
}
