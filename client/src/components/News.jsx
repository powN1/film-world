import { Link } from "react-router-dom";
import SingleNews from "../common/SingleNews";
import { dummyDataArticles } from "../common/dummyDataArticles";

const News = () => {
	return (
		<div className="flex flex-col py-10 gap-y-5 text-black bg-white">
			<h2 className="uppercase text-4xl text-center tracking-righter font-sansNarrow px-2">
				News
			</h2>
			<div className="w-full lg:w-[55%] self-center grid grid-cols-1 md:grid-cols-3 gap-y-5 md:gap-10">
				{dummyDataArticles.map((article, i) => (
					<SingleNews key={i} type="categorized" img={article.img} category={article.category} title={article.title} description={article.description} date={article.date} comments={article.comments}/>
				))}
			</div>
			<Link
				path="/"
				className="w-[90%] lg:w-1/3 text-center self-center py-3 border border-gray-300 font-bold mt-3 hover:bg-black hover:text-white duration-500"

			>
				See all news
			</Link>
		</div>
	);
};

export default News;

