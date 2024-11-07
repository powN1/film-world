import { useContext } from "react";
import { MediaQueriesContext } from "../App";
import Slider from "react-slick";
import FilmCastSlide from "./FilmCastSlide";

const FilmCast = ({ media }) => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);

	// Slider settings
	// NOTE: Slides for roles: Small screens 2 slides, medium 5, large 5
	// NOTE: Slides for chars: Small screens 2 slides, medium 5, large 6
	const slidesToShow = tabletView
		? Math.min(4, media.roles.length)
		: Math.min(6, media.roles.length);

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
			<div className="flex flex-col gap-y-5 px-4 md:px-12 lg:px-0 mx-auto lg:w-[55%]">
				<h3 className="text-lg font-bold">{media.title} cast</h3>
				<div className={ "w-full gap-x-3 self-center " + ( mobileView ? "grid grid-cols-3" : media.roles.length <= 6 ? "flex" : "") }>
					{mobileView ? (
						media.roles.slice(0, 6).map((role, i) => {
							return (
								<FilmCastSlide
									key={i}
									actor={role.actor}
									characterName={role.characterName}
								/>
							);
						})
					) : media.roles.length <= 6 ? (
						media.roles.map((role, i) => {
							return (
								<FilmCastSlide
									key={i}
									actor={role.actor}
									characterName={role.characterName}
								/>
							);
						})
					) : (
						<Slider {...settings}>
							{media.roles.map((role, i) => {
								return (
									<FilmCastSlide
										key={i}
										actor={role.actor}
										characterName={role.characterName}
									/>
								);
							})}
						</Slider>
					)}
				</div>
			</div>
		</div>
	);
};

export default FilmCast;
