import { dummyDataMovies } from "../common/dummyDataMovies";
import RankingResult from "./RankingResult";

const RankingResults = () => {
	return (
		<section className="bg-white gap-y-3">
			<div className="mx-auto w-full lg:w-[55%] md:flex flex-col items-center lg:block">
				<h2 className="text-2xl uppercase font-sansNarrow px-4 py-6 self-start">Best - world</h2>
				<div className="flex flex-col w-full md:w-[85%] lg:w-2/3 items-center">
					{dummyDataMovies.map((movie, i) => (
						<RankingResult
							key={i}
							index={i}
							img={movie.img}
							title={movie.title}
							year={movie.year}
							genre={movie.genre}
							rating={movie.rating}
							ratedByCount={movie.ratedByCount}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default RankingResults;
