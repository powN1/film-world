import { useState } from "react";
import { Link } from "react-router-dom";
import deadpool from "../imgs/deadpool.jpg";
import mcu from "../imgs/mcu.jpg";
import rdj from "../imgs/rdj.jpg";
import batman from "../imgs/batman.jpg";
import giancarlo from "../imgs/giancarlo.jpg";
import reaper from "../imgs/reaper.jpg";
import RankingPoster from "../common/RankingPoster";

const Ranking = () => {
	const [currentMovieCategory, setCurrentMovieCategory] =
		useState("most anticipated");

	// Slider settings
	const settings = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 6,
		slidesToScroll: 6,
	};
	const categories = [
		{ title: "Most anticipated" },
		{ title: "Top movies" },
		{ title: "Top series" },
	];

	const movies = [
		{
			title: "I am legend 2",
			img: deadpool,
			peopleAwaiting: 16540,
      rating: 8.9
		},
		{
			title: "Awoken",
			img: mcu,
			peopleAwaiting: 14224,
      rating: 8.7
		},
		{
			title: `Code of Evil`,
			img: rdj,
			peopleAwaiting: 13994,
      rating: 8.5
		},
		{
			title: `Twisters`,
			img: batman,
			peopleAwaiting: 12101,
      rating: 8.3
		},
		{
			title: `Black telephone`,
			img: giancarlo,
			peopleAwaiting: 10922,
      rating: 8.2
		},
		{
			title: `Love Lies Bleeding`,
			img: reaper,
			peopleAwaiting: 9822,
      rating: 8.1
		},
	];

	const handleShowUnderline = (e) => {
		const category = e.target.innerText.toLowerCase();

		if (category !== currentMovieCategory) {
			setCurrentMovieCategory(category);
		}
	};

	return (
		<div className={"flex flex-col py-10 gap-y-5 bg-transparent text-black"}>
			<h2
				className={
					"uppercase text-4xl font-bold text-center tracking-tighter font-sansNarrow"
				}
			>
				Most popular
			</h2>
			<ul
				className={
					"w-[55%] mx-auto list-none flex justify-center relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:h-[1px] after:w-full after:-translate-y-[50%] after:bg-gray-300"
				}
			>
				{categories.map((category, i) => {
					return (
						<li key={i}>
							<Link
								path="/"
								className={
									"block px-5 py-2 relative duration-300 after:content-[''] after:z-10 after:absolute after:bottom-0 after:h-[3px] after:bg-yellow-400 after:duration-300 after:transition-[width_left] " +
									(currentMovieCategory === category.title.toLowerCase()
										? "after:w-[100%] after:left-0 "
										: "after:w-[0%] after:left-[50%] text-gray-400 hover:text-black")
								}
								onClick={handleShowUnderline}
							>
								{category.title}
							</Link>
						</li>
					);
				})}
			</ul>
			<div className="w-full self-center flex gap-x-4">
				{movies.map((movie, i) => {
					return (
						<RankingPoster
							key={i}
							title={movie.title}
							img={movie.img}
							rating={movie.rating ? movie.rating : null}
              peopleAwaiting={movie.peopleAwaiting ? movie.peopleAwaiting : null}
						/>
					);
				})}
			</div>
			<Link
				path="/"
				className="self-center py-3 px-24 border border-gray-300 font-bold mt-8 hover:bg-black hover:text-white duration-500"
			>
				Check most popular movies
			</Link>
		</div>
	);
};

export default Ranking;
