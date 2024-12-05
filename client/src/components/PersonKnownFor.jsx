import { useContext } from "react";
import { MediaQueriesContext } from "../App";
import Slider from "react-slick";
import PersonKnownForSlide from "../common/PersonKnownForSlide";

const PersonKnownFor = ({ person }) => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);

	// Slider settings
	const settings = {
		dots: true,
		arrows: mobileView || tabletView ? false : true,
		infinite: true,
		speed: 500,
		slidesToShow: Math.min(4, person.roles.length),
		slidesToScroll: Math.min(4, person.roles.length),
	};

	return (
		<div className="bg-white">
			<div className="py-10 lg:w-[55%] mx-auto">
				<div className="flex flex-col lg:w-2/3 gap-y-5 px-4 md:px-12 lg:px-0">
					<h3 className="text-lg font-bold">Known for</h3>
					<div
						className={ "w-full gap-x-3 self-center " + (mobileView ? "flex overflow-x-scroll" : "")  }
					>
						{mobileView ? (
							person.roles.map((role, i) => {
								return (
									<PersonKnownForSlide
										key={i}
										cover={ role.movie ? role.movie.cover : role.serie ? role.serie.cover : null }
										filmTitle={ role.movie ? role.movie.title : role.serie ? role.serie.title : null }
									/>
								);
							})
						) : (
							<Slider {...settings}>
								{person.roles.map((role, i) => {
									return (
										<PersonKnownForSlide
											key={i}
											cover={ role.movie ? role.movie.cover : role.serie ? role.serie.cover : null }
											filmTitle={ role.movie ? role.movie.title : role.serie ? role.serie.title : null }
										/>
									);
								})}
							</Slider>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PersonKnownFor;
