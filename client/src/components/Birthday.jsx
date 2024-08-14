import { useContext } from "react";
import Slider from "react-slick";
import { MediaQueriesContext } from "../App";
import ActorBirthdaySlide from "../common/ActorBirthdaySlide";
import { dummyDataActors } from "../common/dummyDataActors";

const Birthday = () => {
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
		<div className="flex flex-col py-10 gap-y-5 text-black bg-white">

			<h2 className="uppercase text-4xl font-bold text-center tracking-righter font-sansNarrow px-2">
				Born this month
			</h2>
			<div className="w-full lg:w-[55%] self-center">
				<Slider {...settings}>
					{dummyDataActors.map((movie, i) => (
						<ActorBirthdaySlide
							key={i}
							img={movie.img}
							name="Hugh Jackman"
							age="24"
						/>
					))}
				</Slider>
			</div>
		</div>
	);
};

export default Birthday;
