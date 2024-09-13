import { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { MediaQueriesContext } from "../App";
import ActorBirthdaySlide from "../common/ActorBirthdaySlide";
import { dummyDataActors } from "../common/dummyDataActors";
import axios from "axios";
import Loader from "./Loader";
import { getMonth } from "../common/date";

const Birthday = () => {
	const [actors, setActors] = useState([]);
	const [loading, setLoading] = useState(true);

	const { mobileView, tabletView } = useContext(MediaQueriesContext);
	const slidesToShow = mobileView ? 2 : tabletView ? 4 : 6;

	const getActors = async () => {
		await axios
			.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-actors")
			.then(({ data }) => {
				setActors(data.actors);
				console.log(data.actors);
				const thisMonth = data.actors.filter((actor) => {
					let date = new Date();
					// console.log( getMonth(actor.personal_info.dateOfBirth) === getMonth(date),);
					console.log( getMonth(actor.personal_info.dateOfBirth), getMonth(date));
					return getMonth(actor.personal_info.dateOfBirth) === getMonth(date);
				});
				console.log(thisMonth);
				setLoading(false);
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		getActors();
	}, []);

	// Slider settings
	// NOTE: Small screens 2 slides, medium 4, large 6
	const settings = {
		dots: true,
		arrows: mobileView || tabletView ? false : true,
		infinite: true,
		speed: 500,
		slidesToShow: slidesToShow,
		slidesToScroll: slidesToShow,
	};

	return loading ? (
		<Loader />
	) : (
		<div className="flex flex-col py-10 gap-y-5 text-black bg-white">
			<h2 className="uppercase text-4xl font-bold text-center tracking-righter font-sansNarrow px-2">
				Born this month
			</h2>
			<div className="w-full lg:w-[55%] self-center">
				<Slider {...settings}>
					{actors.map((actor, i) => (
						<ActorBirthdaySlide
							key={i}
							img={actor.banner}
							firstName={actor.personal_info.firstName}
							surname={actor.personal_info.surname}
							age={actor.personal_info.dateOfBirth}
						/>
					))}
				</Slider>
			</div>
		</div>
	);
};

export default Birthday;
