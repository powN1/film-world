import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import MovieSlide from "../common/MovieSlide";
import { MediaQueriesContext } from "../App";
import { dummyDataMovies } from "../common/dummyDataMovies";
import { DataContext } from "../App";

const WideTrailerSlider = ({ type, showCategories = true }) => {
	const [currentMovieCategory, setCurrentMovieCategory] = useState("movies");

	const { movies, series } = useContext(DataContext);

	const { mobileView, tabletView } = useContext(MediaQueriesContext);

	const [films, setFilms] = useState(movies); // Slider settings

	useEffect(() => {
		if (type === "movies") setFilms(movies);
		else if (type === "series") setFilms(series);
	}, []);

	// Slider settings
	const settings = {
		dots: true,
		arrows: mobileView || tabletView ? false : true,
		infinite: true,
		slidesToShow: mobileView ? 2 : 3,
		slidesToScroll: mobileView ? 2 : 3,
		autoplay: true,
		autoplaySpeed: 15000,
		pauseOnHover: true,
	};
	const categories = [
		{ title: "Movies" },
		{ title: "Series" },
		{ title: "Games" },
	];

	const handleShowUnderline = (e) => {
		const category = e.target.innerText.toLowerCase();
		console.log(e.target, category);

		if (category !== currentMovieCategory) {
			setCurrentMovieCategory(category);
		}
	};

	return (
		<div className="flex flex-col py-10 gap-y-5 bg-transparent text-black bg-white">
			<h2 className="uppercase text-4xl font-bold text-center tracking-tighter font-sansNarrow">
				Trailers
			</h2>
			{showCategories ? (
				<ul
					className={
						"w-[55%] max-lg:w-auto mx-auto list-none flex justify-center relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:h-[1px] after:w-full after:-translate-y-[50%] after:bg-gray-300"
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
			) : null}
			<div className="w-[95%] self-center">
				<Slider {...settings}>
					{films.map((movie, i) => {
						return (
							<MovieSlide
								key={i}
								title={movie.title}
								img={movie.banner}
								ranking={movie.ranking ? movie.ranking : null}
								description={movie.description}
								type="trailer"
								pegi={movie.pegi}
							/>
						);
					})}
				</Slider>
			</div>
			<Link
				path="/"
				className="w-[90%] lg:w-1/5 text-center self-center py-3 max-lg:px-10 border border-gray-300 font-bold mt-8 hover:bg-black hover:text-white duration-500"
			>
				Check all trailers
			</Link>
		</div>
	);
};

export default WideTrailerSlider;
