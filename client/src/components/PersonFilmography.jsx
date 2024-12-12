import { Link } from "react-router-dom";
import { getFullDay, getFullYear } from "../common/date";

const PersonFilmography = ({ person }) => {
  const rolesSorted = person.roles.sort((a, b) => {
    const releaseDateA = a.movie ? a.movie.releaseDate : a.serie.firstAirDate;
    const releaseDateB = b.movie ? b.movie.releaseDate : b.serie.firstAirDate;
    const dateA = new Date(releaseDateA).getTime();
    const dateB = new Date(releaseDateB).getTime();
    return dateB - dateA;
  });

  return (
    <div className="bg-white py-6 md:py-10">
      <div className="py-10 lg:w-[55%] mx-auto">
        <div className="flex flex-col px-4 md:px-12 lg:px-0 gap-y-5 lg:w-2/3">
          <h3 className="text-2xl font-sansNarrow uppercase">Filmography</h3>
          {rolesSorted.map((role, i) => {
            const year = role.movie ? getFullYear(role.movie.releaseDate) : getFullYear(role.serie.firstAirDate);
            const type = role.movie ? "movie" : "serie";
            const title = role.movie ? role.movie.title : role.serie.title;
            const titleId = role.movie ? role.movie.titleId : role.serie.titleId;
            const cover = role.movie ? role.movie.cover : role.serie.cover;
            const characterName = role.characterName;
            const characterBanner = role.characterBanner;
            const filmType = role.movie ? "movie" : "serie";

            return (
              <div key={i} className="flex justify-between w-full border-b border-gray-400/25 py-5">
                <div className="flex items-center gap-x-3">
                  <p className="hidden md:block">{year}</p>
                  <div className="flex gap-x-3">
                    <Link
                      to={`/${type}/${titleId}`}
                      className="overflow-hidden border border-gray-400 w-[90px] max-w-[90px] group"
                    >
                      <img
                        src={cover}
                        alt="film image"
                        className="relative h-full w-full object-cover group-hover:scale-110 duration-300"
                      />
                    </Link>
                    <div className="flex flex-col gap-y-3">
                      <div className="flex flex-col">
                        <span className="text-xs uppercase text-yellow-400">{filmType}</span>
                        <p>{title}</p>
                        <p className="lg:hidden text-sm">{year}</p>
                      </div>
                      <p>{characterName}</p>
                    </div>
                  </div>
                </div>

                {characterBanner && (
                  <Link
                    to=""
                    className="hidden md:block overflow-hidden border border-gray-400 aspect-square w-[100px h-[100px] group"
                  >
                    <img
                      src={characterBanner}
                      alt="character img"
                      className="relative h-full w-full object-cover group-hover:scale-110 duration-300"
                    />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PersonFilmography;
