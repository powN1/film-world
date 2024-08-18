import { Link } from "react-router-dom";
import MovieSlide from "../common/MovieSlide";
import { dummyDataGames } from "../common/dummyDataGames";

const NarrowTrailers = () => {

	return (
		<div className="w-full bg-white">
			<div className="mx-auto lg:w-[55%] flex flex-col py-10 gap-y-5 bg-transparent text-black bg-white">
				<h2 className="uppercase text-4xl font-thin text-center tracking-wider font-sansNarrow">
					Trailers
				</h2>
				<div className="w-full self-center flex md:gap-x-3 overflow-x-scroll">
					{dummyDataGames.map((movie, i) => {
						return (
							<MovieSlide
								key={i}
								title={movie.name}
								img={movie.img}
								ranking={movie.ranking ? movie.ranking : null}
								description={movie.description}
								type="trailer"
								scrollable={true}
								pegi={movie.pegi}
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
