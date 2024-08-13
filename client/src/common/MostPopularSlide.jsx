import { Link } from "react-router-dom";

const MostPopularSlide = ({ title, img, actor, role, ranking }) => {
	return (
		<Link
			to=""
			className="relative flex flex-col items-center gap-y-3 cursor-pointer"
		>
			<div className="w-[150px] h-[150px] overflow-hidden border border-gray-700">
				<img
					src={img}
					alt={`${title} image`}
					className="relative h-full w-full object-cover"
				/>
			</div>
			<div className="flex flex-col gap-y-1 items-center text-center">
				<p>
					{actor} as {role}
				</p>
				<p className="line-clamp-2 text-gray-500 text-sm">{title}</p>
			</div>
			<div className="absolute top-2 right-2 lg:right-1 uppercase bg-gray-400 text-black p-1  font-sansNarrow">
				#{ranking} top
			</div>
		</Link>
	);
};

export default MostPopularSlide;
