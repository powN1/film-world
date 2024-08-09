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
			transitionTimingFunction: {
				sliding: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
			},
			gridTemplateRows: {
				// Simple 16 row grid
				'16rows70px': "repeat(17, 70px)",

			},
		},
	},
	plugins: [],
};
