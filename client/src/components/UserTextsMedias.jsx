import { useContext } from "react";
import { Link } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { IoIosCheckmark } from "react-icons/io";
import { UserTextsContext } from "../pages/UserTextsPage";
import Review from "../common/Review";
import SingleNews from "../common/SingleNews";
import { getFullYear } from "../common/date";

const UserTextsMedias = ({ author, medias }) => {
  const { currentCategory } = useContext(UserTextsContext);
	const sortTags = (article) => article.tags.length > 1 ? article.tags.join(", ") : article.tags;

	return (
		<div className="w-full bg-white">
			<div className="lg:w-[55%] w-full mx-auto relative">
        <div className="py-6 text-2xl font-bold capitalize">{currentCategory === "articles" ? "articles" : "reviews"} ({medias.length})</div>
				{/* Articles or reviews etc */}
				<div className="w-full self-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 md:gap-y-10 md:gap-x-8">
					{medias.map((media, i) => {
						const type = media.articleId ? "article" : "review";
						const year = type === "review" && (media.referredMedia.releaseDate ? getFullYear(media.referredMedia.releaseDate) : getFullYear(media.referredMedia.firstAirDate));
						const tags = type === "article" && sortTags(media);
            const mediaLink = type === "review" && `/${media.referredMedia.itemType.slice(0, -1)}/${media.referredMedia.titleId}`;

						return type === "article" ? (
							<SingleNews
								key={i}
								type="categorized"
                link={media.articleId}
								img={media.banner}
								category={tags}
								title={media.title}
								description={media.description}
								date={media.publishedAt}
								comments={media.comments}
							/>
						) : (
							<Review
								key={i}
								img={media.banner}
                link={media.review_id}
                mediaLink={mediaLink}
								name={media.referredMedia.title}
								title={media.title}
								year={year}
								author={author.personal_info}
								rating={media.activity.rating}
								description={media.description}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default UserTextsMedias;
