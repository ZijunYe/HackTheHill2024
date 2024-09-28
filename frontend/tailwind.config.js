/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        pixelify: ['"Pixelify Sans"', "sans-serif"],
      },
      keyframes: {
        moveIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(50px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        move: {
          '0%': { transform: 'translateX(0) scaleX(1)' }, // Normal at the start
          '50%': { transform: 'translateX(calc(100vw - 10rem)) scaleX(1)' }, // Move to the right without flipping
          '51%': { transform: 'translateX(calc(100vw - 10rem)) scaleX(-1)' }, // Flip after reaching the right
          '100%': { transform: 'translateX(0) scaleX(-1)' }, // Move back flipped
        },
      },
      animation: {
        moveIn: 'moveIn 1s ease-out forwards',
        'move-loop': 'move 40s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animated")],
};
