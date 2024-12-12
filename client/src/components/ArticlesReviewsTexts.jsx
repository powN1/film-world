import { useContext } from "react";
import SingleNews from "../common/SingleNews";
import { ArticlesPageContext } from "../pages/ArticlesPage";
import Review from "../common/Review";
import { getFullYear } from "../common/date";

const ArticlesReviewsTexts = ({ type, medias }) => {
  const sortTags = (article) => (article.tags.length > 1 ? article.tags.join(", ") : article.tags);

  return type === "articles" ? (
    <div className="w-full bg-white">
      <div className="w-full md:w-[90%] lg:w-[55%] mx-auto relative">
        {/* Articles or reviews etc */}
        <div className="w-full self-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 md:gap-y-10 md:gap-x-8 py-10">
          {medias.map((media, i) => {
            const tags = sortTags(media);

            return (
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
            );
          })}
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-white pt-10">
      <div className="w-full md:w-[90%] lg:w-[55%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {medias.map((review, i) => {
            const year = getFullYear(review.referredMedia.releaseDate) || getFullYear(review.referredMedia.firstAirDate);

            const mediaLink = `/${review.referredMedia.itemType.slice(0, -1)}/${review.referredMedia.titleId}`;
            return (
              <Review
                key={i}
                link={review.review_id}
                mediaLink={mediaLink}
                img={review.banner}
                name={review.referredMedia.title}
                title={review.title}
                year={year}
                author={review.author.personal_info}
                rating={review.activity.rating}
                description={review.description}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ArticlesReviewsTexts;
