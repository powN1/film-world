import BlockContent from "../components/ArticleContent.jsx";
import { getDay, getFullDay } from "../common/date";
import { Link } from "react-router-dom";

const ArticleInfo = ({ article, latestArticles }) => {
	const mediaTitle = article.referredMedia ? article.referredMedia.title : null;
	const mediaTitleId = article.referredMedia ? article.referredMedia.titleId : null;
	const category = article.referredMedia ? (article.category === "movies" ? "movie" : article.category === "series" ? "serie" : "game") : null;
	return (
		<div className="w-full bg-white">
			<div className="mx-auto lg:w-[55%] py-6 px-3 lg:px-0">
				<div className="flex flex-col gap-y-1">
					<div className="flex items-center gap-x-2">
						<p className={"uppercase text-sm lg:text-xs " + (mediaTitle ? "" : "text-yellow-400 font-bold")}> {article.tags ? "article" : `review`} </p>
            <Link to={`/${category}/${mediaTitleId}`} className={"uppercase font-bold text-sm lg:text-xs " + (mediaTitle ? "text-yellow-400" : "")}>{mediaTitle}</Link>
					</div>
					<h2 className="text-3xl lg:text-5xl font-bold font-sansNarrow tracking-wide">
						{article.title}
					</h2>
					<div className="flex justify-between my-8 items-start">
						<div className="flex gap-x-3 lg:gap-x-5 items-start">
							<img
								src={article.author.personal_info.profile_img}
								alt="profile image"
								className="w-12 h-12 rounded-full"
							/>
							<p className="capitalize">
								{article.author.personal_info.firstName}{" "}
								{article.author.personal_info.surname}
								<br />@
								<Link
									to={`/user/${article.author.personal_info.username}`}
									className="underline"
								>
									{article.author.personal_info.username}
								</Link>
							</p>
						</div>

						<p className="text-dark-grey opacity-75">
							Published on {getDay(article.publishedAt)}
						</p>
					</div>
				</div>

				<img src={article.banner} alt="blog image" className="aspect-video" />

				<div className="flex">
					<div className="lg:w-2/3">
						{article.content[0].blocks.map((block, i) => {
							return (
								<div key={i} className="my-4 md:my-8">
									<BlockContent block={block} />
								</div>
							);
						})}
					</div>
					<div className="hidden lg:flex flex-col w-1/3 px-3 py-8">
						<h3 className="text-xl font-bold">Latest news</h3>
						{latestArticles.slice(0, 3).map((article, i) => (
							<div
								key={i}
								className="flex flex-col gap-y-1 border-b border-gray-400/30 py-3"
							>
								{article.tags && (
									<p className="uppercase text-gray-400 font-bold">
										{" "}
										{article.tags.join(" / ")}{" "}
									</p>
								)}
								<Link
									to={article.tags ? `/article/${article.articleId}` : `/review/${article.review_id}`}
									className="hover:text-gray-400 duration-200"
								>
									{article.title}
								</Link>
								<p className="text-xs">
									{getFullDay(article.publishedAt)}{" "}
									{article.comments ? article.comments : null}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ArticleInfo;
