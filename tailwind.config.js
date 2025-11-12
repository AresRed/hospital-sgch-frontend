/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors:{
        'bg-celeste':'rgb(0, 119, 200)',
      }
    },
  },
  plugins: [PrimeUI]
}

