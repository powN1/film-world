import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MediaQueriesContext } from "../App";

const UserHighestRatings = ({ type, ratings }) => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);
	const [highestRatedMedia, setHighestRatedMedia] = useState([]);

  const [numberOfMediasToShow, setnumberOfMediasToShow] = useState(3);

	useEffect(() => {
		let highestRatedMediaFiltered;
		if (type === "movies") {
			highestRatedMediaFiltered = ratings
				.filter((rating) => rating.itemType === "movies")
				.sort((a, b) => b.rating - a.rating)
				.slice(0, 6);
		} else if (type === "series") {
			highestRatedMediaFiltered = ratings
				.filter((rating) => rating.itemType === "series")
				.sort((a, b) => b.rating - a.rating)
				.slice(0, 6);
		} else if (type === "games") {
			highestRatedMediaFiltered = ratings
				.filter((rating) => rating.itemType === "games")
				.sort((a, b) => b.rating - a.rating)
				.slice(0, 6);
		}
    setnumberOfMediasToShow(mobileView ? 3 : tabletView ? 4 : 6);
		setHighestRatedMedia(highestRatedMediaFiltered);
	}, []);

	return (
		highestRatedMedia.length !== 0 && (
			<div className="w-full bg-gray-100 bg-gradient-to-b from-gray-100 to-white">
				<div className="lg:w-[55%] flex flex-col gap-y-6 py-8 md:py-12 lg:py-16 px-3 md:px-16 w-full mx-auto relative">
					<h2 className="text-3xl font-bold capitalize">{type}</h2>
					<h2 className="text-xl lg:text-2xl font-bold -mt-1">Highest rated {type}</h2>
					<div className="flex gap-x-4 lg:gap-x-8">
						{highestRatedMedia.slice(0, numberOfMediasToShow).map((rating, i) => {
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
								<div
									key={i}
									className="w-[105px] md:w-[144px] flex flex-col gap-y-2 items-center"
								>
									<div className="group relative border border-gray-300">
										<div className="z-10 absolute lg:text-xl text-yellow-400 w-[30px] h-[30px] md:w-[36px] md:h-[36px] flex items-center justify-center bg-gray-900 rounded-br-lg text-xl">
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
										className="px-2 text-center line-clamp-2 md:line-clamp-3"
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
						See all rated {type}
						<div className="bg-yellow-400 px-3 text-sm rounded-md text-black">
							{highestRatedMedia.length}
						</div>
					</Link>
				</div>
			</div>
		)
	);
};

export default UserHighestRatings;
