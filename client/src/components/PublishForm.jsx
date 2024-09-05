import { useContext, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { EditorContext } from "../pages/CreateArticlePage";
import Tag from "./Tags";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App";

const PublishForm = () => {
	const availableTags = ["movies", "series", "games"];

	const { article_id } = useParams();
	const characterLimit = 80;
	const tagLimit = 3;

	const {
		article,
		article: { banner, title, tags, description, content },
		setArticle,
		setEditorState,
	} = useContext(EditorContext);

	const { userAuth: { access_token }, } = useContext(UserContext);

	const descriptionCharLimit = 80;

	const handleCloseEvent = () => {
		setEditorState("editor");
	};

	const handleArticleTitleChange = (e) => {
		const input = e.target;
		setArticle({ ...article, title: input.value });
	};

	const handleTitleNewLine = (e) => {
		if (e.keyCode === 13) {
			e.preventDefault();
		}
	};
	const handleArticleDescriptionChange = (e) => {
		const input = e.target;
		setArticle({ ...article, description: input.value });
	};

	const handlePublishArticle = (e) => {
		if (e.target.className.includes("disable")) {
			return;
		}
		// validation
		if (!title.length) {
			return toast.error("Write article title before publishing");
		}
		if (!description.length || description.length > characterLimit) {
			return toast.error(
				`Write article description under ${characterLimit} before publishing`,
			);
		}
		if (!tags.length) {
			return toast.error("Enter article tags before publishing");
		}

		let loadingToast = toast.loading("Publishing...");

		e.target.classList.add("disable");

		let articleObj = {
			title,
			banner,
			description,
			content,
			tags,
			draft: false,
		};
		axios
			.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/create-article",
				{ ...articleObj, id: article_id },
				{
					headers: { Authorization: `${access_token}` },
				},
			)
			.then(() => {
				e.target.classList.remove("disable");

				toast.dismiss(loadingToast);
				toast.success("Published");

				setTimeout(() => {
					navigate("/dashboard/blogs");
				}, 500);
			})
			.catch(({ response }) => {
				e.target.classList.remove("disable");
				toast.dismiss(loadingToast);
				return toast.error(response.data.error);
			});
	};

	return (
		<section className="flex flex-col bg-white">
			<div className="lg:w-[55%] px-3 lg:px-0 mx-auto flex flex-col gap-y-2">
				<Toaster />
				<div className="flex flex-col lg:pt-4">
					<div className="flex justify-between py-5">
						<p className="text-gray-500 font-bold">Preview</p>
						<button className="" onClick={handleCloseEvent}>
							<IoMdClose className="text-3xl" />
						</button>
					</div>
					<div className="w-full aspect-video rounded-lg overflow-hidden">
						<img src={banner} alt="article image" className="w-full h-full" />
					</div>
					<h1 className="text-3xl py-5 line-clamp-2 leading-tight">{title}</h1>
					<p className="font-sansNarrow line-clamp-2 text-xl leading-7">
						{description}
					</p>
				</div>

				<div className="w-full lg:w-2/3 flex flex-col gap-y-2">
					<div className="flex flex-col gap-y-2">
						<p className="text-gray-500">Article title</p>
						<input
							type="text"
							placeholder="Article title"
							defaultValue={title}
							className="input-box2  border border-gray-400 rounded-md focus:border-yellow-400 duration-150 focus:[box-shadow:_2px_2px_6px_rgb(250_204_21/_15%)] ml-4"
							onChange={handleArticleTitleChange}
						/>
					</div>

					<div className="flex flex-col gap-y-2">
						<p className="text-gray-500">Article description</p>
						<textarea
							maxLength={descriptionCharLimit}
							defaultValue={description}
							placeholder="Article description"
							className=" h-32 lg:h-40 border border-gray-400 rounded-md focus:border-yellow-400 duration-150 focus:[box-shadow:_2px_2px_6px_rgb(250_204_21/_15%)] ml-4 resize-none leading-7 input-box2"
							onChange={handleArticleDescriptionChange}
							onKeyDown={handleTitleNewLine}
						></textarea>
						<p className="text-gray-500 place-self-end text-sm">
							{descriptionCharLimit - description.length} characters left
						</p>
					</div>

					<div className="flex flex-col gap-y-2">
						<p className="text-gray-500">
							Category{" "}
							<span className="text-sm">
								({tags.length} of {availableTags.length} selected)
							</span>
						</p>
						<div className="flex gap-3 ml-4">
							{availableTags.map((tag, i) => {
								return <Tag tag={tag} key={i} />;
							})}
						</div>
					</div>

					<button
						className="self-start py-2 px-4 mt-8 mb-10 bg-yellow-400"
						onClick={handlePublishArticle}
					>
						Publish
					</button>
				</div>
			</div>
		</section>
	);
};

export default PublishForm;
