import { useContext } from "react";
import Slider from "react-slick";
import { DataContext, MediaQueriesContext } from "../App";
import { dummyDataMovies } from "../common/dummyDataMovies";
import MostPopularSlide from "../common/MostPopularSlide";

const MostPopular = ({ type = "roles" }) => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);
	const { actors } = useContext(DataContext);
	const movieActors = console.log(movieActors);


	// Slider settings
	// NOTE: Slides for roles: Small screens 2 slides, medium 5, large 5
	// NOTE: Slides for chars: Small screens 2 slides, medium 5, large 6
	const slidesToShow = mobileView
		? 2
		: tabletView
			? 5
			: type === "roles"
				? 5
				: 6;

	const settings = {
		dots: true,
		arrows: mobileView || tabletView ? false : true,
		infinite: true,
		speed: 500,
		slidesToShow: slidesToShow,
		slidesToScroll: slidesToShow,
	};

	return (
		<div
			className={
				"flex flex-col py-10 gap-y-5 text-white " +
				(type !== "games" ? "bg-black" : "bg-white")
			}
		>
			<h2
				className={
					"uppercase text-4xl text-center tracking-tighter font-sansNarrow font-thin px-2 " +
					(type !== "games" ? "text-gray-100" : "text-black")
				}
			>
				{type === "roles"
					? "Most popular roles"
					: type === "characters"
						? "Most popular characters"
						: "Most popular"}
			</h2>
			<div
				className={
					"w-full lg:w-[55%] self-center " +
					(type !== "games" ? "" : "text-black")
				}
			>
				<Slider {...settings}>
					{actors.map((actor, i) => {
						return type === "roles" ? (
							<MostPopularSlide
								key={i}
								title={actor.roles[0].movieName}
								img={actor.banner}
								actor={actor.name}
								role={actor.roles[0].characterName}
								ranking={212}
							/>
						) : type === "characters" ? (
							<MostPopularSlide
								key={i}
								title={actor.title}
								img={actor.img}
								character="Deadpool"
							/>
						) : (
							<MostPopularSlide
								key={i}
								title={actor.title}
								img={actor.img}
								gameName="Witcher 3"
							/>
						);
					})}
				</Slider>
			</div>
		</div>
	);
};

export default MostPopular;
