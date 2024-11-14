const {nextui} = require('@nextui-org/theme');
// tailwind.config.js
module.exports = {
  content: [
    "./node_modules/@nextui-org/theme/dist/components/(avatar|dropdown|user|menu|divider|popover|button|ripple|spinner).js"
],
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'class'
  theme: {
    extend: {
      colors: {
        foreground: 'var(--foreground-rgb)',
        backgroundStart: 'var(--background-start-rgb)',
        backgroundEnd: 'var(--background-end-rgb)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [nextui()],
};
