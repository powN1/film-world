import { Link } from "react-router-dom";

const FilmCastSlide = ({ actor, link, characterName }) => {
	return (
		<Link
			to={`/person/${link}`}
			className="relative flex flex-col md:mx-3 items-center cursor-pointer group"
		>
			<div className="overflow-hidden border border-gray-400 h-[150px] w-[100px] md:h-[220px] md:w-[145px]">
				<img
					src={actor.banner}
					alt={`image`}
					className="relative h-full w-full object-cover group-hover:scale-110 duration-300"
				/>
			</div>
			<div className="w-full flex flex-col gap-y-1 md:gap-y-4 py-3 items-center text-center duration-300 group-hover:bg-gray-200/70">
				<p>{actor.personal_info.name}</p>
				<p className="text-gray-400">{characterName}</p>
			</div>
		</Link>
	);
};

export default FilmCastSlide;
