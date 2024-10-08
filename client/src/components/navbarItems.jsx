export const navbarItems = [
	{
		title: "Movies",
		path: "/movies",
		submenu: [
			{ title: "Movies main page", path: "/" },
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
			{ title: "New movies ranking", path: "/" },
			{ title: "Top 500 ranking", path: "/" },
			{ title: "Top 500 series", path: "/" },
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
	{
		title: "My filmweb",
		path: "/my",
	},
  {
    title: "Write",
    path: "/write",
    adminOnly: true
  }
];
