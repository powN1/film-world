import deadpool from "../imgs/deadpool.jpg";
import mcu from "../imgs/mcu.jpg";
import rdj from "../imgs/rdj.jpg";
import batman from "../imgs/batman.jpg";
import giancarlo from "../imgs/giancarlo.jpg";
import dexter from "../imgs/dexter.jpg";
import Slider from "react-slick";
import ReviewSlide from "../common/ReviewSlide";
import { useContext } from "react";
import { MediaQueriesContext } from "../App";

const Reviews = () => {
	const { mobileView } = useContext(MediaQueriesContext);

	const reviews = [
		{
			title: "I am legend 2",
			category: "movie",
			img: deadpool,
			author: {
				personal_info: { fullname: "Marcin Prokop", profile_img: rdj },
			},
			rating: 5,
			description:
				"Absolutely abysmal movie. I do not recommend watching it to anyone.",
			likes: 8,
		},
		{
			title: "Armand",
			category: "movie",
			img: rdj,
			author: {
				personal_info: { fullname: "Marcin Prokop", profile_img: dexter },
			},
			rating: 7,
			description:
				"Lovely movie with a few problems. The director did a really good job when it comes to capturing the emotions. On top of that it was really impressive work from all the actors and actresses.",
			likes: 15,
		},
		{
			title: "Civil War",
			category: "series",
			img: batman,
			author: {
				personal_info: { fullname: "Marcin Prokop", profile_img: giancarlo },
			},
			rating: 2,
			description:
				"Absolutely abysmal movie. I do not recommend watching it to anyone",
			likes: 8,
		},
		{
			title: "I am legend 2",
			category: "movie",
			img: giancarlo,
			author: {
				personal_info: { fullname: "Marcin Prokop", profile_img: mcu },
			},
			rating: 5,
			description:
				"Absolutely abysmal movie. I do not recommend watching it to anyone.",
			likes: 8,
		},
		{
			title: "Armand",
			category: "movie",
			img: mcu,
			author: {
				personal_info: { fullname: "Marcin Prokop", profile_img: batman },
			},
			rating: 7,
			description:
				"Lovely movie with a few problems. The director did a really good job when it comes to capturing the emotions.",
			likes: 15,
		},
		{
			title: "Civil War",
			category: "series",
			img: dexter,
			author: {
				personal_info: { fullname: "Marcin Prokop", profile_img: rdj },
			},
			rating: 2,
			description:
				"Absolutely abysmal movie. I do not recommend watching it to anyone",
			likes: 8,
		},
	];
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: mobileView ? 1 : 3,
		slidesToScroll: mobileView ? 1 : 3,
		initialSlide: 0,
	};
	return (
		<div className="flex flex-col py-10 gap-y-5">
			<h2 className="uppercase text-4xl font-bold text-center tracking-tighter font-sansNarrow text-black">
				Critic's reviews
			</h2>
			<div className="w-[95%] self-center">
				<Slider {...settings}>
					{reviews.map((review, i) => {
						let {
							author: { personal_info },
						} = review;
						return (
							<ReviewSlide
								key={i}
								title={review.title}
								category={review.category}
								img={review.img}
								author={personal_info}
								rating={review.rating}
								description={review.description}
								likes={review.likes}
								type="horizontal"
							/>
						);
					})}
				</Slider>
			</div>
		</div>
	);
};

export default Reviews;
