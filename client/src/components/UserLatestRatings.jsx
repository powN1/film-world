import { Link } from "react-router-dom";
import { MediaQueriesContext } from "../App";
import { useContext } from "react";

const UserLatestRatings = ({ ratings }) => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);
	return (
		ratings.length !== 0 && (
			<div className="w-full bg-white">
				<div className="lg:w-[55%] flex flex-col gap-y-6 w-full py-8 md:py-12 lg:py-16 px-3 md:px-16 lg:px-0 mx-auto relative">
					<h2 className="text-xl lg:text-3xl font-bold">Latest ratings</h2>
					<div className="flex gap-x-4 lg:gap-x-8">
						{ratings.slice(0, mobileView ? 3 : tabletView ? 4 : 6).map((rating, i) => {
							// Link path to movie/serie/game
							const mediaLink = `/${rating.itemType.slice(0, -1)}/${rating.item.titleId}`;
;
							return (
								<div key={i} className="w-[105px] md:w-[144px] flex flex-col gap-y-2 items-center">
									<div
										className="group relative border border-gray-300"
									>
										<div className="z-10 absolute lg:text-xl text-yellow-400 w-[30px] h-[30px] md:w-[36px] md:h-[36px] flex items-center justify-center bg-gray-900 rounded-br-lg">
											{rating.rating}
										</div>
										<Link
											to={mediaLink}
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
										to={mediaLink}
										className="px-2 text-center line-clamp-2 md:line-clamp-3"
									>
										{rating.item.title}
									</Link>
								</div>
							);
						})}
					</div>
					<Link
						to="details"
            state={{ category: "ratings" }} 
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
