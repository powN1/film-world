import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import MovieSlide from "../common/MovieSlide";
import { MediaQueriesContext } from "../App";
import { DataContext } from "../App";

const categories = [{ title: "movies" }, { title: "series" }, { title: "games" }];

const WideSlider = () => {
  const { topRatedMovies, topRatedSeries, topRatedGames } = useContext(DataContext);

  const [currentCategory, setCurrentCategory] = useState("movies");
  const [currentSlidesArray, setCurrentSlidesArray] = useState(topRatedMovies);

  // Slider settings
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 8,
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
          slidesToShow: 4,
          slidesToScroll: 4,
          arrows: false,
        },
      },
    ],
  };

  const handleShowUnderline = (e) => {
    const category = e.target.innerText.toLowerCase();

    if (category !== currentCategory) {
      setCurrentCategory(category);
    }
  };

  useEffect(() => {
    if (currentCategory.toLowerCase() === categories[0].title.toLowerCase()) setCurrentSlidesArray(topRatedMovies);
    if (currentCategory.toLowerCase() === categories[1].title.toLowerCase()) setCurrentSlidesArray(topRatedSeries);
    if (currentCategory.toLowerCase() === categories[2].title.toLowerCase()) setCurrentSlidesArray(topRatedGames);
  }, [currentCategory]);

  return (
    <div className={"flex flex-col py-10 gap-y-5 bg-black text-white"}>
      <h2 className={"uppercase text-4xl font-bold text-center tracking-tighter font-sansNarrow text-gray-100"}>
        Most popular
      </h2>
      <ul
        className={
          "w-[55%] max-lg:w-full max-lg:flex-wrap max-lg:justify-center mx-auto list-none flex justify-center relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:h-[1px] after:w-full after:-translate-y-[50%] after:bg-gray-800"
        }
      >
        {categories.map((category, i) => {
          return (
            <li key={i}>
              <Link
                path="/"
                className={
                  "block px-5 py-2 relative capitalize duration-300 after:content-[''] after:z-10 after:absolute after:bottom-0 after:h-[3px] after:bg-yellow-400 after:duration-300 after:transition-[width_left] " +
                  (currentCategory === category.title.toLowerCase()
                    ? "after:w-[100%] after:left-0 "
                    : "after:w-[0%] after:left-[50%] text-gray-400 hover:text-white")
                }
                onClick={handleShowUnderline}
              >
                {category.title}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="w-[95%] self-center">
        <Slider {...settings}>
          {currentSlidesArray.slice(0, 16).map((media, i) => {
            const mediaLink = `${media.itemType.slice(0, -1)}/${media.titleId}`;
            return (
              <MovieSlide
                key={i}
                mediaLink={mediaLink}
                title={media.title}
                img={media.cover}
                ranking={media.ranking ? movie.ranking : null}
                type="movie"
              />
            );
          })}
        </Slider>
      </div>
      <Link
        to="/ranking"
        className="w-[90%] lg:w-1/5 text-center self-center py-3 max-lg:px-10 border border-gray-300 font-bold mt-8 hover:bg-white hover:text-black duration-500"
      >
        Check most popular movies
      </Link>
    </div>
  );
};

export default WideSlider;
