import { Link } from "react-router-dom";
import Review from "../common/Review";
import { getFullYear } from "../common/date";
import { useContext } from "react";
import { MediaQueriesContext } from "../App";

const UserLatestReviews = ({ author, reviews }) => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);
	return (
		reviews.length !== 0 && (
			<div className="w-full bg-white">
				<div className="w-full lg:w-[55%] flex flex-col gap-y-3 lg:gap-y-6 px-3 md:px-16 lg:px-0 pt-16 pb-8 md:pb-0 mx-auto relative justify-between">
					<h2 className="text-xl lg:text-3xl font-bold">Latest reviews</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
						{reviews.slice(0, mobileView ? 1 : tabletView ? 2 : 3).map((review, i) => {
							const year = getFullYear(review.referredMedia.releaseDate) || getFullYear(review.referredMedia.firstAirDate);

              const mediaLink = `/${review.referredMedia.itemType.slice(0, -1)}/${review.referredMedia.titleId}`

							return (
								<Review
									key={i}
									img={review.banner}
                  link={review.review_id}
                  mediaLink={mediaLink}
									name={review.referredMedia.title}
									title={review.title}
									year={year}
									author={author}
									rating={review.activity.rating}
									description={review.description}
								/>
							);
						})}
					</div>

					<Link
						to="texts"
            state={{ category: "reviews" }}
						className="w-[90%] lg:w-1/4 text-center self-center py-3 max-lg:px-10 border border-gray-300 font-bold mt-8 hover:bg-black hover:text-white duration-500"
					>
						See all
					</Link>
				</div>
			</div>
		)
	);
};

export default UserLatestReviews;
