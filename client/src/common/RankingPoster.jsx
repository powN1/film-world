import { FaRegEye } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

const RankingPoster = ({ title, img, rating, peopleAwaiting }) => {
	return (
		<div className="group cursor-pointer w-full [box-shadow:_2px_2px_6px_rgb(0_0_0_/_30%)]">
			<div className="h-[200px] overflow-hidden">
				<img
					src={img}
					alt={`${title} image`}
					className="h-full object-cover group-hover:scale-110 duration-700"
				/>
			</div>
			<div className="flex justify-center items-center gap-x-1 bg-black py-7 duration-300 group-hover:bg-white">
				{rating ? (
					<FaStar className="text-yellow-400 text-xl" />
				) : (
					<FaRegEye className="text-green-400 text-xl" />
				)}

				<p className="text-white font-bold duration-300 group-hover:text-black">
					{rating ? rating : peopleAwaiting}
				</p>
			</div>
		</div>
	);
};

export default RankingPoster;
