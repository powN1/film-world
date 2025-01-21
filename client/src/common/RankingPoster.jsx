import { FaRegEye } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const RankingPoster = ({ mediaLink, title, img, rating, peopleAwaiting }) => {
	return (
		<Link to={mediaLink} className="w-full max-lg:w-[30%] flex flex-col gap-y-3 group cursor-pointer">
			<div className="[box-shadow:_2px_2px_6px_rgb(0_0_0_/_30%)]">
				<div className="h-[150px] lg:h-[200px] 3xl:h-[270px] overflow-hidden">
					<img
						src={img}
						alt={`${title} image`}
						className="h-full w-full object-cover group-hover:scale-110 duration-700"
					/>
				</div>
				<div className="flex justify-center items-center gap-x-1 bg-black py-7 max-lg:py-4 duration-300 group-hover:bg-white">
					{rating ? ( <FaStar className="text-yellow-400 text-xl" />) : ( <FaRegEye className="text-green-400 text-xl" />)}

					<p className="text-white font-bold duration-300 group-hover:text-black">
						{rating ? rating.toFixed(2) : peopleAwaiting}
					</p>
				</div>
			</div>
			<p className="text-center line-clamp-2">{title}</p>
		</Link>
	);
};

export default RankingPoster;
