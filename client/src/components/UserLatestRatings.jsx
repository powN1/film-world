import { Link } from "react-router-dom";

const UserLatestRatings = ({ ratings }) => {
	return (
		ratings && (
			<div className="w-full bg-white">
				<div className="lg:w-[55%] flex flex-col gap-y-6 w-full py-16 mx-auto relative">
					<h2 className="text-3xl font-bold">Latest ratings</h2>
					<div className="flex gap-x-8">
						{ratings.slice(0, 6).map((rating, i) => {
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
								<div className="flex flex-col gap-y-2 items-center">
									<div
										key={i}
										className="group relative border border-gray-300"
									>
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
						className="w-[90%] lg:w-1/4 text-center self-center py-3 max-lg:px-10 border border-gray-300 font-bold mt-8 hover:bg-black hover:text-white duration-500"
					>
						See all
					</Link>
				</div>
			</div>
		)
	);
};

export default UserLatestRatings;
