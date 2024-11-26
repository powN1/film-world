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
		latestMovies,
		topRatedMovies,
		topRatedSeries,
		latestSeries,
		topRatedGames,
		movieTopRatedRoles,
		movieTopRatedMaleRoles,
		movieTopRatedFemaleRoles,
		serieTopRatedRoles,
		serieTopRatedMaleRoles,
		serieTopRatedFemaleRoles,
		actorsTopRated,
	} = useContext(DataContext);
	// console.log("female movie roles", movieTopRatedFemaleRoles)

	const [mediaToShow, setMediaToShow] = useState([]);
	const [localCurrentCategory, setLocalCurrentCategory] = useState([]);

	useEffect(() => {
		// Show specific media given specific category that user chose
		if (currentCategory.toLowerCase() === "movies") {
			setLocalCurrentCategory("movies");
			if (currentSubCategory === "top 500") {
				setMediaToShow(topRatedMovies);
			} else if (currentSubCategory === "new") {
				setMediaToShow(latestMovies);
			}
		} else if (currentCategory.toLowerCase() === "series") {
			setLocalCurrentCategory("series");
			if (currentSubCategory === "top 500") {
				setMediaToShow(topRatedSeries);
			} else if (currentSubCategory === "new") {
				setMediaToShow(latestSeries);
			}
		} else if (currentCategory.toLowerCase() === "games") {
			setLocalCurrentCategory("games");
			setMediaToShow(topRatedGames);
		} else if (currentCategory.toLowerCase() === "movie roles") {
			setLocalCurrentCategory("movie roles");
			if (currentSubCategory === "male") {
				setMediaToShow(movieTopRatedMaleRoles);
			} else if (currentSubCategory === "female") {
				setMediaToShow(movieTopRatedFemaleRoles);
			}
		} else if (currentCategory.toLowerCase() === "serie roles") {
			setLocalCurrentCategory("serie roles");
			if (currentSubCategory === "male") {
				setMediaToShow(serieTopRatedMaleRoles);
			} else if (currentSubCategory === "female") {
				setMediaToShow(serieTopRatedFemaleRoles);
			}
		} else if (currentCategory.toLowerCase() === "actors") {
			setLocalCurrentCategory("actors");
			setMediaToShow(actorsTopRated);
		}
	}, [currentCategory, currentSubCategory]);

	return (
		<section className="bg-white gap-y-3">
			<div className="mx-auto w-full lg:w-[55%] md:flex flex-col items-center lg:block">
				<h2 className="text-2xl uppercase font-sansNarrow px-4 py-6 self-start">
					Best - world
				</h2>
				<div className="flex flex-col w-full md:w-[85%] lg:w-2/3 items-center">
					{mediaToShow.map((media, i) => {
            const ratingFixed = media.activity.rating.toFixed(2);
						// console.log(currentCategory);
						if (
							localCurrentCategory === "movies" ||
							localCurrentCategory === "series" ||
							localCurrentCategory === "games"
						) {
							const year = media.releaseDate
								? getFullYear(media.releaseDate)
								: getFullYear(media.firstAirDate);

							let type;
							if (localCurrentCategory === "movies") type = "movie";
							else if (localCurrentCategory === "series") type = "serie";
							else if (localCurrentCategory === "games") type = "game";

							return (
								<RankingResult
									key={i}
									type={type}
									index={i}
									img={media.cover}
									title={media.title}
									titleId={media.titleId}
									year={year}
									genre={media.genre}
									rating={ratingFixed}
									ratedByCount={media.activity.ratedByCount}
								/>
							);
						} else if (
							localCurrentCategory === "movie roles" ||
							localCurrentCategory === "serie roles"
						) {
              console.log('media rating for role is', media.activity.rating)
              console.log(media.activity.rating.toFixed(2))
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
									rating={ratingFixed}
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
									rating={ratingFixed}
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
