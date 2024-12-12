import { Link } from "react-router-dom";

const PersonKnownForSlide = ({ mediaLink, cover, filmTitle }) => {
	return (
		<Link
			to={mediaLink}
			className="relative flex flex-col md:mx-3 items-center cursor-pointer group"
		>
			<div className="overflow-hidden border border-gray-400 h-[200px] w-[140px] md:h-[205px] md:w-[145px]">
				<img
					src={cover}
					alt={`film image`}
					className="relative h-full w-full object-cover group-hover:scale-110 duration-300"
				/>
			</div>
			<div className="w-full flex flex-col gap-y-1 md:gap-y-4 py-3 items-center text-center duration-300 group-hover:bg-gray-200/70">
				<p>{filmTitle}</p>
			</div>
		</Link>
	);
};

export default PersonKnownForSlide;
