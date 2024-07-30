import { Link } from "react-router-dom";
import deadpool from "../imgs/deadpool.jpg";
import mcu from "../imgs/mcu.jpg";
import rdj from "../imgs/rdj.jpg";
import batman from "../imgs/batman.jpg";
import giancarlo from "../imgs/giancarlo.jpg";
import dexter from "../imgs/dexter.jpg";
import hellboy from "../imgs/hellboy.jpg";
import penguin from "../imgs/penguin.jpg";
import reaper from "../imgs/reaper.jpg";
import SingleNews from "../common/SingleNews";

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

const news = [
	{ title: "I am legend 2 - new director", img: deadpool, comments: 14 },
	{
		title: "Netflix presents most interesting premieres of august 2024",
		img: mcu,
		comments: 4,
	},
	{
		title: `Gangster quarrel and family issues. Penguin trailer`,
		img: rdj,
		comments: 56,
	},
	{
		title: `10 Poles that succeeded in movie industry`,
		img: batman,
		comments: 21,
	},
	{
		title: `Henry Cavill and Tom Cruise together again! In a movie about world war II`,
		img: giancarlo,
		comments: 85,
	},
	{
		title: `Captain America 4. Giancarlo Esposito reveals who he's going to play`,
		img: reaper,
		comments: 42,
	},
];

const LastestNews = () => {
	return (
		<div className="bg-white flex p-4">
			<div className="basis-[70%] flex flex-col">
				<p className="w-full">Latest news</p>
				<ul className="w-full list-none flex gap-x-5">
					{categories.map((category, i) => {
						return (
							<li key={i} className="float-left">
								<Link path="" className="">{category.title}</Link>
							</li>
						);
					})}
				</ul>
				<div className="grid grid-rows-[190px_190px_190px_190px_190px_190px] grid-cols-3 gap-3">
					{news.map((article, i) => (
						<SingleNews
							key={i}
							title={article.title}
							comments={article.comments}
							img={article.img}
							type="medium"
						/>
					))}
				</div>
				<Link
					path="/"
					className="self-center py-4 px-32 border border-gray-300 font-bold"
				>
					See all movies
				</Link>
			</div>
			<div>Most popular</div>
		</div>
	);
};

export default LastestNews;
