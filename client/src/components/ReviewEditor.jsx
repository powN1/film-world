import defaultBanner from "../imgs/defaultBanner.png";
import uploadImage from "../common/aws";
import { useContext, useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { EditorContext } from "../pages/WriteReviewPage";
import EditorJS from "@editorjs/editorjs";
import { tools } from "../common/tools";
import axios from "axios";
import { getFullYear, getYear } from "../common/date";

const ReviewEditor = () => {
	const [searchTitleValue, setSearchTitleValue] = useState("");

	const [selectedCategory, setSelectedCategory] = useState("movie");

	const [movies, setMovies] = useState([]);
	const [series, setSeries] = useState([]);
	const [games, setGames] = useState([]);

	const [searchedCollection, setSearchedCollection] = useState([]);

	const [selectedMedia, setSelectedMedia] = useState(null);

	const {
		review,
		review: { title, banner, content, description, referredMediaID },
		setReview,
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

						setReview({ ...review, banner: url });
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

		setReview({ ...review, title: input.value });
	};

	const handleImageError = (e) => {
		const img = e.target;
		img.src = defaultBanner;
	};

	const handlePublishEvent = () => {
		if (!banner.length) {
			return toast.error("Upload a review banner to publish it");
		}

		if (!title.length) {
			return toast.error("Write reivew title to publish it");
		}

    if (!referredMediaID) {
			return toast.error("Select a specific title to publish the review");
    }

		if (textEditor.isReady) {
			textEditor
				.save()
				.then((data) => {
					if (data.blocks.length) {
						setReview({ ...review, content: data });
						setEditorState("publish");
					} else {
						return toast.error("Write something in your review to publish it");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	const handleTitleSearch = async (e) => {
		const inputValue = e.target.value;
		setSearchTitleValue(inputValue);

		let searched = [];

		if (selectedCategory === "movie") {
			searched = movies
				.filter((movie) =>
					movie.title.toLowerCase().includes(inputValue.toLowerCase()),
				)
				.sort((a, b) => a.title.localeCompare(b.title));
		} else if (selectedCategory === "serie") {
			searched = series
				.filter((serie) =>
					serie.title.toLowerCase().includes(inputValue.toLowerCase()),
				)
				.sort((a, b) => a.title.localeCompare(b.title));
		} else if (selectedCategory === "game") {
			searched = games
				.filter((game) =>
					game.title.toLowerCase().includes(inputValue.toLowerCase()),
				)
				.sort((a, b) => a.title.localeCompare(b.title));
		}

		setSearchedCollection(searched);
	};

	const handleCategoryChange = (e) => {
		const category = e.target.value;
		setSelectedCategory(category);

		let searched = [];

		if (category === "movie") {
			searched = movies
				.filter((movie) =>
					movie.title.toLowerCase().includes(searchTitleValue.toLowerCase()),
				)
				.sort((a, b) => a.title.localeCompare(b.title));
		} else if (category === "serie") {
			searched = series
				.filter((serie) =>
					serie.title.toLowerCase().includes(searchTitleValue.toLowerCase()),
				)
				.sort((a, b) => a.title.localeCompare(b.title));
		} else if (category === "game") {
			searched = games
				.filter((game) =>
					game.title.toLowerCase().includes(searchTitleValue.toLowerCase()),
				)
				.sort((a, b) => a.title.localeCompare(b.title));
		}

		setSearchedCollection(searched);
	};

	const fetchData = async () => {
		const fetchMovies = await axios.post( import.meta.env.VITE_SERVER_DOMAIN + "/get-movies",);
		const fetchSeries = await axios.post( import.meta.env.VITE_SERVER_DOMAIN + "/get-series",);
		const fetchGames = await axios.post( import.meta.env.VITE_SERVER_DOMAIN + "/get-games",);

		setMovies(fetchMovies.data.movies);
		setSeries(fetchSeries.data.series);
		setGames(fetchGames.data.games);
	};

	const handleMediaSelection = (media) => {
    console.log(media)

		if (!selectedMedia) {
			setSelectedMedia(media);
			setSearchTitleValue("");
      setSelectedCategory("movie");
		} else {
			setSearchTitleValue("");
			return toast.error("You can only write a review for one at the time");
		}

    setReview({...review, referredMediaID: media._id})
	};

	const handleMediaRemoval = () => {
    setSelectedCategory("movie");
		setSelectedMedia(null);
	};

	useEffect(() => {
		setTextEditor(
			new EditorJS({
				holder: "textEditor",
				data: Array.isArray(content) ? content[0] : content,
				tools: tools,
				placeholder: "What's new in the world of film?",
			}),
		);
		fetchData();
	}, []);

	return (
		<section className="flex flex-col bg-white">
			<div className="lg:w-[55%] flex flex-col gap-y-2 px-3 lg:px-0 mx-auto">
				<Toaster />
				<div className="flex items-center justify-between pt-5">
					<p className="max-md:hidden text-black text-lg block w-[75%]">
						{title.length ? title : "New review"}
					</p>
					<div className="flex gap-x-4 ml-auto">
						<button
							className="py-2 px-4 bg-yellow-400  rounded"
							onClick={handlePublishEvent}
						>
							Publish
						</button>
						<button className="py-2 px-4 bg-gray-200 rounded">
							Save draft
						</button>
					</div>
				</div>

				<div className="flex flex-col gap-y-2">
					<p className="text-gray-500">Review for</p>
					<select
						id="category-select"
						value={selectedCategory}
						className="input-box2 w-1/6 border border-gray-400 rounded-md focus:border-yellow-400 duration-150 focus:[box-shadow:_2px_2px_6px_rgb(250_204_21/_15%)] ml-4"
						onChange={handleCategoryChange}
					>
						<option value="movie">Movie</option>
						<option value="serie">Serie</option>
						<option value="game">Game</option>
					</select>
				</div>

				<div className="flex flex-col gap-y-2">
					<p className="text-gray-500">Title</p>
					<input
						type="text"
						placeholder="Search..."
						value={searchTitleValue}
						className="w-1/2 input-box2 border border-gray-400 rounded-md focus:border-yellow-400 duration-150 focus:[box-shadow:_2px_2px_6px_rgb(250_204_21/_15%)] ml-4"
						onChange={handleTitleSearch}
					/>
					{searchTitleValue.length > 1 && (
						<ul className="max-h-[400px] overflow-y-scroll">
							{searchedCollection.map((item, i) => {
								const year = selectedCategory === "movie" || selectedCategory === "game" ? getFullYear(item.releaseDate) : null;
								const firstAirYear = selectedCategory === "serie" && getFullYear(item.firstAirDate);
								const lastAirYear = selectedCategory === "serie" && item.status === "Ended" ? getFullYear(item.lastAirDate) : null;

								return (
									<li
										key={i}
										className="ml-4 py-1 flex items-center gap-x-2 cursor-pointer pl-3 border-b border-b-gray-400/20 hover:bg-gray-300/30"
										onClick={() => handleMediaSelection(item)}
									>
										<div className="min-w-10 max-w-10">
											<img src={item.cover} alt="media img" />
										</div>
										<p>
											{item.title}{" "}
											<span className="text-gray-400 text-sm">
												{selectedCategory === "movie" ||
												selectedCategory === "game"
													? `(${year})`
													: `(${firstAirYear}${lastAirYear ? ` - ${lastAirYear}` : " -"})`}
											</span>
										</p>
									</li>
								);
							})}
						</ul>
					)}
				</div>

				{selectedMedia && (
					<div className="flex items-center gap-x-2 mt-3 bg-gray-300/30">
						<div className="min-w-10 max-w-10">
							<img src={selectedMedia.cover} alt="media img" />
						</div>
						<p>
							{selectedMedia.title}{" "}
							<span className="text-gray-400 text-sm">
								{selectedMedia.releaseDate ? `(${getFullYear(selectedMedia.releaseDate)})`
									: `(${getFullYear(selectedMedia.firstAirDate)}${selectedMedia.lastAirDate ? ` - ${getFullYear(selectedMedia.lastAirDate)}` : " -"})`}
							</span>
						</p>
						<button className="ml-auto mr-3 text-red-600" onClick={handleMediaRemoval}>
							<IoMdClose className="text-3xl" />
						</button>
					</div>
				)}

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
						placeholder="Review title"
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

export default ReviewEditor;
