import { useContext } from "react";
import { MediaQueriesContext } from "../App";
import Slider from "react-slick";
import FilmCastSlide from "./FilmCastSlide";

const FilmCast = ({ media }) => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);

	// Slider settings
	// NOTE: Slides for roles: Small screens 2 slides, medium 5, large 5
	// NOTE: Slides for chars: Small screens 2 slides, medium 5, large 6
	const slidesToShow = mobileView ? 2 : tabletView ? 5 : 6;
	const settings = {
		dots: true,
		arrows: mobileView || tabletView ? false : true,
		infinite: true,
		speed: 500,
		slidesToShow: slidesToShow,
		slidesToScroll: slidesToShow,
	};

	return (
		<div className="bg-white py-10">
			<div className="flex flex-col gap-y-5 mx-auto lg:w-[55%]">
				<h3 className="text-lg font-bold">{media.title} cast</h3>
				<div className="w-full self-center">
						<Slider {...settings}>
							{media.roles.map((role, i) => {
								return <FilmCastSlide key={i} actor={role.actor} characterName={role.characterName} />;
							})}
						</Slider>
				</div>
			</div>
		</div>
	);
};

export default FilmCast;
