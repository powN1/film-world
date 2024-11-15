import { Link } from "react-router-dom";

const UserHighestMovieRatings = ({ ratings }) => {
	const highestRatedMovies = ratings
		.filter((rating) => rating.itemType === "movies")
		.sort((a, b) => b.rating - a.rating)
		.slice(0, 6);
	return (
		ratings && (
			<div className="w-full bg-gray-100 py-8">
				<div className="lg:w-[55%] flex flex-col gap-y-4 w-full mx-auto relative">
					<h2 className="text-3xl font-bold">Movies</h2>
					<h2 className="text-2xl font-bold">Highest rated</h2>
					<div className="flex gap-x-8">
						{highestRatedMovies
							.map((rating, i) => {
								// Link path to movie/serie/game
								const basePath =
									rating.itemType === "movies"
										? "movie"
										: rating.itemType === "series"
											? "serie"
											: rating.itemType === "games"
												? "game"
												: "";
								return (
									<div className="w-[144px] flex flex-col gap-y-2 items-start">
										<div key={i} className="group relative border border-gray-300" >
											<div className="z-10 absolute text-yellow-400 w-[36px] h-[36px] flex items-center justify-center bg-gray-900 rounded-br-lg text-xl">
												{rating.rating}
											</div>
											<Link
												to={`/${basePath}/${rating.item.titleId}`}
												className="block w-[144px] h-[205px] overflow-hidden"
											>
												<img
													src={rating.item.cover}
													alt="cover"
													className="h-full w-full object-cover group-hover:scale-110 duration-700"
												/>
											</Link>
										</div>

										<Link
											to={`/${basePath}/${rating.item.titleId}`}
											className="px-2 text-center"
										>
											{rating.item.title}
										</Link>
									</div>
								);
							})}
					</div>
					<Link
						to="ratings"
						className="w-[90%] flex justify-center items-center gap-x-2 lg:w-1/4 self-center py-3 max-lg:px-10 border border-gray-300 font-bold mt-8 hover:bg-black hover:text-white duration-500"
					>
						See all rated
						<div className="bg-yellow-400 px-3 text-sm rounded-md">
							{ratings.length}
						</div>
					</Link>
				</div>
			</div>
		)
	);
};

export default UserHighestMovieRatings;
