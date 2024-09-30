import { Link } from "react-router-dom";
import SingleNews from "../common/SingleNews";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../App";

const News = ({ type }) => {
	const { randomArticles, latestArticles, latestMovieArticles, latestSeriesArticles, latestGamesArticles, } = useContext(DataContext);

	const [currentNews, setCurrentNews] = useState([]);

	// Get articles that have tag "movies" in the and then move that tag to the very beggining.
	// If there's more tags than 1, nicely format it
  const sortTags = () => {
	const sortedTagsNews = latestGamesArticles
		.map((article) => ({
			...article,
			tags: article.tags.sort((a, b) =>
				a === type ? -1 : b === type ? 1 : 0,
			),
		}))
		.map((article) => ({
			...article,
			tags: article.tags.length > 1 ? article.tags.join(", ") : article.tags,
		}));
    setCurrentNews(sortedTagsNews)
  }

	useEffect(() => {
		if (type === "movies") setCurrentNews(latestMovieArticles);
		else if (type === "series") setCurrentNews(latestSeriesArticles);
		else if (type === "games") setCurrentNews(latestGamesArticles);
		else setCurrentNews(randomArticles);
	}, []);

  useEffect(() => {
    sortTags();
  }, [currentNews])

	return (
		<div className="bg-white">
			<div className="w-full lg:w-[55%] mx-auto flex flex-col py-10 gap-y-5 text-black bg-white">
				<h2 className="uppercase text-4xl text-center tracking-righter font-sansNarrow px-2">
					News
				</h2>
				<div className="w-full self-center grid grid-cols-1 md:grid-cols-2 md:w-[90%] lg:grid-cols-3 gap-y-5 md:gap-y-10 md:gap-x-8">
					{currentNews.slice(0, 6).map((article, i) => (
						<SingleNews
							key={i}
							type="categorized"
							img={article.banner}
							category={article.tags}
							title={article.title}
							description={article.description}
							date={article.publishedAt}
							comments={article.comments}
						/>
					))}
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

export default News;
