module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        'primary': '#3498db',
        'secondary': '#f1c40f',
      },
      gradients: {
        'primary': 'linear-gradient(90deg, #3498db, #f1c40f)',
      },
    },
  },
  variants: {},
  plugins: [],
}