/** @type {import('tailwindcss').Config} */
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
const colors = require("tailwindcss/colors");

const plugin = require('tailwindcss/plugin')

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {
      colors: {
        black: '#000',
        white: '#f5f5f5',
        bgPrimary: '#F7F8F9',
        secondary: '#262626',
        textSecondary: '#878A8D',
        primary: '#FB8E0B ',
        accent: '#34495E',
      },
      fontFamily: {
        sans: ['Figtree', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        updock: ['Updock', 'sans-serif'],
        pt: ['PT Sans', 'sans-serif'],
        nanum: ['Nanum Gothic', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #F0E6FF, #4F46E5)',
      },
    },
  },
  plugins: [
    addVariablesForColors,
    plugin(function({ addUtilities }) {
      addUtilities({
        '.scrollbar-custom': {
          '&::-webkit-scrollbar': {
            width: '0.75rem', 
            
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f3f4f6', 
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#d1d5db', 
          },
          '@media (prefers-color-scheme: dark)': {
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#404040',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#737373', 
            },
            
          },
        },
      })
    }),
    require('preline/plugin'),
  ],
};

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     container: {
//       center: true,
//       padding: "1rem",
//     },

//     colors: {
//       primary: {
//         red: "hsl(14, 86%, 42%)",
//         green: "hsl(159, 69%, 38%)",
//       },
//       rose: {
//         50: "hsl(20, 50%, 98%)",
//         100: "hsl(13, 31%, 94%)",
//         300: "hsl(14, 25%, 72%)",
//         400: "hsl(7, 20%, 60%)",
//         500: "hsl(12, 20%, 44%)",
//         900: "hsl(14, 65%, 9%)",
//       },

//       black: "#000",
//       white: "#fff",
//     },

//     fontSize: {
//       50: ".9rem",
//       100: "1rem",
//       200: "1.125rem",
//       300: "1.25rem",
//       400: "1.375rem",
//       500: "1.5rem",
//       600: "2rem",
//       650: "2.25rem",
//       700: "2.5rem",
//       800: "3rem",
//       900: "3.5rem",
//       950: "4rem",
//       1000: "4.5rem",
//     },

//     fontWeight: {
//       300: "300",
//       400: "400",
//       500: "500",
//       600: "600",
//       700: "700",
//       800: "800",
//       900: "900",
//     },

//     fontFamily: {
//       sans: ["Red Hat Text", "Helvetica", "Arial", "sans-serif"],
//     },

//     screens: {
//       sm: "36rem",
//       md: "48rem",
//       lg: "64rem",
//       xl: "68.75rem",
//       "2xl": "90rem",
//     },

//     extend: {},
//   },
//   plugins: [],
// };
