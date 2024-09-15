import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import MovieSlide from "../common/MovieSlide";
import { MediaQueriesContext } from "../App";
import { DataContext } from "../App";

const WideSlider = () => {
	const [currentMovieCategory, setCurrentMovieCategory] = useState("movies of the day");

  const { movies } = useContext(DataContext)

	const { mobileView, tabletView } = useContext(MediaQueriesContext);

	// Slider settings
	const settings = {
		dots: true,
		arrows: mobileView || tabletView ? false : true,
		infinite: true,
		speed: 500,
		slidesToShow: mobileView ? 2 : tabletView ? 3 : 8,
		slidesToScroll: mobileView ? 2 : tabletView ? 3 : 8,
	};
	const categories = [
		{ title: "Movies of the day" },
		{ title: "Series of the day" },
		{ title: "VOD" },
		{ title: "Games of the day" },
		{ title: "Cinema" },
	];


	const handleShowUnderline = (e) => {
		const category = e.target.innerText.toLowerCase();
		console.log(e.target, category);

		if (category !== currentMovieCategory) {
			setCurrentMovieCategory(category);
		}
	};

	return (
		<div className={"flex flex-col py-10 gap-y-5 bg-black text-white"}>
			<h2
				className={
					"uppercase text-4xl font-bold text-center tracking-tighter font-sansNarrow text-gray-100"
				}
			>
				Most popular
			</h2>
			<ul
				className={
					"w-[55%] max-lg:w-full max-lg:flex-wrap max-lg:justify-center mx-auto list-none flex justify-center relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:h-[1px] after:w-full after:-translate-y-[50%] after:bg-gray-800"
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
										: "after:w-[0%] after:left-[50%] text-gray-400 hover:text-white")
								}
								onClick={handleShowUnderline}
							>
								{category.title}
							</Link>
						</li>
					);
				})}
			</ul>
			<div className="w-[95%] self-center">
				<Slider {...settings}>
					{movies.map((movie, i) => {
						return (
							<MovieSlide
								key={i}
								title={movie.title}
								img={movie.cover}
								ranking={movie.ranking ? movie.ranking : null}
								type="movie"
							/>
						);
					})}
				</Slider>
			</div>
			<Link
				path="/"
				className="w-[90%] lg:w-1/5 text-center self-center py-3 max-lg:px-10 border border-gray-300 font-bold mt-8 hover:bg-white hover:text-black duration-500"
			>
				Check most popular movies
			</Link>
		</div>
	);
};

export default WideSlider;
