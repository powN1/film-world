import { useState } from "react";
import { Link } from "react-router-dom";
import RankingPoster from "../common/RankingPoster";
import { dummyMovies } from "../common/dummyDataMovies";

const Ranking = () => {
	const [currentMovieCategory, setCurrentMovieCategory] =
		useState("most anticipated");

	// Slider settings
	const categories = [
		{ title: "Most anticipated" },
		{ title: "Top movies" },
		{ title: "Top series" },
	];


	const handleShowUnderline = (e) => {
		const category = e.target.innerText.toLowerCase();

		if (category !== currentMovieCategory) {
			setCurrentMovieCategory(category);
		}
	};

	return (
		<div className="bg-white">
			<div className="lg:w-[55%] mx-auto flex flex-col py-10 gap-y-5 bg-transparent text-black">
				<h2 className="uppercase text-4xl font-bold text-center tracking-tighter font-sansNarrow">
					Most popular
				</h2>
				<ul className="w-full max-lg:w-auto mx-auto list-none flex text-center justify-center relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:h-[1px] after:w-full after:-translate-y-[50%] after:bg-gray-300">
					{categories.map((category, i) => {
						return (
							<li key={i}>
								<Link
									path="/"
									className={
										"block px-5 py-2 max-lg:text-sm relative duration-300 after:content-[''] after:z-10 after:absolute after:bottom-0 after:h-[3px] after:bg-yellow-400 after:duration-300 after:transition-[width_left] " +
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
				<div className="w-full self-center flex gap-x-6 max-lg:gap-4 max-lg:px-4 justify-center max-lg:flex-wrap">
					{dummyMovies.slice(0,6).map((movie, i) => {
						return (
							<RankingPoster
								key={i}
								title={movie.title}
								img={movie.img}
								rating={movie.rating ? movie.rating : null}
								peopleAwaiting={
									movie.peopleAwaiting ? movie.peopleAwaiting : null
								}
							/>
						);
					})}
				</div>
				<Link
					path="/"
					className="self-center py-3 px-24 max-lg:px-10 border border-gray-300 font-bold mt-8 hover:bg-black hover:text-white duration-500"
				>
					Check most popular movies
				</Link>
			</div>
		</div>
	);
};

export default Ranking;
