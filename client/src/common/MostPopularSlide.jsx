import { Link } from "react-router-dom";
import { CiHeart } from "react-icons/ci";

const MostPopularSlide = ({ title, img, actor, role, ranking, character, gameName, }) => {
	return (
		<Link
			to=""
			className="relative flex flex-col mx-3 items-center cursor-pointer group"
		>
			<div
				className={
					"overflow-hidden border " +
					(gameName ? "border-gray-400 " : "border-gray-700 ") +
					(actor ? "aspect-square" : character || gameName ? "h-[220px]" : "")
				}
			>
				<img
					src={img}
					alt={`image`}
					className="relative h-full w-full object-cover group-hover:scale-110 duration-300"
				/>
			</div>
			<div
				className={
					"flex flex-col gap-y-2 py-3 items-center text-center duration-300 " +
					(actor ? "group-hover:bg-gray-200/15" : null)
				}
			>
				<p>
					{actor
						? `${actor.personal_info.name} as ${role}`
						: character
							? `${character}`
							: `${gameName}`}
				</p>
				{actor && <p className="line-clamp-2 text-gray-500 text-sm">{title}</p>}
			</div>
			{(role && ranking) && (
				<div className={"absolute top-2 right-0 lg:right-0 translate-x-2 uppercase text-black p-1 font-sansNarrow duration-300 " + (ranking >= 9 ? "bg-yellow-400 hover:bg-yellow-300" : "bg-gray-300 hover:bg-gray-200")}>
					#{ranking} top
				</div>
			)}

			{character && (
				<CiHeart className="absolute top-1 left-1 text-3xl text-gray-400 hover:text-red-600 hover:scale-110" />
			)}
		</Link>
	);
};

export default MostPopularSlide;
