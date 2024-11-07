import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const FilmRolesRankingSlide = ({ actor, role }) => {
	return (
		<Link
			to=""
			className="min-w-[185px] w-[185px] md:min-w-[155px] md:w-[155px] lg:min-w-[185px] lg:w-[185px] relative flex flex-col md:mx-3 items-center cursor-pointer group"
		>
			<div className="overflow-hidden border border-gray-400 aspect-square">
				<img
					src={role.characterBanner}
					alt={`role image`}
					className="relative h-full w-full object-cover group-hover:scale-110 duration-300"
				/>
			</div>
			<div className="w-full flex flex-col gap-y-4 py-3 items-center text-center duration-300">
				<p> {actor.personal_info.name} </p>

				<p className="text-sm">{role.characterName}</p>

				<div className="w-full flex justify-center items-center gap-x-3">
					<div className="flex items-center gap-x-1">
						<FaStar className="text-yellow-400" />
						<p>{role.activity.rating.toFixed(1)}</p>
					</div>
					<p className="text-gray-400 flex items-center justify-center">{role.activity.ratedByCount} ratings</p>
				</div>
			</div>
		</Link>
	);
};

export default FilmRolesRankingSlide;
