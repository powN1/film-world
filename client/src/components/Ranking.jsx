import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import RankingPoster from "../common/RankingPoster";
import { DataContext } from "../App";

const Ranking = ({ showCategories = true, anticipated = false }) => {
	const [currentMovieCategory, setCurrentMovieCategory] = useState("most anticipated");

	const { movies } = useContext(DataContext);

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
		<div className={anticipated ? "bg-gray-100" : "bg-white"}>
			<div className="lg:w-[55%] py-10 mx-auto flex flex-col gap-y-5 bg-transparent text-black">
				<h2
					className={
						"uppercase text-4xl text-center tracking-tighter font-sansNarrow " +
						(anticipated ? "font-thin" : "font-bold ")
					}
				>
					{anticipated ? "Most anticipated" : "Ranking"}
				</h2>
				{showCategories && (
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
				)}
				<div className="w-full self-center flex gap-x-6 max-lg:gap-4 max-lg:px-4 justify-center max-lg:flex-wrap">
					{movies.slice(0, 6).map((movie, i) => {
						return (
							<RankingPoster
								key={i}
								title={movie.title}
								img={movie.banner}
								rating={anticipated ? null : movie.rating ? movie.rating : null}
								peopleAwaiting={
									movie.peopleAwaiting ? movie.peopleAwaiting : null
								}
							/>
						);
					})}
				</div>
				<Link
					path="/"
					className="w-[90%] lg:w-1/3 self-center py-3 text-center max-lg:px-10 border border-gray-300 font-bold mt-8 hover:bg-black hover:text-white duration-500"
				>
					See ranking
				</Link>
			</div>
		</div>
	);
};

export default Ranking;
