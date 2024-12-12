import { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { DataContext, MediaQueriesContext } from "../App";
import ActorBirthdaySlide from "../common/ActorBirthdaySlide";
import axios from "axios";
import Loader from "./Loader";
import { getMonth } from "../common/date";

const Birthday = () => {
	const { actors } = useContext(DataContext);
	const { mobileView, tabletView } = useContext(MediaQueriesContext);

	const [birthDayActors, setBirthdayActors] = useState([]);


	const filterThisMonthBirthdayActors = () => {
		const thisMonth = actors.filter((actor) => {
			let date = new Date();
			// console.log( getMonth(actor.personal_info.dateOfBirth) === getMonth(date),);
			return getMonth(actor.personal_info.dateOfBirth) === getMonth(date);
		});
		setBirthdayActors(thisMonth);
	};

	useEffect(() => {
		filterThisMonthBirthdayActors();
	}, []);

	// Slider settings
	// NOTE: Small screens 2 slides, medium 4, large 6
	const settings = {
		dots: true,
		arrows: true,
		infinite: true,
		speed: 500,
		slidesToShow: 6,
		slidesToScroll: 6,
		responsive: [
			{
				// mobile view
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					arrows: false,
				},
			},
			{
				// tablet view
				breakpoint: 1024,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 4,
					arrows: false,
				},
			},
		],
	};

	return (
		<div className="flex flex-col py-10 gap-y-5 text-black bg-white">
			<h2 className="uppercase text-4xl font-bold text-center tracking-righter font-sansNarrow px-2">
				Born this month
			</h2>
			<div className="w-full lg:w-[55%] self-center">
				<Slider {...settings}>
					{birthDayActors.map((actor, i) => (
						<ActorBirthdaySlide
							key={i}
              actorLink={actor.personal_info.nameId}
							img={actor.banner}
							name={actor.personal_info.name}
							age={actor.personal_info.dateOfBirth}
						/>
					))}
				</Slider>
			</div>
		</div>
	);
};

export default Birthday;
