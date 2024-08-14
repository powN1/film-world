import { useContext } from "react";
import Slider from "react-slick";
import { MediaQueriesContext } from "../App";
import { dummyDataMovies } from "../common/dummyDataMovies";
import MostPopularSlide from "../common/MostPopularSlide";

const MostPopular = ({ type = "roles" }) => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);


	// Slider settings
	const settings = {
		dots: true,
		arrows: mobileView || tabletView ? false : true,
		infinite: true,
		speed: 500,
		slidesToShow: mobileView ? 2 : tabletView ? 3 : type === "roles" ? 5 : 6,
		slidesToScroll: mobileView ? 2 : tabletView ? 3 : type === "roles" ? 5 : 6,
	};

	return (
		<div className="flex flex-col py-10 gap-y-5 bg-black text-white">
			<h2 className="uppercase text-4xl text-center tracking-tighter font-sansNarrow text-gray-100 font-thin px-2">
        {type === 'roles' ? "Most popular movie roles" : type === "characters" ? "Most popular characters" : null}
			</h2>
			<div className="w-full lg:w-[55%] self-center">
				<Slider {...settings}>
					{dummyDataMovies.map((movie, i) => {
						return type === "roles" ? (
							<MostPopularSlide
								key={i}
								title={movie.title}
								img={movie.img}
								actor="Hugh Jackman"
								role="Wolverine"
								ranking={212}
							/>
						) : (
							<MostPopularSlide
								key={i}
								title={movie.title}
								img={movie.img}
								character="Deadpool"
							/>
						);
					})}
				</Slider>
			</div>
		</div>
	);
};

export default MostPopular;
