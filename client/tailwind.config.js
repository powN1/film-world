/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

const fontFamily = defaultTheme.fontFamily;
fontFamily['sans'] = [
  'Lato', // <-- Roboto is a default sans font now
  'system-ui',
  // <-- you may provide more font fallbacks here
];

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
    fontFamily: fontFamily,
		extend: {
      // Set 'Lato' as default family font for the whole project
			fontFamily: {
				lato: ["'Lato'", "sans-serif"],
			},
		},
	},
	plugins: [],
};
