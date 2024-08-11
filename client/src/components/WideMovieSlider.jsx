import { useContext, useEffect, useState } from "react";
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
import Slider from "react-slick";
import MovieSlide from "../common/MovieSlide";
import { MediaQueriesContext } from "../App";

const WideSlider = () => {
	const [currentMovieCategory, setCurrentMovieCategory] =
		useState("movies of the day");

	const { mobileView } = useContext(MediaQueriesContext);

	// Slider settings
	const settings = {
		dots: false,
		arrows: mobileView ? false : true,
		infinite: true,
		speed: 500,
		slidesToShow: mobileView ? 2 : 8,
		slidesToScroll: mobileView ? 2 : 8,
	};
	const categories = [
		{ title: "Movies of the day" },
		{ title: "Series of the day" },
		{ title: "VOD" },
		{ title: "Games of the day" },
		{ title: "Cinema" },
	];

	const movies = [
		{
			title: "I am legend 2",
			img: deadpool,
			ranking: 1,
		},
		{
			title: "Awoken",
			img: mcu,
			ranking: 2,
		},
		{
			title: `Code of Evil`,
			img: rdj,
			ranking: 3,
		},
		{
			title: `Twisters`,
			img: batman,
			ranking: 4,
		},
		{
			title: `Black telephone`,
			img: giancarlo,
			ranking: 5,
		},
		{
			title: `Love Lies Bleeding`,
			img: reaper,
			ranking: 6,
		},
		{
			title: `Dexter`,
			img: dexter,
			ranking: 7,
		},
		{
			title: `Hellboy: Hell Unites`,
			img: hellboy,
			ranking: 8,
		},
		{
			title: `Batman: Arkham Vengence`,
			img: penguin,
			ranking: 9,
		},
		{
			title: `Batman: Arkham Vengence`,
			img: reaper,
			ranking: 10,
		},
		{
			title: `Black organs`,
			img: reaper,
		},
		{
			title: `Blackbird`,
			img: reaper,
		},
		{
			title: `Out of this world`,
			img: reaper,
		},
		{
			title: `Vicious cycle`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
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
								img={movie.img}
								ranking={movie.ranking ? movie.ranking : null}
								type="movie"
							/>
						);
					})}
				</Slider>
			</div>
			<Link
				path="/"
				className="self-center py-3 px-24 max-lg:px-10 border border-gray-300 font-bold mt-8 hover:bg-white hover:text-black duration-500"
			>
				Check most popular movies
			</Link>
		</div>
	);
};

export default WideSlider;
