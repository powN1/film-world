import { useContext } from "react";
import { FaStar } from "react-icons/fa";
import { FaRegCirclePlay } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { MediaQueriesContext } from "../App";
import { getFullYear } from "../common/date";

const MainPreviewSingle = ({ type, media }) => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);

	return (
		<section className="w-full mx-auto flex flex-col">
			<div className="h-[50vh] lg:w-[55%] w-full mx-auto relative text-white">
				<Link
					to={""}
					style={{
						backgroundImage: `linear-gradient(to bottom ,rgba(0,0,0,1) 2%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 98%), ${mobileView ? "" : "linear-gradient(to right, rgba(0,0,0,1) 5%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 95%),"} url(${media.banner})`,
					}}
					className="h-full w-full block bg-cover bg-center bg-no-repeat transition-opactiy duration-500 "
				></Link>

				{/* Media info */}
				<div className="w-full absolute left-0 bottom-[5%] px-3 md:px-12 lg:px-0 flex flex-col gap-y-1 lg:gap-y-2 transition-opacity duration-500">
					<span className="text-yellow-500 font-black uppercase text-xs -mb-2">
						{type === "movie" ? "movie" : type === "serie" ? "serie" : type === "game" ? "game" : null}
					</span>
					<h2 className="text-3xl font-bold font-sansNarrow">{media.title}</h2>

					<div className="gap-x-5 flex text-sm text-gray-400">
						<p>{media.title}</p>
						{type === "movie" ? (
							<>
								<span>{media.length} min.</span>
								<span>{media.year}</span>
							</>
						) : type === "serie" ? (
							<>
								<span>
									{getFullYear(media.firstAirDate)} -{" "}
									{getFullYear(media.lastAirDate)}
								</span>
							</>
						) : type === "game" ? (
							<span>{media.year}</span>
						) : null}
					</div>

					<div className="flex flex-col gap-y-1 self-start">
						<div className="flex items-center gap-x-2">
							<FaStar className="text-2xl text-yellow-400" />
							<p className="text-2xl">{media.activity.rating}</p>
						</div>
						<p className="flex gap-x-1 items-center justify-center lg:justify-start">
							<span className="text-sm">{media.activity.ratedByCount}</span>
							<span className="text-sm">ratings</span>
						</p>
					</div>
				</div>
				<FaRegCirclePlay className="absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-7xl transition-all duration-500 ease-in-out" />
			</div>
		</section>
	);
};

export default MainPreviewSingle;
