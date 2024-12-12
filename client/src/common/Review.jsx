import { FaRegStar, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const Review = ({img, link, mediaLink, name, title, year, author, rating, description, type}) => {
	return (
		<div className="flex flex-col group">
			{/* Review img */}
			<Link
				to={`/review/${link}`}
				className={ "relative group overflow-hidden rounded-tl-sm rounded-tr-sm " + (type === "big" ? "h-[220px] lg:h-[280px]" : "h-[220px] lg:h-[180px]") }
			>
				<img
					src={img}
					alt={title}
					className="h-full w-full object-cover group-hover:scale-110 duration-300"
				/>
			</Link>

			<div className="flex flex-col px-3 md:px-4 pb-6 pt-3 gap-y-2 group-hover:[box-shadow:_0px_0px_6px_rgb(0_0_0_/_25%)] duration-500 ease-in-out">
				{/* {Review media name} */}
				<p className="uppercase text-sm md:text-xs text-gray-400">
					<Link to={mediaLink} className="font-black hover:text-gray-300 cursor-pointer duration-300">{name} </Link>({year}) review
				</p>

				{/* {Review media title} */}
				<p className="text-2xl md:text-base">
          {title}
				</p>

				{/* Review description */}
				<p className="text-base md:text-sm text-ellipsis line-clamp-3 text-gray-500 py-1">{description}</p>

				{/* Author info */}
				<div className="flex items-center gap-x-2">
					<Link to={`/user/${author.username}`} className="relative h-[55px] w-[55px] rounded-full p-1">
						<img
							src={author.profile_img}
							alt="user picutre"
							className="h-full w-full object-cover rounded-full"
						/>
					</Link>
					<div>
						<Link to={`/user/${author.username}`} className="text-xl md:text-base capitalize">{author.firstName} {author.surname}</Link>

						{/* Review rating */}
						<div className="flex items-center gap-x-1">
							<span className="pr-1 text-xl md:text-base">{rating}</span>
							{[...Array(10)].map((_, i) =>
								i < rating ? (
									<FaStar key={i} className="text-yellow-400" />
								) : (
									<FaRegStar key={i} className="text-yellow-400" />
								),
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Review;
