import { Link, NavLink } from "react-router-dom";
import SingleNews from "../common/SingleNews";
import { useState, useEffect, useContext } from "react";
import { DataContext } from "../App";
import axios from "axios";

const categories = [
	{ title: "Suggested" },
	{ title: "Movies" },
	{ title: "Series" },
	{ title: "Games" },
	{ title: "Box office" },
	{ title: "Rankings" },
	{ title: "Podcasts" },
	{ title: "Videos" },
];

const LastestNews = () => {
	const [currentCategory, setCurrentCategory] = useState("suggested");
	const [latestNews, setLatestNews] = useState([]);

	const fetchLatestNews = async (category) => {
		const queryObj = { type: "latest", count: 15 };
		if (category) queryObj.category = category;

		await axios
			.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-articles", queryObj)
			.then(({ data }) => {
				setLatestNews(data.articles);
			})
			.catch((err) => console.error(err));
	};

	useEffect(() => {
		fetchLatestNews();
	}, []);

	const { articles } = useContext(DataContext);

	const handleShowUnderline = (e) => {
		const category = e.target.innerText.toLowerCase();
		console.log(e.target, category);

		if (category !== currentCategory) {
			setCurrentCategory(category);
		}
	};

	return (
		<div className="bg-white">
			<div className="lg:w-[55%] mx-auto flex flex-col pb-4">
				<div className="flex max-md:flex-col p-4 gap-x-3 max-md:gap-y-6">
					<div className="basis-[70%] flex flex-col gap-y-3">
						<h3 className="w-full font-bold uppercase tracking-wider">
							Latest news
						</h3>
						<ul className="w-full list-none flex max-md:flex-wrap max-md:justify-center gap-x-5">
							{categories.map((category, i) => {
								return (
									<li key={i} className="">
										<Link
											path="/"
											className={
												"block py-2 md:text-sm truncate relative hover:text-gray-500 duration-300 after:content-[''] after:absolute after:bottom-0 after:h-[3px] after:bg-yellow-400 after:duration-300 after:transition-[width_left] " +
												(currentCategory === category.title.toLowerCase()
													? "after:w-[100%] after:left-0"
													: "after:w-[0%] after:left-[50%]")
											}
											onClick={handleShowUnderline}
										>
											{category.title}
										</Link>
									</li>
								);
							})}
						</ul>
						<div className="grid md:grid-rows-[190px_190px_190px_190px_190px_190px] grid-cols-3 max-md:grid-rows-16rows70px max-md:grid-cols-1 gap-3">
							{latestNews.slice(0, 15).map((article, i) => {
								let gridarea = {};
								if (i === 3) {
									gridarea["row-start"] = "row-start-2";
									gridarea["row-span"] = "row-span-2";
									gridarea["col-start"] = "col-start-1";
									gridarea["col-span"] = "col-span-2";
								}
								return (
									<SingleNews
										key={i}
										description={article.description}
										comments={article.comments}
										img={article.banner}
										type={i === 3 ? "large" : "medium"}
										gridarea={i === 3 ? gridarea : null}
									/>
								);
							})}
						</div>
						<Link
							path="/"
							className="max-lg:hidden self-center py-3 px-24 border border-gray-300 font-bold mt-8 hover:bg-black hover:text-white duration-500"
						>
							See all movies
						</Link>
					</div>
					<div className="basis-[30%]  flex flex-col gap-y-3">
						<h3 className="w-full font-bold uppercase tracking-wider">
							Most popular
						</h3>
						{articles.map((article, i) => {
							return (
								<SingleNews
									key={i}
									description={article.description}
									comments={article.comments}
									img={article.img}
									type="tiny"
								/>
							);
						})}
					</div>
				</div>
				<Link
					path="/"
					className="lg:hidden self-center py-3 px-24 border border-gray-300 font-bold mt-8 hover:bg-black hover:text-white duration-500"
				>
					See all movies
				</Link>
			</div>
		</div>
	);
};

export default LastestNews;
