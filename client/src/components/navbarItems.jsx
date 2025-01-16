export const navbarItems = [
	{
		title: "Movies",
		path: "/movies",
		submenu: [
			{ title: "Movies main page", path: "/movies" },
			// { title: "Movies database", path: "/" },
			{ title: "Characters database", path: "/" },
			// { title: "Fandoms database", path: "/" },
			{ title: "Articles", path: "/articles", category: "movies" },
			{ title: "Reviews", path: "/reviews", category: "movies" },
		],
	},
	{
		title: "Series",
		path: "/series",
		submenu: [
			{ title: "Series main page", path: "/series" },
			// { title: "Series database", path: "/" },
			{ title: "Articles", path: "/articles", category: "series" },
			{ title: "Reviews", path: "/reviews", category: "series" },
		],
	},
	{
		title: "Games",
		path: "/games",
		submenu: [
			{ title: "Games main page", path: "/games" },
			// { title: "Games database", path: "/" },
			{ title: "Articles", path: "/articles", category: "games" },
			{ title: "Reviews", path: "/reviews", category: "games" },
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
