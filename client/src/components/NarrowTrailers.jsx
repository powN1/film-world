import { Link } from "react-router-dom";
import MovieSlide from "../common/MovieSlide";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../App";

const NarrowTrailers = ({ type }) => {
	const { popularMovies, topRatedSeries, anticipatedGames } = useContext(DataContext);

  const [slidesToShow, setSlidesToShow] = useState([])

  useEffect(() => {
    if(type === "movies") setSlidesToShow(popularMovies);
    if(type === "series") setSlidesToShow(topRatedSeries);
    if(type === "games") setSlidesToShow(anticipatedGames);
  }, [ ])

	return (
		<div className="w-full bg-white">
			<div className="mx-auto lg:w-[55%] flex flex-col py-10 gap-y-5 bg-transparent text-black bg-white">
				<h2 className="uppercase text-4xl font-thin text-center tracking-wider font-sansNarrow">
					Trailers
				</h2>
				<div className="w-full self-center flex md:gap-x-3 overflow-x-scroll">
					{slidesToShow.map((movie, i) => {
						return (
							<MovieSlide
								key={i}
								title={movie.title}
								img={movie.banner}
								ranking={movie.activity.rating ? movie.activity.rating : null}
								description={movie.description}
								type="trailer"
								scrollable={true}
								pegi={movie.pegi}
                year={movie.year}
							/>
						);
					})}
				</div>
				<Link
					path="/"
					className="w-[90%] lg:w-1/5 text-center self-center py-3 max-lg:px-10 border border-gray-300 font-bold mt-8 hover:bg-black hover:text-white duration-500"
				>
					Check all trailers
				</Link>
			</div>
		</div>
	);
};

export default NarrowTrailers;
