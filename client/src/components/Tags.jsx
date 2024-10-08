import { useContext } from "react";
import { EditorContext } from "../pages/WriteArticlePage";

const Tag = ({ tag }) => {
	let {
		article,
		article: { tags },
		setArticle,
	} = useContext(EditorContext);

	const handleTagEvent = (e) => {
		e.preventDefault();
		const newTags = tags.includes(tag) ? tags.filter((element) => element !== tag) : [...tags, tag]; 
		setArticle({ ...article, tags: newTags });
	};

	return (
		<button
			className={
				"rounded inline-block cursor-pointer py-2 px-5 " +
				(tags.includes(tag) ? "bg-yellow-400" : "bg-gray-200")
			}
			onClick={handleTagEvent}
		>
			{tag}
		</button>
	);
};

export default Tag;
