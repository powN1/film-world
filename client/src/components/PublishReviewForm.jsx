import { useContext, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { FaRegStar, FaStar } from "react-icons/fa";
import { EditorContext } from "../pages/WriteReviewPage";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App";

const PublishReviewForm = () => {
	const { review_id } = useParams();
	const characterLimit = 80;

	const {
		review,
		review: { banner, title, category, description, content, referredMediaID, activity },
		setReview,
		setEditorState,
	} = useContext(EditorContext);

	console.log(`referred media: ${referredMediaID}`);
	const {
		userAuth: { access_token },
	} = useContext(UserContext);

	const descriptionCharLimit = 80;

	const handleCloseEvent = () => {
		setEditorState("editor");
	};

	const handleReviewTitleChange = (e) => {
		const input = e.target;
		setReview({ ...review, title: input.value });
	};

	const handleTitleNewLine = (e) => {
		if (e.keyCode === 13) {
			e.preventDefault();
		}
	};

	const handleReviewDescriptionChange = (e) => {
		const input = e.target;
		setReview({ ...review, description: input.value });
	};

	const handlePublishReview = (e) => {
		if (e.target.className.includes("disable")) {
			return;
		}
		// validation
		if (!title.length) {
			return toast.error("Write review title before publishing");
		}
		if (!description.length || description.length > characterLimit) {
			return toast.error( `Write review description under ${characterLimit} before publishing`,);
		}

		let loadingToast = toast.loading("Publishing...");

		e.target.classList.add("disable");

		let reviewObj = {
			title,
			banner,
      category,
			description,
			content,
			referredMediaID,
      activity,
			draft: false,
		};
		axios
			.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/create-review",
				{ ...reviewObj, id: review_id },
				{
					headers: { Authorization: `${access_token}` },
				},
			)
			.then(() => {
				e.target.classList.remove("disable");

				toast.dismiss(loadingToast);
				toast.success("Published");

				setTimeout(() => {
					navigate("/dashboard/reviews");
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
						<img src={banner} alt="review image" className="w-full h-full" />
					</div>
					<h1 className="text-3xl py-5 line-clamp-2 leading-tight">{title}</h1>
					<p className="font-sansNarrow line-clamp-2 text-xl leading-7">
						{description}
					</p>
				</div>

				<div className="w-full lg:w-2/3 flex flex-col gap-y-2">
					<div className="flex flex-col gap-y-2">
						<p className="text-gray-500">Review title</p>
						<input
							type="text"
							placeholder="Review title"
							defaultValue={title}
							className="input-box2  border border-gray-400 rounded-md focus:border-yellow-400 duration-150 focus:[box-shadow:_2px_2px_6px_rgb(250_204_21/_15%)] ml-4"
							onChange={handleReviewTitleChange}
						/>
					</div>

					<div className="flex flex-col gap-y-2">
						<p className="text-gray-500">Review description</p>
						<textarea
							maxLength={descriptionCharLimit}
							defaultValue={description}
							placeholder="Review description"
							className=" h-32 lg:h-40 border border-gray-400 rounded-md focus:border-yellow-400 duration-150 focus:[box-shadow:_2px_2px_6px_rgb(250_204_21/_15%)] ml-4 resize-none leading-7 input-box2"
							onChange={handleReviewDescriptionChange}
							onKeyDown={handleTitleNewLine}
						></textarea>
						<p className="text-gray-500 place-self-end text-sm">
							{descriptionCharLimit - description.length} characters left
						</p>
					</div>

					<div className="flex flex-col gap-y-2">
						<p className="text-gray-500">
							Rating <span className="text-sm">({activity.rating} / 10)</span>
						</p>
						<div className="flex ml-4">
							{[...Array(10)].map((_, i) =>
								i < activity.rating ? (
									<FaStar
										key={i}
										className="text-yellow-400 text-xl"
									/>
								) : (
									<FaRegStar
										key={i}
										className="text-yellow-400 text-xl"
									/>
								),
							)}
						</div>
					</div>

					<button
						className="self-start py-2 px-4 mt-8 mb-10 bg-yellow-400"
						onClick={handlePublishReview}
					>
						Publish
					</button>
				</div>
			</div>
		</section>
	);
};

export default PublishReviewForm;
