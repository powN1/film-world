import { Link } from "react-router-dom";
import deadpool from "../imgs/deadpool.jpg";
import mcu from "../imgs/mcu.jpg";
import rdj from "../imgs/rdj.jpg";
import batman from "../imgs/batman.jpg";
import GameSlide from "../common/GameSlide";
import Slider from "react-slick";

const Ranking = () => {
	// Slider settings
	const settings = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 3,
	};

	const movies = [
		{
			title: "I am legend 2",
			img: deadpool,
      comments: 13,
		},
		{
			title: "Awoken",
			img: mcu,
      comments: 44,
		},
		{
			title: `Code of Evil`,
			img: rdj,
      comments: 4,
		},
		{
			title: `Twisters`,
			img: batman,
      comments: 7,
		},
	];

	return (
		<div className={"flex flex-col py-10 gap-y-5 bg-transparent text-black"}>
			<h2
				className={
					"uppercase text-4xl font-bold text-center tracking-tighter font-sansNarrow"
				}
			>
				Games
			</h2>
			<Link to="" className="relative h-[45vh] group overflow-hidden">
				<img
					src={movies[2].img}
					alt=""
					className="h-full w-full object-cover group-hover:scale-110 duration-300"
				/>
				<h2 className="absolute left-0 bottom-[12%] text-white text-5xl font-extrabold uppercase w-full text-center group-hover:text-yellow-400 duration-700 tracking-wide">
					MCU adaptation in the world of games!
				</h2>
			</Link>
			<div className="w-[95%] self-center mt-[-5%]">
				<Slider {...settings}>
					{movies.slice(1).map((movie, i) => {
						return (
							<GameSlide key={i + 1} title={movie.title} img={movie.img} comments={movie.comments} />
						);
					})}
				</Slider>
			</div>
			<Link
				path="/"
				className="self-center py-3 px-24 border border-gray-300 font-bold mt-8 hover:bg-black hover:text-white duration-500"
			>
        See all news
			</Link>
		</div>
	);
};

export default Ranking;
