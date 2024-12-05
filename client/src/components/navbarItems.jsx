export const navbarItems = [
	{
		title: "Movies",
		path: "/movies",
		submenu: [
			{ title: "Movies main page", path: "/movies" },
			{ title: "Movies database", path: "/" },
			{ title: "Characters database", path: "/" },
			{ title: "Fandoms database", path: "/" },
			{ title: "News", path: "/" },
			{ title: "Reviews", path: "/" },
		],
	},
	{
		title: "Series",
		path: "/series",
		submenu: [
			{ title: "Series main page", path: "/" },
			{ title: "Series database", path: "/" },
		],
	},
	{
		title: "Games",
		path: "/games",
		submenu: [
			{ title: "Games main page", path: "/" },
			{ title: "Games database", path: "/" },
			{ title: "Games reviews", path: "/" },
		],
	},
	{
		title: "Ranking",
		path: "/ranking",
		submenu: [
			{ title: "New movies ranking", path: "/ranking", category: "movies", subCategory: "new", },
			{ title: "Top movies ranking", path: "/ranking", category: "movies", subCategory: "top 500" },
			{ title: "Top series ranking", path: "/ranking", category: "series", subCategory: "top 500" },
			{ title: "Top actors ranking", path: "/ranking", category: "actors", subCategory: "actors", },
			{ title: "Top movie roles ranking", path: "/ranking", category: "movie roles", subCategory: "male" },
			{ title: "Top serie roles ranking", path: "/ranking", category: "serie roles", subCategory: "male" },
			{ title: "Top games ranking", path: "/ranking", category: "games", subCategory: "top 100" },
		],
	},
	// {
	// 	title: "In cinemas",
	// 	path: "/cinemas",
	// },
	// {
	// 	title: "VOD",
	// 	path: "/vod",
	// },
	// {
	// 	title: "TV Program",
	// 	path: "/tv",
	// 	submenu: [
	// 		{ title: "TV programs", path: "/" },
	// 		{ title: "Top 500 tv programs", path: "/" },
	// 		{ title: "Best programs", path: "/" },
	// 	],
	// },
	// {
	// 	title: "My filmweb",
	// 	path: "/my",
	// },
	{
		title: "Write",
		path: "/write",
		adminOnly: true,
	},
];
