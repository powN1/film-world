import { Link } from "react-router-dom";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

const ReviewSlide = ({
	title,
	img,
	category,
	rating,
	description,
	// author,
}) => {

	return (
		<div className="flex flex-col mx-3 my-3 gap-y-2 [box-shadow:_2px_2px_6px_rgb(0_0_0_/_7%)] h-[360px]">
			{/* Movie img */}
			<Link
				to="/"
				className="relative h-[160px] border border-gray-300 group overflow-hidden rounded-tl-sm rounded-tr-sm"
			>
				<img
					src={img}
					alt={title}
					className="h-full w-full object-cover group-hover:scale-110 duration-300"
				/>
				<div className="absolute left-0 bottom-0 p-3">
					<span className="text-yellow-400 uppercase text-xs">{category}</span>
					<p className="text-white leading-4">{title}</p>
				</div>
			</Link>
			<div className="flex flex-col px-3 pt-1 gap-y-1">
				{/* Author info */}
				<div className="flex gap-x-2">
					<Link className="relative h-[70px] w-[70px] border-2 border-green-600 rounded-full p-1">
						<img
							src=""
							alt="user picutre"
							className="h-full w-full object-cover rounded-full"
						/>
					</Link>
					<Link>{}</Link>
				</div>
				{/* Review rating */}
				<div className="flex items-center gap-x-1">
					<span className="pr-1">{rating}</span>
					{[...Array(10)].map((_, i) =>
						i < rating ? (
							<FaStar key={i} className="text-yellow-400" />
						) : (
							<FaRegStar key={i} className="text-yellow-400" />
						),
					)}
				</div>
				{/* Review description */}
				<p className="text-sm text-ellipsis line-clamp-3">{description}</p>
			</div>
		</div>
	);
};

export default ReviewSlide;
