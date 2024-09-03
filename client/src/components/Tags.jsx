import { useContext } from "react";
import { EditorContext } from "../pages/CreateNewsPage";

const Tag = ({ tag, tagIndex }) => {
	let {
		news,
		news: { tags },
		setNews,
	} = useContext(EditorContext);

	const handleTagEvent = (e) => {
    e.preventDefault()
		console.log(tag);

		setNews({ ...news, tags: tags.push(tag) });
	};

	return (
		<button
			className={
				"rounded inline-block cursor-pointer py-2 px-5 " +
				(tags.includes(tag) ? "bg-gray-700" : "bg-gray-300")
			}
			onClick={handleTagEvent}
		>
			{tag}
		</button>
	);
};

export default Tag;
