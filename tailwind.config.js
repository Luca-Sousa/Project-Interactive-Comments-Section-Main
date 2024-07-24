/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        colorModerateBlue: 'hsl(238, 40%, 52%)',
        colorSoftRed: 'hsl(358, 79%, 66%)',
        colorLightGrayishBlue: 'hsl(239, 57%, 85%)',
        colorred: 'hsl(357, 100%, 86%)',
        colorDarkBlue: 'hsl(212, 24%, 26%)',
        colorGrayishBlue: 'hsl(211, 10%, 45%)',
        colorLightGray: 'hsl(223, 19%, 93%)',
        colorVeryLightGray: 'hsl(228, 33%, 97%)',
        colorWhite: 'hsl(0, 0%, 100%)',
      },
      fontFamily: {
        Rubik: 'Rubik',
      },
    },
  },
  plugins: [],
}

