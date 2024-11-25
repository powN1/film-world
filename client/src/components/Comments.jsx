import { useContext } from "react";
import { UserContext } from "../App.jsx";
import CommentField from "./CommentField.jsx";
import CommentCard from "../common/CommentCard.jsx";
import { ArticleContext } from "../pages/ArticlePage.jsx";
import { ReviewContext } from "../pages/ReviewPage.jsx";
import axios from "axios";
import { useParams } from "react-router-dom";

export const fetchComments = async ({
	skip = 0,
	type,
	mediaId,
	setParentCommentCountFunc,
	commentArray = null,
}) => {
	let res;

	await axios
		.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-media-comments", {
			type,
			mediaId,
			skip,
		})
		.then(({ data }) => {
			data.map((comment) => {
				comment.childrenLevel = 0;
			});
			setParentCommentCountFunc((prevVal) => prevVal + data.length);

			if (commentArray === null) {
				res = { results: data };
			} else {
				res = { results: [...commentArray, ...data] };
			}
		});
	return res;
};

const Comments = ({ type }) => {
  const { reviewId, articleId } = useParams();
  console.log(`params`, reviewId, articleId)
	let context;

	if (articleId) {
		context = useContext(ArticleContext);
	} else if (reviewId) {
		context = useContext(ReviewContext);
	}

	// If no context is found, handle the error gracefully
	if (!context) {
		throw new Error(
			"Comments component must be wrapped in a context provider (ArticleContext or ReviewContext).",
		);
	}
	const {
		media,
		setMedia,
		media: {
			_id: mediaId,
			author: { _id: mediaAuthor },
			comments,
			comments: { results: commentsArr },
			activity,
			activity: { totalComments, totalParentComments },
		},
		setTotalParentCommentsLoaded,
	} = context;

	const { userAuth: { access_token }, } = useContext(UserContext);

	return (
		<div className="w-full bg-white">
			<div className="mx-auto lg:w-[55%] py-6 px-3 lg:px-0">
				<div className="flex flex-col w-full lg:w-2/3 gap-y-4">
					<h2 className="text-xl font-bold">Comments ({commentsArr.length})</h2>
					{access_token && <CommentField type={type} action="comment" />}

					{commentsArr && commentsArr.length ? (
						commentsArr.map((comment, i) => {
							return (
								<CommentCard
									type={type}
									index={i}
									leftVal={comment.childrenLevel * 4}
									commentData={comment}
								/>
							);
						})
					) : (
						<div>No comments found</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Comments;
