import { Link } from "react-router-dom";
import GameSlide from "../common/GameSlide";
import Slider from "react-slick";
import { useContext } from "react";
import { MediaQueriesContext } from "../App";
import { DataContext } from "../App";

const Games = () => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);

	const { latestGamesArticles: articles } = useContext(DataContext);
	// Slider settings
	const settings = {
		dots: true,
		arrows: mobileView || tabletView ? false : true,
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 3,
		responsive: [
			{
				// mobile view
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					arrows: false,
				},
			},
		],
	};

	return (
		<div className="bg-white">
			<div className="lg:w-[55%] mx-auto flex flex-col py-10 gap-y-5 bg-transparent text-black">
				<h2 className="uppercase text-4xl font-bold text-center tracking-tighter font-sansNarrow">
					Games
				</h2>
				<Link to={`/article/${articles[0].articleId}`} className="relative h-[45vh] group overflow-hidden">
					<img
						src={articles[0].banner}
						alt=""
						className="h-full w-full object-cover group-hover:scale-110 duration-700"
					/>
					<h2 className="absolute left-0 bottom-[12%] text-white text-3xl lg:text-5xl 3xl:text-6xl font-extrabold uppercase w-full text-center px-6 group-hover:text-yellow-400 duration-700 tracking-wide">
						{articles[0].title}
					</h2>
				</Link>
				<div className="w-[95%] self-center mt-[-13%] md:mt-[-6%] lg:mt-[-5%]">
					<Slider {...settings}>
						{articles.slice(1).map((article, i) => {
							return (
								<GameSlide
									key={i + 1}
                  link={article.articleId}
									title={article.title}
									img={article.banner}
									comments={article.activity.totalComments}
								/>
							);
						})}
					</Slider>
				</div>
				<Link
					to="/articles"
          state={{ category: "games" }}
					className="w-[90%] lg:w-1/3 text-center self-center py-3 border border-gray-300 font-bold mt-8 hover:bg-black hover:text-white duration-500"
				>
					See all news
				</Link>
			</div>
		</div>
	);
};

export default Games;
