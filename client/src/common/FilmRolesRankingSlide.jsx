import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const FilmRolesRankingSlide = ({ actor, role, actorSpecific }) => {
  const imgToShow = role.characterBanner ? role.characterBanner : actor.banner;
  const filmLink = role.movie
    ? `/movie/${role.movie.titleId}`
    : role.serie
      ? `/serie/${role.serie.titleId}`
      : `/game/${role.game.titleId}`;
  return (
    <div
      to=""
      className="min-w-[185px] w-[185px] md:min-w-[155px] md:w-[155px] lg:min-w-[185px] lg:w-[185px] relative flex flex-col md:mx-3 items-center cursor-pointer"
    >
      <div className="group overflow-hidden border border-gray-400 aspect-square">
        <img
          src={imgToShow}
          alt={`role image`}
          className="relative h-full w-full object-cover group-hover:scale-110 duration-300"
        />
      </div>
      <div className="w-full flex flex-col gap-y-4 py-3 items-center text-center duration-300">
        <p>
          {actorSpecific ? (
            role.characterName
          ) : (
            <Link to={`/person/${role.actor.personal_info.nameId}`} className="text-yellow-800 hover:text-yellow-600 duration-300">
              {role.actor.personal_info.name}
            </Link>
          )}
        </p>

        {actorSpecific ? (
          <Link to={filmLink} className="text-sm text-yellow-800 hover:text-yellow-600 duration-300">
            {actorSpecific && role.filmTitle}
          </Link>
        ) : (
          <p>{role.characterName}</p>
        )}

        <div className="w-full flex justify-center items-center gap-x-3">
          <div className="flex items-center gap-x-1">
            <FaStar className="text-yellow-400" />
            <p>{role.activity.rating.toFixed(1)}</p>
          </div>
          <p className="text-gray-400 flex items-center justify-center">{role.activity.ratedByCount} ratings</p>
        </div>
      </div>
    </div>
  );
};

export default FilmRolesRankingSlide;
