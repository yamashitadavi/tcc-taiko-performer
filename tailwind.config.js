/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: [
    {
      pattern: /checkbox-+/, 
    },
    {
      pattern: /input-+/, 
    },
    {
      pattern: /file-input-+/, 
    },
  ],
  theme: {
    extend: {}
  },
  daisyui: {themes: ['dim', 'nord']},
  plugins: [require("daisyui")]
};