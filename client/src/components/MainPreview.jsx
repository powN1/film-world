import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { FaRegCirclePlay } from "react-icons/fa6";
import Slider from "react-slick";
import { useContext, useEffect, useRef, useState } from "react";
import { MediaQueriesContext } from "../App";
import PreviewSlide from "../common/PreviewSlide";
import { dummyDataMovies } from "../common/dummyDataMovies";

const MainPreview = () => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);

	const [movies, setMovies] = useState([...dummyDataMovies]);

	// Slider states
	const [oldSlide, setOldSlide] = useState(0);
	const [activeSlide, setActiveSlide] = useState(0);
	const [activeSlide2, setActiveSlide2] = useState(0);

	const [currentSrc, setCurrentSrc] = useState(null);

	const [fade, setFade] = useState(false);

	useEffect(() => {
		setCurrentSrc(movies[activeSlide].img);

		// Trigger fade-out animation
		setFade(false);

		// Wait for fade-out animation to complete before changing the image source
		const timer = setTimeout(() => {
			setCurrentSrc(movies[activeSlide].img);
			setFade(true);
		}, 9500); // Match this duration with the fade-out duration

		return () => clearTimeout(timer);
	}, [activeSlide]);

	const beforeChange = (prev, next) => {
		setOldSlide(prev);
		setActiveSlide(next);
	};

	const settings = {
		dots: true,
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
		<section className="flex flex-col bg-white">
			<div className="h-[50vh] relative text-white bg-black">
				<Link
					to={""}
					style={{
						backgroundImage: `linear-gradient(rgba(0,0,0,1) 0%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,1) 100%), url(${currentSrc})`,
					}}
					className={
						"h-full w-full block bg-cover bg-center bg-no-repeat transition-opactiy duration-500 " +
						(fade ? "opacity-0" : "opacity-100")
					}
				>
					{/* <img */}
					{/* 	src={movies[activeSlide].img} */}
					{/* 	alt="" */}
					{/* 	className={ "w-full h-full object-cover relative before:content-[''] before:h-full before:w-full before:absolute before:top-0 before:left-0 before:bg-gradient-to-b from-black from-2% via-transparent to-black to-98% transition-opacity duration-300 " + (fade ? "" : "")} */}
					{/* /> */}
				</Link>
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
					<div className="hidden gap-x-4">
						<p>{movies[activeSlide].title}</p>
						<span className="">{movies[activeSlide].length} min.</span>
						<span>{movies[0].year}</span>
					</div>
					<div className="flex gap-x-2 items-center">
						<FaStar className="text-3xl text-yellow-400" />
						<p className="text-3xl">{movies[activeSlide].rating}</p>
						<p className="flex flex-col">
							<span className="text-gray-400 text-sm">
								{movies[activeSlide].ratedByCount}
							</span>
							<span className="text-gray-400 text-sm mt-[-5px]">
								community ratings
							</span>
						</p>
					</div>
					<p className="hidden">{movies[activeSlide].description}</p>
				</div>
				<FaRegCirclePlay
					className={
						"absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-7xl transition-all duration-500 ease-in-out " +
						(fade ? "opacity-0 translate-x-[-25%]" : "opacity-100")
					}
				/>
			</div>

			<div className="w-full -mt-16">
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
		</section>
	);
};

export default MainPreview;
