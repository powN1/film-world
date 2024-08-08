/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

const fontFamily = defaultTheme.fontFamily;
fontFamily["sans"] = [
	"Lato", // <-- Roboto is a default sans font now
	"system-ui",
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
				sansNarrow: ["PT Sans Narrow", "sans-serif"],
			},
			keyframes: {
				slide: {
					"0%, 100%": { height: "fit-content", visibility: "visible" },
					"100%, 0%": { height: "0", visibility: "hidden" },
				},
			},
			animation: {
				slide: "slide 1s ease-in-out infinite",
			},
		},
	},
	plugins: [],
};
