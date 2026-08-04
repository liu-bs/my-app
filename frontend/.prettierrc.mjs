/** @type {import("prettier").Config} */
const base = (await import('../.prettierrc.mjs')).default;

const config = {
  ...base,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
