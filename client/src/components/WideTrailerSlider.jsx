import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import MovieSlide from "../common/MovieSlide";
import { MediaQueriesContext } from "../App";
import { DataContext } from "../App";
import { getFullYear } from "../common/date";

const WideTrailerSlider = ({ type, showCategories = true }) => {
	const { upcomingMovies, upcomingSeries, upcomingGames } = useContext(DataContext);

	const [currentCategory, setCurrentCategory] = useState("movies");

  const [currentSlidesArray, setCurrentSlidesArray] = useState(upcomingMovies)
  
  useEffect(() => {
    if(currentCategory.toLowerCase() === categories[0].title.toLowerCase()) setCurrentSlidesArray(upcomingMovies);
    if(currentCategory.toLowerCase() === categories[1].title.toLowerCase()) setCurrentSlidesArray(upcomingSeries);
    if(currentCategory.toLowerCase() === categories[2].title.toLowerCase()) setCurrentSlidesArray(upcomingGames);
  }, [currentCategory])

	// Slider settings
	const settings = {
		dots: true,
		arrows: true,
		infinite: true,
		slidesToShow: 3,
		slidesToScroll: 3,
		autoplay: true,
		autoplaySpeed: 15000,
		pauseOnHover: true,
		responsive: [
			{
				// mobile view
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					arrows: true,
				},
			},
		],
	};
	const categories = [
		{ title: "Movies" },
		{ title: "Series" },
		{ title: "Games" },
	];

	const handleShowUnderline = (e) => {
		const category = e.target.innerText.toLowerCase();

		if (category !== currentCategory) {
			setCurrentCategory(category);
		}
	};

  useEffect(() => {
    if(type === "series") setCurrentSlidesArray(upcomingSeries)
  }, [])

	return (
		<div className="flex flex-col py-10 pb-20 gap-y-5 bg-transparent text-black bg-white">
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
										(currentCategory === category.title.toLowerCase()
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
					{currentSlidesArray.slice(0, 9).map((media, i) => {
            const year = getFullYear(media.releaseDate) || getFullYear(media.firstAirDate);
						return (
							<MovieSlide
								key={i}
								title={media.title}
								img={media.banner}
                mediaLink={media.videos.length > 0 ? media.videos[0] : null}
								ranking={media.activity.ranking ? media.activity.ranking : null}
								description={media.description}
								type="trailer"
								pegi={media.pegi}
                year={year}
							/>
						);
					})}
				</Slider>
			</div>
		</div>
	);
};

export default WideTrailerSlider;
