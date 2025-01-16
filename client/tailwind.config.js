/** @type {import('tailwindcss').Config} */

import defaultTheme from "tailwindcss/defaultTheme"

const fontFamily = defaultTheme.fontFamily;
fontFamily["sans"] = [
	"Lato", //
	"system-ui",
];

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	// safelist: [
	// 	"row-start-1",
	// 	"row-start-2",
	// 	"row-start-3",
	// 	"row-start-4",
	// 	"row-start-5",
	// 	"col-start-1",
	// 	"col-start-2",
	// 	"col-start-3",
	// 	"col-start-4",
	// 	"col-start-5",
	// 	"row-span-1",
	// 	"row-span-2",
	// 	"row-span-3",
	// 	"row-span-4",
	// 	"row-span-5",
	// 	"col-span-1",
	// 	"col-span-2",
	// 	"col-span-3",
	// 	"col-span-4",
	// 	"col-span-5",
	// ],
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
				"16rows70px": "repeat(16, 70px)",
			},
		},
	},
	plugins: [],
};
