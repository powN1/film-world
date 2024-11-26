import { Link } from "react-router-dom";
import { FaRegStar, FaStar } from "react-icons/fa";
import { LiaCommentSolid } from "react-icons/lia";

const FilmReviews = ({ media }) => {
	return (
		media.reviews.length !== 0 && (
			<div className="w-full bg-white">
				<div className="mx-auto lg:w-[55%]">
					<div className="relative flex flex-col gap-y-3 w-full px-4 sm:px-12 lg:px-0 lg:w-2/3 py-4 lg:py-8">
						<h3 className="text-lg font-bold">Review of {media.title}</h3>
						{media.reviews.map((review, i) => (
							<div key={i} className="w-full flex">
								<Link
									to={`/review/${review.review_id}`}
									className="h-[210px] w-[240px] min-w-[240px] border border-gray-400/50 group overflow-hidden"
								>
									<img
										src={review.banner}
										alt="media poster"
										className="h-full w-full object-cover group-hover:scale-110 duration-300"
									/>
								</Link>
								<div className="flex flex-col gap-y-2 px-3">
									<Link
										to={`/review/${review.review_id}`}
										className="text-xl font-bold hover:text-gray-500 duration-200"
									>
										{review.title}
									</Link>
									<div className="line-clamp-3 text-sm">
										{review.content[0].blocks[0].data.text}
									</div>
									<Link
										to={`/review/${review.review_id}`}
                    className="flex items-center gap-x-1 py-1 text-sm text-gray-500 hover:text-yellow-400 duration-200 self-start">
										<LiaCommentSolid className="text-xl" />
										{review.comments.length} comments
									</Link>
									<div className="flex flex-col gap-y-1 mt-auto">
										<div className="flex items-center gap-x-2">
											<Link
												to={`/user/${review.author.personal_info.username}`}
												className="h-[36px] w-[36px] min-w-[36px] border border-gray-400/50 rounded-full p-[1px]"
											>
												<img
													src={review.author.personal_info.profile_img}
													alt="author photo"
													className="h-full w-full object-cover rounded-full"
												/>
											</Link>
											<Link
												to={`/user/${review.author.personal_info.username}`}
												className="py-1 capitalize font-bold text-sm"
											>
												{review.author.personal_info.firstName}{" "}
												{review.author.personal_info.surname}
											</Link>
										</div>
										<div className="flex items-center gap-x-1">
											<div>{review.activity.rating}</div>
											<div className="flex gap-x-[1px]">
												{[...Array(10)].map((_, i) =>
													i < review.activity.rating ? (
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
						))}
					</div>
				</div>
			</div>
		)
	);
};

export default FilmReviews;
