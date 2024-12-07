import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { FaRegCirclePlay } from "react-icons/fa6";
import Slider from "react-slick";
import { useContext, useEffect, useRef, useState } from "react";
import { MediaQueriesContext } from "../App";
import PreviewSlide from "../common/PreviewSlide";
import { DataContext } from "../App";
import Loader from "./Loader";

const MainPreviewWithSlides = ({ type }) => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);
	const { topRatedMovies, topRatedSeries } = useContext(DataContext);

	// Slider states
	// const [oldSlide, setOldSlide] = useState(0);
	const [activeSlide, setActiveSlide] = useState(0);

	const [films, setFilms] = useState(topRatedMovies);

	const [currentSrc, setCurrentSrc] = useState(null);

	const [fade, setFade] = useState(false);
	const sliderRef = useRef(null); // Ref to access slider instance

	// const changeSlideAnimation = () => {
	// 	// Wait for fade-out animation to complete before changing the image source
	// 	const timer = setTimeout(() => {
	// 		setCurrentSrc(films[activeSlide].banner);
	// 		setFade(true);
	// 	}, 3500); // Match this duration with the fade-out duration
	//    setFade(false);
	//
	// 	return () => clearTimeout(timer);
	// };

	useEffect(() => {
		if (films.length > 0) {
			setCurrentSrc(films[activeSlide].banner);
		}
	}, [films]);

	useEffect(() => {
		if (type === "movies") setFilms(topRatedMovies);
		if (type === "series") setFilms(topRatedSeries);
	}, []);

	const beforeChange = (_, next) => {
		setFade(true);
		setTimeout(() => {
			setActiveSlide(next);
			setCurrentSrc(films[next].banner);
			setFade(false);
		}, 500);
	};

	const changeSlide = (filmIndex) => {
		setFade(true);
		setTimeout(() => {
			setActiveSlide(filmIndex);
			setCurrentSrc(films[filmIndex].banner);
			setFade(false);
		}, 500);

		// Reset autoplay timer
		if (sliderRef.current) {
			console.log("reseting slider autoplay timer");
			sliderRef.current.slickGoTo(filmIndex);
			sliderRef.current.slickPause(); // Pause autoplay
			sliderRef.current.slickPlay(); // Restart autoplay
		}
	};

	const settings = {
		dots: false,
		arrows: true,
		infinite: true,
		speed: 750,
		slidesToShow: 6,
		slidesToScroll: 1,
		initialSlide: 0,
		autoplay: true,
		autoplaySpeed: 4000,
		pauseOnHover: true,
		beforeChange: beforeChange,
		responsive: [
			{
				// mobile view
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					arrows: true,
				},
			},
			{
				// tablet view
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					arrows: true,
				},
			},
		],
	};

	return (
		<>
			{films.length > 0 ? (
				<section className="w-full mx-auto flex flex-col">
					<div className="h-[50vh] lg:w-[55%] w-full mx-auto relative text-white">
						<div
							to={""}
							style={{
								backgroundImage: `linear-gradient(to bottom ,rgba(0,0,0,1) 2%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 98%), ${mobileView ? "" : "linear-gradient(to right, rgba(0,0,0,1) 5%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 95%),"} url(${currentSrc})`,
							}}
							className={
								"h-full w-full block bg-cover bg-center bg-no-repeat transition-opactiy duration-500 " +
								(fade ? "opacity-0" : "opacity-100")
							}
						></div>
						<div
							className={
								"absolute left-[50%] top-[5%] translate-x-[-50%] flex flex-col items-center gap-y-1 transition-opacity duration-500 " +
								(fade ? "opacity-0" : "opacity-100")
							}
						>
							<h2 className="text-3xl font-bold uppercase font-sansNarrow">
								{type === "movies"
									? "Movies"
									: type === "series"
										? "Series"
										: null}
							</h2>
							<p className="text-xl">Most popular</p>
						</div>
						<div
							className={
								"w-full absolute left-0 bottom-[20%] flex flex-col gap-y-2 px-3 transition-opacity duration-500 " +
								(fade ? "opacity-0" : "opacity-100")
							}
						>
							<Link
								to={`/${type === "movies" ? "movie" : type === "series" ? "serie" : "game"}/${films[activeSlide].titleId}`}
								className="text-4xl font-bold uppercase self-start font-sansNarrow"
							>
								{films[activeSlide].title}
							</Link>
							<div
								className={
									"gap-x-5 flex text-sm " + (mobileView ? "hidden" : "")
								}
							>
								<p>{films[activeSlide].title}</p>
								<span className="">{films[activeSlide].length} min.</span>
								<span>{films[activeSlide].year}</span>
							</div>
							<div className="flex gap-x-2 items-center">
								<FaStar className="text-3xl text-yellow-400" />
								<p className="text-3xl">
									{films[activeSlide].activity.rating.toFixed(2)}
								</p>
								<p className="flex flex-col">
									<span className="text-gray-400 text-sm">
										{films[activeSlide].activity.ratedByCount}
									</span>
									<span className="text-gray-400 text-sm mt-[-5px]">
										community ratings
									</span>
								</p>
							</div>
							<p
								className={"line-clamp-2 w-1/2 " + (mobileView ? "hidden" : "")}
							>
								{films[activeSlide].description}
							</p>
						</div>
						<Link
							to={`${films[activeSlide].videos[0]}`}
							target="_blank" // Opens video in a new tab
							rel="noopener noreferrer"
							className="absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-3 cusror-pointer group"
						>
							<FaRegCirclePlay
								className={
									"text-7xl transition-all duration-500 ease-in-out group-hover:text-yellow-400 " +
									(fade ? "opacity-0 translate-x-[-25%]" : "opacity-100")
								}
							/>
						</Link>
					</div>

					<div className="w-full bg-white pb-10">
						<div className="lg:w-[55%] mx-auto -mt-16">
							<Slider ref={sliderRef} {...settings}>
								{films.map((film, i) => {
									return (
										<PreviewSlide
											key={i}
											index={i}
											film={film}
											activeSlide={activeSlide}
											filmIndex={i}
											changeSlide={changeSlide}
										/>
									);
								})}
							</Slider>
						</div>
					</div>
				</section>
			) : (
				<Loader />
			)}
		</>
	);
};

export default MainPreviewWithSlides;
