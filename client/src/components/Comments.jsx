import { useContext } from "react";
import { UserContext } from "../App.jsx";
import CommentField from "./CommentField.jsx";
import { ArticleContext } from "../pages/ArticlePage.jsx";

export const fetchComments = async ({ skip = 0, type, mediaId, setParentCommentCountFunc, commentArray = null, }) => {
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
	const {
		userAuth: { access_token },
	} = useContext(UserContext);
	const {} = useContext(ArticleContext);

	return (
		<div className="w-full bg-white">
			<div className="mx-auto lg:w-[55%] py-6 px-3 lg:px-0">
				<div className="flex flex-col w-2/3 gap-y-4">
					<h2 className="text-xl font-bold">Comments</h2>
					{access_token && <CommentField type={type} action="comment" />}
				</div>
			</div>
		</div>
	);
};

export default Comments;
