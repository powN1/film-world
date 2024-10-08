import defaultBanner from "../imgs/defaultBanner.png";
import uploadImage from "../common/aws";
import { useContext, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/WriteArticlePage";
import EditorJS from "@editorjs/editorjs";
import { tools } from "../common/tools";

const ArticleEditor = () => {
	const {
		article,
		article: { title, banner, content, tags, description },
		setArticle,
		setEditorState,
		textEditor,
		setTextEditor,
	} = useContext(EditorContext);

	const handleBannerUpload = (e) => {
		const img = e.target.files[0];
		if (img) {
			const loadingToast = toast.loading("Uploading...");
			uploadImage(img)
				.then((url) => {
					if (url) {
						toast.dismiss(loadingToast);
						toast.success("Uploaded");

						setArticle({ ...article, banner: url });
					}
				})
				.catch((err) => {
					toast.dismiss(loadingToast);
					return toast.error(err);
				});
		}
	};

	const handleTitleNewLine = (e) => {
		if (e.keyCode === 13) {
			e.preventDefault();
		}
	};

	const handleTitleChange = (e) => {
		const input = e.target;
		input.style.height = "auto";
		input.style.height = input.scrollHeight + "px";

		setArticle({ ...article, title: input.value });
	};

	const handleImageError = (e) => {
		const img = e.target;
		img.src = defaultBanner;
	};

  const handlePublishEvent = () => {
		if (!banner.length) {
			return toast.error("Upload a article banner to publish it");
		}
		if (!title.length) {
			return toast.error("Write article title to publish it");
		}
		if (textEditor.isReady) {
			textEditor
				.save()
				.then(data => {
					if (data.blocks.length) {
						setArticle({ ...article, content: data });
						setEditorState("publish");
					} else {
						return toast.error("Write something in your article to publish it");
					}
				})
				.catch(err => {
					console.log(err);
				});
		}
  }

	useEffect(() => {
		setTextEditor(
			new EditorJS({
				holder: "textEditor",
				data: Array.isArray(content) ? content[0] : content,
				tools: tools,
				placeholder: "What's new in the world of film?",
			}),
		);
	}, []);

	return (
		<section className="flex flex-col bg-white">
			<div className="lg:w-[55%] px-3 lg:px-0 mx-auto">
				<Toaster />
				<div className="flex items-center justify-between py-5">
					<p className="max-md:hidden text-black text-lg block w-[75%]">
						{title.length ? title : "New article"}
					</p>
					<div className="flex gap-x-4 ml-auto">
						<button className="py-2 px-4 bg-yellow-400  rounded" onClick={handlePublishEvent}>
							Publish
						</button>
						<button className="py-2 px-4 bg-gray-200 rounded">
							Save draft
						</button>
					</div>
				</div>
				<div>
					<div className="aspect-video bg-white border-4 border-gray-400/30 hover:border-gray-400/60 cursor-pointer">
						<label htmlFor="uploadBanner">
							<img
								src={banner}
								alt="banner image"
								className="z-20 w-full h-full"
								onError={handleImageError}
							/>
							<input
								id="uploadBanner"
								type="file"
								accept=".png, .jpg, .jpeg"
								hidden
								onChange={handleBannerUpload}
							/>
						</label>
					</div>

					<textarea
            defaultValue={title}
						placeholder="Article title"
						className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
						onKeyDown={handleTitleNewLine}
						onChange={handleTitleChange}
					></textarea>

					<hr className="w-full opacity-70my-5" />

					<div id="textEditor" className="font-sansNarrow"></div>
				</div>
			</div>
		</section>
	);
};

export default ArticleEditor;
