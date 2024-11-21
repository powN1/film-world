import { useContext } from "react";
import { MediaQueriesContext } from "../App";
import { Link } from "react-router-dom";

const UserRatingsMedias = ({ medias }) => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);
	return (
		<div className="w-full bg-white">
			<div className="lg:w-[55%] w-full mx-auto relative text-white">
				{/* Movies, series, games etc */}
				<div className="flex flex-wrap gap-4 lg:gap-x-8 pt-16 px-2 lg:px-0 lg:w-2/3">
					{medias
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
								<div key={i} className="w-[110px] md:w-[147px] flex flex-col gap-y-2 items-center">
									<div
										className="group relative border border-gray-300"
									>
										<div className="z-10 absolute lg:text-xl text-yellow-400 w-[30px] h-[30px] md:w-[36px] md:h-[36px] flex items-center justify-center bg-gray-900 rounded-br-lg">
											{rating.rating}
										</div>
										<Link
											to={`/${basePath}/${rating.item.titleId}`}
											className="block w-[108px] h-[155px] md:w-[144px] md:h-[205px] overflow-hidden"
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
										className="px-2 text-center line-clamp-2 md:line-clamp-3 text-black"
									>
										{rating.item.title}
									</Link>
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
};

export default UserRatingsMedias;
