import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { FaRegCirclePlay } from "react-icons/fa6";
import Slider from "react-slick";
import { useContext, useEffect, useState } from "react";
import { MediaQueriesContext } from "../App";
import PreviewSlide from "../common/PreviewSlide";
import { dummyMovies } from "../common/dummyDataMovies";

const MainPreview = () => {

	const { mobileView, tabletView } = useContext(MediaQueriesContext);

  const [selectedMovie, setSelectedMovie] = useState(dummyMovies[0])
  const [movies, setMovies] = useState([...dummyMovies])

  useEffect(() =>{
    setSelectedMovie(movies[0])
  }, [])

	const settings = {
		dots: true,
		arrows: mobileView || tabletView ? false : true,
		infinite: true,
		speed: 500,
		slidesToShow: mobileView ? 2 : tabletView ? 3 : 6,
		slidesToScroll: mobileView ? 2 : tabletView ? 3 : 6,
		initialSlide: 0,
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
		<section className="relative">
			<div className="h-[50vh] relative text-white bg-black">
				<Link
					to={""}
					className="relative h-full w-full block before:content-[''] before:h-full before:w-full before:absolute before:top-0 before:left-0 before:bg-gradient-to-b from-black from-2% via-transparent to-black to-98%"
				>
					<img
						src={selectedMovie.img}
						alt=""
						className="w-full h-full object-cover transition-all duration-300 "
					/>
				</Link>
				<div className="absolute left-[50%] top-[5%] translate-x-[-50%] flex flex-col items-center gap-y-1">
					<h2 className="text-3xl font-bold uppercase font-sansNarrow">
						Movies
					</h2>
					<p className="text-xl">Most popular</p>
				</div>
				<div className="w-full absolute left-0 bottom-[20%] flex flex-col gap-y-2 px-3">
					<h2 className="text-4xl font-bold uppercase font-sansNarrow">
						{movies[0].title}
					</h2>
					<div className="hidden gap-x-4">
						<p>{movies[0].title}</p>
						<span className="">{movies[0].length} min.</span>
						<span>{movies[0].year}</span>
					</div>
					<div className="flex gap-x-2 items-center">
						<FaStar className="text-3xl text-yellow-400" />
						<p className="text-3xl">{movies[0].rating}</p>
						<p className="flex flex-col">
							<span className="text-gray-400 text-sm">
								{selectedMovie.ratedByCount}
							</span>
							<span className="text-gray-400 text-sm mt-[-5px]">
								community ratings
							</span>
						</p>
					</div>
					<p className="hidden">{selectedMovie.description}</p>
				</div>
				<FaRegCirclePlay className="absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-7xl" />
			</div>

			<div className="w-full absolute left-0 top-[85%]">
				<Slider {...settings}>
					{movies.map((movie, i) => {
						return <PreviewSlide key={i} movie={movie} selectedMovie={selectedMovie} setSelectedMovie={setSelectedMovie} />;
					})}
				</Slider>
			</div>
		</section>
	);
};

export default MainPreview;
