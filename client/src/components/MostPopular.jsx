import { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { DataContext, MediaQueriesContext } from "../App";
import MostPopularSlide from "../common/MostPopularSlide";

const MostPopular = ({ type, category }) => {
	const { moviesRoles, seriesRoles, characters } = useContext(DataContext);
	const { mobileView, tabletView } = useContext(MediaQueriesContext);

	const [roles, setRoles] = useState([]);
	const [currentCharacters, setCurrentCharacters] = useState([]);
	const [games, setGames] = useState([]);
	const [loading, setLoading] = useState(true);

	// Slider settings
	// NOTE: Slides for roles: Small screens 2 slides, medium 5, large 5
	// NOTE: Slides for chars: Small screens 2 slides, medium 5, large 6
	const slidesToShow = mobileView ? 2 : tabletView ? 5 : type === "roles" ? 5 : 6;

	const settings = {
		dots: true,
		arrows: mobileView || tabletView ? false : true,
		infinite: true,
		speed: 500,
		slidesToShow: slidesToShow,
		slidesToScroll: slidesToShow,
	};

	useEffect(() => {
		if (type === "roles") {
			if (category === "movies") setRoles(moviesRoles);
			else if (category === "series") setRoles(seriesRoles);
		}
		if (type === "characters") setCurrentCharacters(characters);
	}, []);

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
					? `Most popular ${category} roles`
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
				{
					<Slider {...settings}>
						{type === "roles"
							? roles.map((role, i) => {
									return (
										<MostPopularSlide
											key={i}
											title={role.filmTitle}
											img={role.characterBanner}
											actor={role.actor}
											role={role.characterName}
											ranking={role.activity ? role.activity.rating : null}
										/>
									);
								})
							: type === "characters"
								? currentCharacters.map((character, i) => {
										return (
											<MostPopularSlide
												key={i}
												img={character.banner}
												character={character.personal_info.characterName}
											/>
										);
									})
								: null}
					</Slider>
				}
			</div>
		</div>
	);
};

export default MostPopular;
