import { Link } from "react-router-dom";

const FilmCastSlide = ({ actor, characterName }) => {
	return (
		<Link
			to=""
			className="relative flex flex-col mx-3 items-center cursor-pointer group"
		>
			<div className="overflow-hidden border border-gray-400 h-[220px]">
				<img
					src={actor.banner}
					alt={`image`}
					className="relative h-full w-full object-cover group-hover:scale-110 duration-300"
				/>
			</div>
			<div className="w-full flex flex-col gap-y-4 py-3 items-center text-center duration-300 group-hover:bg-gray-200/70">
				<p>{actor.personal_info.name}</p>
				<p>{characterName}</p>
			</div>
		</Link>
	);
};

export default FilmCastSlide;
