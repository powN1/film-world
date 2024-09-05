import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { FaRegCirclePlay } from "react-icons/fa6";
import Slider from "react-slick";
import { useContext, useEffect, useRef, useState } from "react";
import { MediaQueriesContext } from "../App";
import PreviewSlide from "../common/PreviewSlide";
import { dummyDataMovies } from "../common/dummyDataMovies";
import { DataContext } from "../App";
import Loader from "./Loader";

const MainPreview = () => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);

	const { movies } = useContext(DataContext);

	// const [movies, setMovies] = useState([...dummyDataMovies]);

	// Slider states
	const [oldSlide, setOldSlide] = useState(0);
	const [activeSlide, setActiveSlide] = useState(0);
	const [activeSlide2, setActiveSlide2] = useState(0);

	const [currentSrc, setCurrentSrc] = useState(null);

	const [fade, setFade] = useState(false);

	useEffect(() => {
		setCurrentSrc(movies[activeSlide].banner);

		// Trigger fade-out animation
		setFade(false);

		// Wait for fade-out animation to complete before changing the image source
		const timer = setTimeout(() => {
			setCurrentSrc(movies[activeSlide].banner);
			setFade(true);
		}, 9500); // Match this duration with the fade-out duration

		return () => clearTimeout(timer);
	}, [activeSlide]);

	const beforeChange = (prev, next) => {
		setOldSlide(prev);
		setActiveSlide(next);
	};

	const settings = {
		dots: false,
		arrows: mobileView || tabletView ? false : true,
		infinite: true,
		speed: 2000,
		slidesToShow: mobileView ? 1 : tabletView ? 3 : 6,
		slidesToScroll: mobileView ? 1 : tabletView ? 3 : 6,
		initialSlide: 0,
		autoplay: true,
		autoplaySpeed: 10000,
		pauseOnHover: true,
		beforeChange: beforeChange,

		// responsive: [
		// 	{
		// 		breakpoint: 1120,
		// 		settings: {
		// 			slidesToShow: 3,
		// 			slidesToScroll: 1,
		// 		},
		// 	},
		// 	{
		// 		breakpoint: 800,
		// 		settings: {
		// 			slidesToShow: 2,
		// 			slidesToScroll: 2,
		// 		},
		// 	},
		// 	{
		// 		breakpoint: 600,
		// 		settings: {
		// 			slidesToShow: 1,
		// 			slidesToScroll: 1,
		// 		},
		// 	},
		// ],
	};

	return (
		<>
			{movies.length === 0 ? (
				<Loader />
			) : (
				<section className="w-full mx-auto flex flex-col">
					<div className="h-[50vh] lg:w-[55%] w-full mx-auto relative text-white">
						<Link
							to={""}
							style={{
								backgroundImage: `linear-gradient(to bottom ,rgba(0,0,0,1) 2%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 98%), ${mobileView ? "" : "linear-gradient(to right, rgba(0,0,0,1) 5%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 95%),"} url(${currentSrc})`,
							}}
							className={
								"h-full w-full block bg-cover bg-center bg-no-repeat transition-opactiy duration-500 " +
								(fade ? "opacity-0" : "opacity-100")
							}
						></Link>
						<div
							className={
								"absolute left-[50%] top-[5%] translate-x-[-50%] flex flex-col items-center gap-y-1 transition-opacity duration-500 " +
								(fade ? "opacity-0" : "opacity-100")
							}
						>
							<h2 className="text-3xl font-bold uppercase font-sansNarrow">
								Movies
							</h2>
							<p className="text-xl">Most popular</p>
						</div>
						<div
							className={
								"w-full absolute left-0 bottom-[20%] flex flex-col gap-y-2 px-3 transition-opacity duration-500 " +
								(fade ? "opacity-0" : "opacity-100")
							}
						>
							<h2 className="text-4xl font-bold uppercase font-sansNarrow">
								{movies[activeSlide].title}
							</h2>
							<div
								className={
									"gap-x-5 flex text-sm " + (mobileView ? "hidden" : "")
								}
							>
								<p>{movies[activeSlide].title}</p>
								<span className="">{movies[activeSlide].length} min.</span>
								<span>{movies[activeSlide].year}</span>
							</div>
							<div className="flex gap-x-2 items-center">
								<FaStar className="text-3xl text-yellow-400" />
								<p className="text-3xl">{movies[activeSlide].activity.rating}</p>
								<p className="flex flex-col">
									<span className="text-gray-400 text-sm">
										{movies[activeSlide].activity.ratedByCount}
									</span>
									<span className="text-gray-400 text-sm mt-[-5px]">
										community ratings
									</span>
								</p>
							</div>
							<p
								className={"line-clamp-2 w-1/2 " + (mobileView ? "hidden" : "")}
							>
								{movies[activeSlide].description}
							</p>
						</div>
						<FaRegCirclePlay
							className={
								"absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-7xl transition-all duration-500 ease-in-out " +
								(fade ? "opacity-0 translate-x-[-25%]" : "opacity-100")
							}
						/>
					</div>

					<div className="w-full bg-white pb-10">
						<div className="lg:w-[55%] mx-auto -mt-16">
							<Slider {...settings}>
								{movies.map((movie, i) => {
									return (
										<PreviewSlide
											key={i}
											movie={movie}
											activeSlide={activeSlide}
											movieIndex={i}
										/>
									);
								})}
							</Slider>
						</div>
					</div>
				</section>
			)}
		</>
	);
};

export default MainPreview;
