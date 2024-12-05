import { useContext, useEffect, useState } from "react";
import { DataContext } from "../App";
import { Link, useLocation } from "react-router-dom";
import Review from "../common/Review";
import { getFullYear } from "../common/date";

const categories = [{ name: "movies" }, { name: "series" }, { name: "games" }];

const ReviewsPage = () => {
	const { latestMovieReviews, latestSeriesReviews, latestGamesReviews } =
		useContext(DataContext);

	const location = useLocation();
	const [currentCategory, setCurrentCategory] = useState("movies");

	const [reviewsToShow, setReviewsToShow] = useState([]);

	const handleMediaShow = () => {
		// Show specific media given specific category that user chose
		if (currentCategory.toLowerCase() === "movies") {
			setCurrentCategory("movies");
			setReviewsToShow(latestMovieReviews);
			console.log(latestMovieReviews);
		} else if (currentCategory.toLowerCase() === "series") {
			setCurrentCategory("series");
			setReviewsToShow(latestSeriesReviews);
		} else if (currentCategory.toLowerCase() === "games") {
			setCurrentCategory("games");
			setReviewsToShow(latestGamesReviews);
		}
	};

	const handleShowUnderline = (e) => {
		const category = e.target.innerText.toLowerCase();

		if (
			category !== currentCategory &&
			categories.map((category) => category.name).includes(category)
		) {
			setCurrentCategory(category);
		}
	};

	useEffect(() => {
		handleMediaShow();
	}, [currentCategory]);

	return (
		<div className="flex flex-col ">
			<div className="w-full lg:w-[55%] mx-auto flex flex-col gap-y-2 pt-10">
				<h2 className="text-4xl text-center tracking-wide font-sansNarrow text-white">
					Reviews
				</h2>

				<ul
					className={
						"list-none flex overflow-x-auto relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:h-[1px] after:w-full after:-translate-y-[50%] after:bg-gray-300/50 text-white"
					}
				>
					{categories.map((category, i) => {
						return (
							<li key={i}>
								<Link
									path="/"
									className={
										"block px-5 py-3 relative text-[18px] duration-300 capitalize after:content-[''] after:z-10 after:absolute after:bottom-0 after:h-[3px] after:bg-yellow-400 after:duration-300 after:transition-[width_left] whitespace-nowrap " +
										(currentCategory === category.name.toLowerCase()
											? "after:w-[100%] after:left-0 "
											: "after:w-[0%] after:left-[50%] text-gray-400 hover:text-white")
									}
									onClick={handleShowUnderline}
								>
									{category.name}
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
			<div className="bg-white pt-10">
				<div className="w-full lg:w-[55%] mx-auto">
					<div className="grid grid-cols-3 gap-x-8 gap-y-10">
						{reviewsToShow.map((review, i) => {
							console.log(review);
							const year =
								getFullYear(review.referredMedia.releaseDate) ||
								getFullYear(review.referredMedia.firstAirDate);

							return (
								<Review
									key={i}
									img={review.banner}
									name={review.referredMedia.title}
									title={review.title}
									year={year}
									author={review.author.personal_info}
									rating={review.activity.rating}
									description={review.description}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReviewsPage;
