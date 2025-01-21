import { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { DataContext, MediaQueriesContext } from "../App";
import MostPopularSlide from "../common/MostPopularSlide";

const MostPopular = ({ type, category }) => {
  const { movieTopRatedRoles, serieRoles, characters, topRatedGames } = useContext(DataContext);

  const roles = category === "movies" ? movieTopRatedRoles : serieRoles
  const currentCharacters = characters 
  const games = topRatedGames 

  // Slider settings
  // NOTE: Slides for roles: Small screens 2 slides, medium 5, large 5
  // NOTE: Slides for chars: Small screens 2 slides, medium 5, large 6
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: type === "roles" ? 5 : 6,
    slidesToScroll: type === "roles" ? 5 : 6,
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
          slidesToShow: 5,
          slidesToScroll: 5,
          arrows: false,
        },
      },
      {
        // 2k view
        breakpoint: 3840,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
          arrows: true,
        },
      },
    ],
  };

  return (
    <div className={"flex flex-col py-10 gap-y-5 text-white " + (type !== "games" ? "bg-black" : "bg-white")}>
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
      <div className={"w-full lg:w-[55%] self-center " + (type !== "games" ? "" : "text-black")}>
        {
          <Slider {...settings}>
            {type === "roles"
              ? roles.slice(0, 15).map((role, i) => {
                  const link = `/person/${role.actor.personal_info.nameId}`;
                  return (
                    <MostPopularSlide
                      key={i}
                      title={role.filmTitle}
                      img={role.characterBanner}
                      link={link}
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
                : type === "games"
                  ? games.map((game, i) => {
                      const link = `/game/${game.titleId}`;
                      return <MostPopularSlide key={i} link={link} gameName={game.title} img={game.cover} />;
                    })
                  : null}
          </Slider>
        }
      </div>
    </div>
  );
};

export default MostPopular;
