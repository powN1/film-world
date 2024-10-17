import { useContext, useEffect, useState } from "react";
import { DataContext } from "../App";
import RankingResult from "./RankingResult";
import { getFullYear } from "../common/date";
import { RankingContext } from "../pages/RankingPage";
import RankingResultActor from "./RankingResultActor";
import RankingResultRole from "./RankingResultRole";

const RankingResults = () => {
	const { currentCategory, currentSubCategory } = useContext(RankingContext);
	const {
		topRatedMovies,
		topRatedSeries,
		topRatedGames,
		movieTopRatedRoles,
		serieTopRatedRoles,
    actorsTopRated,
	} = useContext(DataContext);

	const [mediaToShow, setMediaToShow] = useState([]);
	const [localCurrentCategory, setLocalCurrentCategory] = useState([]);

	useEffect(() => {
		// Show specific media given specific category that user chose
		if (currentCategory.toLowerCase() === "movies") {
			setLocalCurrentCategory("movies");
			setMediaToShow(topRatedMovies);
		} else if (currentCategory.toLowerCase() === "series") {
			setLocalCurrentCategory("series");
			setMediaToShow(topRatedSeries);
		} else if (currentCategory.toLowerCase() === "games") {
			setLocalCurrentCategory("games");
			setMediaToShow(topRatedGames);
		} else if (currentCategory.toLowerCase() === "movie roles") {
			setLocalCurrentCategory("movie roles");
			setMediaToShow(movieTopRatedRoles);
		} else if (currentCategory.toLowerCase() === "serie roles") {
			setLocalCurrentCategory("serie roles");
			setMediaToShow(serieTopRatedRoles);
		} else if (currentCategory.toLowerCase() === "actors") {
			setLocalCurrentCategory("actors");
			setMediaToShow(actorsTopRated);
    }
	}, [currentCategory]);

	return (
		<section className="bg-white gap-y-3">
			<div className="mx-auto w-full lg:w-[55%] md:flex flex-col items-center lg:block">
				<h2 className="text-2xl uppercase font-sansNarrow px-4 py-6 self-start">
					Best - world
				</h2>
				<div className="flex flex-col w-full md:w-[85%] lg:w-2/3 items-center">
					{mediaToShow.map((media, i) => {
						// console.log(currentCategory);
						if (
							localCurrentCategory === "movies" ||
							localCurrentCategory === "series" ||
							localCurrentCategory === "games"
						) {
							const year = media.releaseDate
								? getFullYear(media.releaseDate)
								: getFullYear(media.firstAirDate);

							return (
								<RankingResult
									key={i}
									index={i}
									img={media.cover}
									title={media.title}
									year={year}
									genre={media.genre}
									rating={media.activity.rating}
									ratedByCount={media.activity.ratedByCount}
								/>
							);
						} else if ( localCurrentCategory === "movie roles" || localCurrentCategory === "serie roles") {
							const year = media.movie
								? getFullYear(media.movie.releaseDate)
								: getFullYear(media.serie.firstAirDate);
							const title = media.movie ? media.movie.title : media.serie.title;
							return (
								<RankingResultRole
									key={i}
									index={i}
									img={media.characterBanner}
									title={title}
									year={year}
									actor={media.actor}
									role={media.characterName}
									rating={media.activity.rating}
									ratedByCount={media.activity.ratedByCount}
								/>
							);
						} else if (localCurrentCategory === "actors") {
							return (
								<RankingResultActor
									key={i}
									index={i}
									img={media.banner}
									name={media.personal_info.name}
									roles={media.roles}
									rating={media.activity.rating}
									ratedByCount={media.activity.ratedByCount}
								/>
							);
						}
					})}
				</div>
			</div>
		</section>
	);
};

export default RankingResults;
