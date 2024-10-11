import { Link } from "react-router-dom";
import Review from "../common/Review";
import { useContext } from "react";
import { DataContext } from "../App";
import { getFullYear } from "../common/date";

const NewestReviews = () => {
	const { latestGamesReviews } = useContext(DataContext);

	return (
		<div className="bg-white">
			<div className="md:w-[90%] lg:w-[55%] mx-auto flex flex-col py-10 gap-y-5">
				<h2 className="uppercase text-4xl font-thin text-center tracking-wide font-sansNarrow text-black">
          Newest reviews
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mb-8">
					{latestGamesReviews.slice(0,2).map((review, i) => {
						let { author: { personal_info } } = review;
            const year = getFullYear(review.referredMedia.releaseDate) || (review.referredMedia.firstAirDate);
						return (
							<Review
								key={i}
								img={review.banner}
                name={review.referredMedia.title}
								title={review.title}
								year={year}
								author={personal_info}
								rating={review.activity.rating}
								description={review.description}
                type="big"
							/>
						);
					})}
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
					{latestGamesReviews .slice(2,5).map((review, i) => {
						let { author: { personal_info }, } = review;
            const year = getFullYear(review.referredMedia.releaseDate) || getFullYear(review.referredMedia.firstAirDate);
						return (
							<Review
								key={i}
								img={review.banner}
                name={review.referredMedia.title}
								title={review.title}
								year={year}
								author={personal_info}
								rating={review.activity.rating}
								description={review.description}
							/>
						);
					})}
				</div>

				<Link
					path="/"
					className="w-[90%] lg:w-1/3 text-center self-center py-3 border border-gray-300 font-bold mt-3 hover:bg-black hover:text-white duration-500"
				>
					See all news
				</Link>
			</div>
		</div>
	);
};

export default NewestReviews;
