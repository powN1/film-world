import { FaStar } from "react-icons/fa";
import FilmRolesRankingSlide from "./FilmRolesRankingSlide";

const FilmRolesRanking = ({ media, actorSpecific }) => {
	return (
		<div className="bg-gray-100 border-y border-gray-200 py-6 md:py-10">
			<div className="flex flex-col px-4 md:px-12 lg:px-0 gap-y-5 mx-auto lg:w-[55%]">
				<h3 className="text-lg font-bold">Role ranking</h3>
				{actorSpecific && (
					<div className="flex items-center gap-x-2 text-2xl">
						<FaStar className="text-yellow-400" />
						<p>{media.activity.rating}</p>
						<p className="flex items-center gap-x-1 mt-[1px] text-gray-400">
							<span className="text-xs -mb-[1px]">
								{media.activity.ratedByCount}
							</span>
							<span className="text-xs -mt-[1px]">ratings</span>
						</p>
					</div>
				)}
				<div className="flex gap-x-3 md:gap-x-0 pb-4 overflow-x-auto">
					{media.roles.map((role, i) => {
						return (
							<FilmRolesRankingSlide
								key={i}
								actor={role.actor}
								role={role}
								actorSpecific={actorSpecific}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default FilmRolesRanking;
