import Slider from "react-slick";
import ReviewSlide from "../common/ReviewSlide";
import { useContext } from "react";
import { MediaQueriesContext } from "../App";
import { DataContext } from "../App";

const Reviews = () => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);

	const { latestReviews } = useContext(DataContext);

	const settings = {
		dots: true,
		arrows: mobileView || tabletView ? false : true,
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 3,
		initialSlide: 0,
		responsive: [
			{
				// mobile view
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					arrows: true,
				},
			},
			{
				// tablet view
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					arrows: true,
				},
			},
		],
	};
	return (
		<div className="bg-white">
			<div className="lg:w-[55vw] mx-auto flex flex-col py-6 gap-y-5">
				<h2 className="uppercase text-4xl font-bold text-center tracking-tighter font-sansNarrow text-black">
					Critic's reviews
				</h2>
				<div className="w-[95%] self-center">
					<Slider {...settings}>
						{latestReviews.map((review, i) => {
							let { author: { personal_info }, } = review;

							return (
								<ReviewSlide
									key={i}
                  link={review.review_id}
									author={personal_info}
									category={review.category}
									description={review.description}
									img={review.banner}
									rating={review.activity.rating}
									title={review.title}
									type="horizontal"
								/>
							);
						})}
					</Slider>
				</div>
			</div>
		</div>
	);
};

export default Reviews;
