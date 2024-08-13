import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { MediaQueriesContext } from "../App";
import { dummyMovies } from "../common/dummyDataMovies";
import MostPopularSlide from "../common/MostPopularSlide";

const MostPopular = () => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);

	// Slider settings
	const settings = {
		dots: true,
		arrows: mobileView || tabletView ? false : true,
		infinite: true,
		speed: 500,
		slidesToShow: mobileView ? 2 : tabletView ? 3 : 6,
		slidesToScroll: mobileView ? 2 : tabletView ? 3 : 6,
	};

	return (
		<div className="flex flex-col py-10 gap-y-5 bg-black text-white">
			<h2 className="uppercase text-4xl text-center tracking-tighter font-sansNarrow text-gray-100 font-thin px-2">
				Most popular movie roles
			</h2>
			<div className="w-full lg:w-[55%] self-center">
				<Slider {...settings}>
					{dummyMovies.map((movie, i) => {
						return (
							<MostPopularSlide
								key={i}
								title={movie.title}
								img={movie.img}
								actor="Hugh Jackman"
								role="Wolverine"
								ranking={212}
							/>
						);
					})}
				</Slider>
			</div>
		</div>
	);
};

export default MostPopular;
