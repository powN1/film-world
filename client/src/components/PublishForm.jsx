import { useContext } from "react";
import { Toaster, toast } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { EditorContext } from "../pages/CreateNewsPage";
import Tag from "./Tags";

const PublishForm = () => {
	const availableTags = ["movies", "series", "games"];

	const {
		news,
		news: { banner, title, tags, description },
		setNews,
		setEditorState,
	} = useContext(EditorContext);

	const descriptionCharLimit = 80;

	const handleCloseEvent = () => {
		setEditorState("editor");
	};

	const handleNewsTitleChange = (e) => {
		const input = e.target;
		setNews({ ...news, title: input.value });
	};

	const handleTitleNewLine = (e) => {
		if (e.keyCode === 13) {
			e.preventDefault();
		}
	};
	const handleNewsDescriptionChange = (e) => {
		const input = e.target;
		setNews({ ...news, description: input.value });
	};

	const handleTopicKeyDown = (e) => {
		if (e.keyCode === 13 || e.keyCode === 188) {
			e.preventDefault();

			const tag = e.target.value;

			if (tags.length < tagLimit) {
				if (!tags.includes(tag) && tag.length) {
					setBlog({ ...blog, tags: [...tags, tag] });
				}
			} else {
				toast.error(`You can add max ${tagLimit} tags`);
			}
			e.target.value = "";
		}
	};

	return (
		<section className="flex flex-col bg-white">
			<div className="lg:w-[55%] mx-auto">
				<Toaster />
				<div className="flex flex-col">
					<div className="flex justify-between py-5">
						<p className="text-gray-500 font-bold">Preview</p>
						<button className="" onClick={handleCloseEvent}>
							<IoMdClose className="text-3xl" />
						</button>
					</div>
					<div className="w-full aspect-video rounded-lg overflow-hidden">
						<img src={banner} alt="news image" className="w-full h-full" />
					</div>
					<h1 className="text-3xl py-5 line-clamp-2 leading-tight">{title}</h1>
					<p className="font-sansNarrow line-clamp-2 text-xl leading-7">
						{description}
					</p>
				</div>

				<div className="w-2/3 flex flex-col gap-y-2">
					<div className="flex flex-col gap-y-2">
						<p className="text-gray-500">News title</p>
						<input
							type="text"
							placeholder="News title"
							defaultValue={title}
							className="input-box2  border border-gray-400 rounded-md focus:border-yellow-400 duration-150 focus:[box-shadow:_2px_2px_6px_rgb(250_204_21/_15%)] ml-4"
							onChange={handleNewsTitleChange}
						/>
					</div>

					<div className="flex flex-col gap-y-2">
						<p className="text-gray-500">News description</p>
						<textarea
							maxLength={descriptionCharLimit}
							defaultValue={description}
							placeholder="News description"
							className=" h-40 border border-gray-400 rounded-md focus:border-yellow-400 duration-150 focus:[box-shadow:_2px_2px_6px_rgb(250_204_21/_15%)] ml-4 resize-none leading-7 input-box2"
							onChange={handleNewsDescriptionChange}
							onKeyDown={handleTitleNewLine}
						></textarea>
						<p className="text-gray-500 place-self-end text-sm">
							{descriptionCharLimit - description.length} characters left
						</p>
					</div>

					<div className="flex gap-3 input-box2">
						{availableTags.map((tag, i) => {
							return <Tag tag={tag} key={i} tagIndex={i} />;
						})}
					</div>
				</div>
			</div>
		</section>
	);
};

export default PublishForm;
