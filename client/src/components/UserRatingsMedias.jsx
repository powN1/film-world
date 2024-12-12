import { useContext } from "react";
import { MediaQueriesContext } from "../App";
import { Link } from "react-router-dom";
import { UserRatingsContext } from "../pages/UserDetailsPage";
import { FaRegEye } from "react-icons/fa";
import { IoIosCheckmark } from "react-icons/io";

const UserRatingsMedias = ({ medias }) => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);
	const { currentCategory } = useContext(UserRatingsContext);
	return (
		<div className="w-full bg-white">
			<div className="lg:w-[55%] w-full mx-auto relative text-white">
				{/* Movies, series, games etc */}
				<div className="flex flex-wrap gap-4 lg:gap-x-8 pt-16 px-2 lg:px-0 lg:w-2/3">
					{medias.map((media, i) => {
						// Link path to movie/serie/game
						const mediaLink = `/${media.item.itemType.slice(0, -1)}/${media.item.titleId}`

						return (
							<div
								key={i}
								className="w-[110px] md:w-[147px] flex flex-col gap-y-2 items-center"
							>
								<div className="group relative border border-gray-300">
									<div
										className={
											"z-10 absolute lg:text-xl text-yellow-400 w-[30px] h-[30px] md:w-[36px] md:h-[36px] flex items-center justify-center rounded-br-lg " +
											(currentCategory.toLowerCase() === "ratings" ||
											currentCategory.toLowerCase() === "favorite"
												? "bg-gray-900"
												: "bg-green-500/90")
										}
									>
										{media.rating ? (
											media.rating
										) : currentCategory.toLowerCase() === "wants to see" ? (
											<FaRegEye
												className={"text-2xl duration-300 mt-[1px] text-white"}
											/>
										) : (
											<IoIosCheckmark className="text-3xl mt-[1px]" />
										)}
									</div>
									<Link
										to={mediaLink}
										className="block w-[108px] h-[155px] md:w-[144px] md:h-[205px] overflow-hidden"
									>
										<img
											src={media.item.cover}
											alt="cover"
											className="h-full w-full object-cover group-hover:scale-110 duration-700"
										/>
									</Link>
								</div>

								<Link
									to={mediaLink}
									className="px-2 text-center line-clamp-2 md:line-clamp-3 text-black"
								>
									{media.item.title}
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
