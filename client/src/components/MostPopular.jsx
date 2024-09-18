import { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { DataContext, MediaQueriesContext } from "../App";
import { dummyDataMovies } from "../common/dummyDataMovies";
import MostPopularSlide from "../common/MostPopularSlide";
import axios from "axios";
import Loader from "./Loader";

const MostPopular = ({ type, category }) => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);

	const [roles, setRoles] = useState([]);
	const [characters, setCharacters] = useState([]);
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

	const getRoles = async (type) => {
		await axios
			.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-roles", {
				sortByRating: true,
				type,
			})
			.then(({ data }) => {
				console.log("roles:", data.roles.length);
				setRoles(data.roles.slice(0, 15));
			})
			.catch((err) => console.log(err));
	};

	const getCharacters = async () => {
		await axios
			.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-characters")
			.then(({ data }) => {
				setCharacters(data.characters);
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		if (type === "roles") {
			if (category === "movies") getRoles("movies");
			else if (category === "series") getRoles("series");
		}
		if (type === "characters") getCharacters();
		setLoading(false);
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
				{type === "roles" ? `Most popular ${category} roles` : type === "characters" ? "Most popular characters" : "Most popular"}
			</h2>
			<div
				className={
					"w-full lg:w-[55%] self-center " +
					(type !== "games" ? "" : "text-black")
				}
			>
				{loading ? ( <Loader />) : (
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
								? characters.map((character, i) => {
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
				)}
			</div>
		</div>
	);
};

export default MostPopular;
