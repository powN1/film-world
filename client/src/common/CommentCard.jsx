import { useContext, useState } from "react";
import { getDay } from "../common/date";
import { UserContext } from "../App";
import toast from "react-hot-toast";
import CommentField from "../components/CommentField";
import axios from "axios";
import { ArticleContext } from "../pages/ArticlePage";
import { Link, useParams } from "react-router-dom";
import { LiaCommentSolid } from "react-icons/lia";
import { FaRegTrashAlt } from "react-icons/fa";
import { ReviewContext } from "../pages/ReviewPage";

const CommentCard = ({ type, index, leftVal, commentData }) => {

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
		commentedBy: {
			personal_info: {
				profile_img,
				username: commentedByUsername,
				firstName,
				surname,
			},
		},
		commentedAt,
		comment,
		children,
		_id,
	} = commentData;

	const {
		media,
		setMedia,
		media: {
			author: {
				personal_info: { username: mediaAuthor },
			},
			comments,
			comments: { results: commentsArr },
			activity,
			activity: { totalParentComments },
		},
		setTotalParentCommentsLoaded,
	} = context ;

	const {
		userAuth: { access_token, username },
	} = useContext(UserContext);

	const [isReplying, setIsReplying] = useState(false);

	const handleReplyClick = () => {
		if (!access_token) {
			return toast.error("Log in to reply to the comment");
		}

		setIsReplying((prevVal) => !prevVal);
	};

	const getParentIndex = () => {
		let startingPoint = index - 1;

		try {
			while (
				commentsArr[startingPoint].childrenLevel >= commentData.childrenLevel
			) {
				startingPoint--;
			}
		} catch {
			startingPoint = null;
		}
		return startingPoint;
	};

	const removeCommentsCards = (startingPoint, isDelete = false) => {
		if (commentsArr[startingPoint]) {
			while (
				commentsArr[startingPoint].childrenLevel > commentData.childrenLevel
			) {
				commentsArr.splice(startingPoint, 1);

				if (!commentsArr[startingPoint]) {
					break;
				}
			}
		}

		if (isDelete) {
			const parentIndex = getParentIndex();

			if (parentIndex !== null) {
				commentsArr[parentIndex].children = commentsArr[
					parentIndex
				].children.filter((child) => child !== _id);

				if (!commentsArr[parentIndex].children.length) {
					commentsArr[parentIndex].isReplyLoaded = false;
				}
			}

			commentsArr.splice(index, 1);
		}

		if (commentData.childrenLevel === 0 && isDelete) {
			setTotalParentCommentsLoaded((preVal) => preVal - 1);
		}

		setMedia({
			...media,
			comments: { results: commentsArr },
			activity: {
				...activity,
				totalParentComments:
					totalParentComments -
					(commentData.childrenLevel === 0 && isDelete ? 1 : 0),
			},
		});
	};

	const hideReplies = () => {
		commentData.isReplyLoaded = false;

		removeCommentsCards(index + 1);
	};

	const loadReplies = ({ skip = 0, currentIndex = index }) => {
		if (commentsArr[currentIndex].children.length) {
			hideReplies();

			axios
				.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/get-replies", {
					_id: commentsArr[currentIndex]._id,
					skip,
				})
				.then(({ data: { replies } }) => {
					commentsArr[currentIndex].isReplyLoaded = true;

					for (let i = 0; i < replies.length; i++) {
						replies[i].childrenLevel =
							commentsArr[currentIndex].childrenLevel + 1;

						commentsArr.splice(currentIndex + 1 + i + skip, 0, replies[i]);
					}

					setMedia({
						...media,
						comments: { ...comments, results: commentsArr },
					});
				})
				.catch((err) => console.log(err));
		}
	};

	const removeComment = (e) => {
		e.target.setAttribute("disabled", true);

		axios
			.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/api/delete-comment",
				{ _id },
				{
					headers: {
						Authorization: `${access_token}`,
					},
				},
			)
			.then(() => {
				e.target.removeAttribute("disabled");

				removeCommentsCards(index + 1, true);
			})
			.catch((err) => console.log(err));
	};

	const LoadMoreRepliesButton = (e) => {
		let parentIndex = getParentIndex();

		let button = (
			<button
				className="text-dark-grey p-2 px-3 hover:bg-gray-400/20 rounded-sm flex items-center gap-2"
				onClick={() =>
					loadReplies({ skip: index - parentIndex, currentIndex: parentIndex })
				}
			>
				Load More Replies
			</button>
		);

		if (commentsArr[index + 1]) {
			if (
				commentsArr[index + 1].childrenLevel < commentsArr[index].childrenLevel
			) {
				if (index - parentIndex < commentsArr[parentIndex].children.length) {
					return button;
				}
			}
		} else {
			if (parentIndex) {
				if (index - parentIndex < commentsArr[parentIndex].children.length) {
					return button;
				}
			}
		}
	};

	return (
		<div className="w-full" style={{ paddingLeft: `${leftVal * 15}px` }}>
			<div className="flex flex-col">
				<div className="flex gap-3 items-center mb-2">
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
					<p className="line-clamp-1">
						<span className="capitalize">
							{firstName} {surname}
						</span>{" "}
						<Link to={`/user/${username}`}>@{commentedByUsername}</Link>
					</p>
					<p className="ml-auto min-w-fit">{getDay(commentedAt)}</p>
				</div>

				<p className="font-gelasio ml-14 bg-orange-900/5 p-2">{comment}</p>

				<div className="flex gap-5 items-center mt-2 ml-14">
					{commentData.isReplyLoaded ? (
						<button
							className="text-dark-grey p-2 px-3 hover:bg-gray-400/20 rounded-sm flex items-center gap-2"
							onClick={hideReplies}
						>
							<LiaCommentSolid />
							Hide Reply
						</button>
					) : (
						<button
							className="text-dark-grey py-2 px-3 hover:bg-gray-400/20 rounded-sm flex items-center gap-2"
							onClick={loadReplies}
						>
							<LiaCommentSolid />
							{children.length} Replies
						</button>
					)}
					<button className="underline" onClick={handleReplyClick}>
						Reply
					</button>

					{username === commentedByUsername || username === mediaAuthor ? (
						<button
							className="p-2 px-3 rounded-sm ml-auto hover:bg-red-300/60 hover:text-red-600 flex items-center"
							onClick={removeComment}
						>
							<FaRegTrashAlt />
						</button>
					) : null}
				</div>

				{isReplying ? (
					<div className="mt-8">
						<CommentField
							type={type}
							action="reply"
							index={index}
							replyingTo={_id}
							setReplying={setIsReplying}
						/>
					</div>
				) : null}
			</div>
			<LoadMoreRepliesButton />
		</div>
	);
};

export default CommentCard;
