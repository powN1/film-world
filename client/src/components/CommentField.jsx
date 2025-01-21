import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Link, useParams } from "react-router-dom";
import { IoMdSend } from "react-icons/io";
import { Toaster, toast } from "react-hot-toast";
import { ArticleContext } from "../pages/ArticlePage";
import { ReviewContext } from "../pages/ReviewPage.jsx";
import axios from "axios";

const CommentField = ({ type, action, index = null, replyingTo = undefined, setReplying, }) => {
	const { userAuth: { firstName, surname, username, profile_img, access_token }, } = useContext(UserContext);
	const [comment, setComment] = useState("");

  const { reviewId, articleId } = useParams();
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

	const handleCommentSubmition = (e) => {
		if (e.keyCode === 13 || e.type === "click") {
			e.preventDefault();
			if (!comment.trim().length) {
				return toast.error("Write something to leave a comment");
			}
			axios
				.post(
					import.meta.env.VITE_SERVER_DOMAIN + "/api/add-comment",
					{
            type, 
            mediaId,
						mediaAuthor,
						comment,
						replyingTo,
					},
					{
						headers: {
							Authorization: `${access_token}`,
						},
					},
				)
				.then(({ data }) => {
					setComment("");

					data.commentedBy = { personal_info: { username, profile_img, firstName, surname }, };

					let newCommentArr;

					if (replyingTo) {
						commentsArr[index].children.push(data._id);

						data.childrenLevel = commentsArr[0].childrenLevel + 1;

						data.parentIndex = index;

						commentsArr[index].isReplyLoaded = true;

						commentsArr.splice(index + 1, 0, data);

						newCommentArr = commentsArr;

						setReplying(false);
					} else {
						data.childrenLevel = 0;

						newCommentArr = [data, ...commentsArr];
					}

					let parentCommentIncrementValue = replyingTo ? 0 : 1;

					setMedia({
						...media,
						comments: { ...comments, results: newCommentArr },
						activity: {
							...activity,
							totalComments: totalComments + 1,
							totalParentComments: totalParentComments + parentCommentIncrementValue,
						},
					});

					setTotalParentCommentsLoaded(
						(prevVal) => prevVal + parentCommentIncrementValue,
					);
				})
				.catch((err) => console.log(err));
		}
	};

	const handleTextareaChange = (e) => {
		let input = e.target;

		// Resize the textarea as users adds new lines into the input
		input.style.height = "auto";
		input.style.height = input.scrollHeight + "px";
		setComment(input.value);
	};

	return (
		<>
			<div className="flex gap-x-2">
				<Toaster />
				<Link
					to={`/user/${username}`}
					className="rounded-full border self-start border-gray-400 p-[1px] cursor-pointer"
				>
					<img
						src={profile_img}
						alt="user image"
						className="h-[40px] min-w-[40px] w-[40px] object-cover rounded-full"
					/>
				</Link>
				<div className="w-full relative group border border-gray-400/50 focus-within:border-yellow-400">
					<textarea
						value={comment}
						placeholder="Leave a comment..."
						className="w-full input-box px-5 placeholder:text-dark-grey h-[40px] overflow-auto focus:outline-none"
						onChange={(e) => handleTextareaChange(e)}
						onKeyDown={(e) => handleCommentSubmition(e)}
					></textarea>
					<div
						className="absolute top-1/2 right-5 translate-y-[-50%] flex items-center justify-center p-1 group-focus-within:text-yellow-400 cursor-pointer group"
						onClick={(e) => handleCommentSubmition(e)}
					>
						<IoMdSend className=" text-gray-400/50 group-hover:text-yellow-400" />
					</div>
				</div>
			</div>
		</>
	);
};

export default CommentField;
