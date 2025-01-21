import { useContext } from "react";
import RankingResult from "./RankingResult";
import { getFullYear } from "../common/date";
import { RankingContext } from "../pages/RankingPage";
import RankingResultActor from "./RankingResultActor";
import RankingResultRole from "./RankingResultRole";

const RankingResults = () => {
  const { localCurrentCategory, mediaToShow, currentGenre, currentCountry, currentYear } = useContext(RankingContext);

  return (
    <section className="bg-white gap-y-3">
      <div className="mx-auto w-full lg:w-[55%] md:flex flex-col items-center lg:block">
        <h2 className="text-2xl uppercase font-sansNarrow px-4 py-6 self-start">
          Best {localCurrentCategory} {(currentGenre || currentCountry || currentYear) && " - "}
          <span>
            {currentGenre && currentGenre} {currentCountry && "from " + currentCountry}{" "}
            {currentYear && "in " + currentYear}
          </span>
        </h2>
        <div className="flex flex-col w-full md:w-[85%] lg:w-2/3 items-center">
          {mediaToShow.map((media, i) => {
            let type;
            if (localCurrentCategory === "movies" || localCurrentCategory === "movie roles") type = "movie";
            else if (localCurrentCategory === "series" || localCurrentCategory === "serie roles") type = "serie";
            else if (localCurrentCategory === "games") type = "game";

            const ratingFixed = media.activity.rating && media.activity.rating.toFixed(2);
            if (
              localCurrentCategory === "movies" ||
              localCurrentCategory === "series" ||
              localCurrentCategory === "games"
            ) {
              const year = media.releaseDate ? getFullYear(media.releaseDate) : getFullYear(media.firstAirDate);

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
            } else if (localCurrentCategory === "movie roles" || localCurrentCategory === "serie roles") {
              console.log(media)
              const year = media.movie ? getFullYear(media.movie.releaseDate) : getFullYear(media.serie.firstAirDate);
              const title = media.movie ? media.movie.title : media.serie.title;
              const titleId = media.movie ? media.movie.titleId : media.serie.titleId;
              return (
                <RankingResultRole
                  key={i}
                  index={i}
                  type={type}
                  img={media.characterBanner || media.actor.banner}
                  title={title}
                  titleId={titleId}
                  year={year}
                  actor={media.actor}
                  nameId={media.actor.personal_info.nameId}
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
                  nameId={media.personal_info.nameId}
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
