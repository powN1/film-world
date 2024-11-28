import { IoChevronForward } from "react-icons/io5";
import { UserContext } from "../App";
import { MediaQueriesContext } from "../App";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaRegStar, FaStar } from "react-icons/fa";
import { getFullDay, getFullYear } from "./date";
import { IoMdClose } from "react-icons/io";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FaHeartCircleCheck, FaHeartCircleMinus } from "react-icons/fa6";
import Loader from "../components/Loader";

const grades = [
	"Abysmal",
	"Terrible",
	"Awful",
	"Poor",
	"Mediocre",
	"Decent",
	"Good",
	"Great",
	"Excellent",
	"Masterpiece",
];

const FilmDetails = ({ type, media }) => {
	let {
		userAuth,
		userAuth: { username, access_token, profile_img, firstName, surname },
	} = useContext(UserContext);

	const { mobileView, tabletView } = useContext(MediaQueriesContext);

	let director,
		screenplay,
		originCountry,
		createdBy,
		seasons,
		dlcs,
		platforms,
		universe,
		developers,
		publishers;

	const [userRating, setUserRating] = useState(null);
	const [userRatingData, setUserRatingData] = useState(null);
	const [likedMedia, setLikedMedia] = useState(false);
	const [wantToSee, setWantToSee] = useState(false);
	const [userRatingLoading, setUserRatingLoading] = useState(true);
	const [ratingTextValue, setRatingTextValue] = useState("");
	const ratingTextValueMaxLength = 160;

	if (type === "movie") {
		director = media.director.join(", ");
		screenplay = media.screenplay.join(", ");
		originCountry = media.originCountry.join(", ");
	} else if (type === "serie") {
		createdBy = media.createdBy.join(", ");
		seasons = media.numberOfSeasons;
		originCountry = media.originCountry.join(", ");
	} else if (type === "game") {
		dlcs = media.dlcs;
		platforms = media.platforms;
		universe = media.universe.join(", ");
		developers = media.developers.join(", ");
		publishers = media.publishers.slice(0, 2).join(", ");
	}

	const rateMovie = async (mediaId, userRating, userReview = null) => {
		console.log(
			`media: ${mediaId}, type:${type}, userRating:${userRating}, userReview:${userReview}`,
		);
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/add-rating",
				{ mediaId, type, userRating, reviewText: userReview },
				{
					headers: { Authorization: `${access_token}` },
				},
			);
			setUserRating(response.data.rating.rating);
			setUserRatingData(response.data.rating);
		} catch (err) {
			console.error(err);
		}
	};

	const checkUserMediaRating = async (mediaId) => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/check-rating",
				{ mediaId },
				{
					headers: { Authorization: `${access_token}` },
				},
			);
			return response.data;
		} catch (err) {
			console.error(err);
		}
	};

	const checkUserMediaLike = async (mediaId) => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/check-favorite",
				{ mediaId },
				{
					headers: { Authorization: `${access_token}` },
				},
			);
			return response.data;
		} catch (err) {
			console.error(err);
		}
	};

	const checkUserMediaWantToSee = async (mediaId) => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/check-want-to-see",
				{ mediaId },
				{
					headers: { Authorization: `${access_token}` },
				},
			);
			return response.data;
		} catch (err) {
			console.error(err);
		}
	};
	const handleReviewRemoval = async () => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/remove-rating",
				{ mediaId: media._id, type: "movie" },
				{
					headers: { Authorization: `${access_token}` },
				},
			);
			setUserRating(null);
			setUserRatingData(null);
			setRatingTextValue("");
		} catch (err) {
			console.error(err);
		}
	};

	const handleRatingTextInputValue = (e) => {
		const inputVal = e.target.value;
		if (inputVal.length > ratingTextValueMaxLength) return;
		setRatingTextValue(inputVal);
	};

	const handleMediaLike = async (mediaId) => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/add-favorite",
				{ mediaId, type },
				{
					headers: { Authorization: `${access_token}` },
				},
			);
			setLikedMedia(response.data.isLiked);
		} catch (err) {
			console.error(err);
		}
	};

	const handleMediaWantToSee = async (mediaId) => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/add-want-to-see",
				{ mediaId, type },
				{
					headers: { Authorization: `${access_token}` },
				},
			);
			setWantToSee(response.data.wantToSee);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		const mediaId = media._id;
		const loadUserRating = async () => {
			const mediaRatingData = await checkUserMediaRating(mediaId);
			if (mediaRatingData) {
				if (mediaRatingData.hasRated) {
					setUserRating(mediaRatingData.rating.rating);
					setUserRatingData(mediaRatingData.rating);
					setRatingTextValue(mediaRatingData.rating.reviewText);
				}
			}
		};

		const loadUserFavorite = async () => {
			const mediaFavoriteData = await checkUserMediaLike(mediaId);
			if (mediaFavoriteData) {
				if (mediaFavoriteData.isLiked) {
					setLikedMedia(mediaFavoriteData.isLiked);
				}
			}
		};

		const loadUserWantToSee = async () => {
			const medaiWantToSeeData = await checkUserMediaWantToSee(mediaId);
			if (medaiWantToSeeData) {
				if (medaiWantToSeeData.wantToSee) {
					setWantToSee(medaiWantToSeeData.wantToSee);
				}
			}
		};
		loadUserRating();
		loadUserFavorite();
		loadUserWantToSee();
		setUserRatingLoading(false); // Set loading to false after fetching
	}, [media._id]);

	return (
		<div className="w-full bg-white">
			<div className="mx-auto lg:w-[55%]">
				<div className="relative flex flex-col gap-y-3 md:flex-row w-full px-4 sm:px-12 lg:px-0 lg:w-2/3 py-4 lg:py-8">
					{/* Mobile img and description */}
					<div className="flex md:hidden">
						{/* Img mobile */}
						<div className="h-[150px] w-[105px] min-w-[105px] border border-gray-400/50">
							<img
								src={media.cover}
								alt="media poster"
								className="h-full w-full object-cover"
							/>
						</div>

						{/* Description mobile */}
						<p className="pl-4 line-clamp-4 leading-6 text-ellipsis">
							{media.description}
						</p>
					</div>

					{/* Img */}
					<div className="hidden md:block h-[285px] w-[200px] min-w-[200px] border border-gray-400/50">
						<img
							src={media.cover}
							alt="media poster"
							className="h-full w-full"
						/>
					</div>

					{/* Media details */}
					<div className="grow flex flex-col gap-y-6 md:px-4 py-1">
						{/* Description */}
						<p className="hidden md:line-clamp-3 leading-7">
							{media.description}
						</p>

						{/* Genres for large devides*/}
						<div className="flex gap-x-2">
							{media.genre.map((genre, i) => (
								<div
									key={i}
									className="flex justify-center items-center gap-x-1 text-sm font-bold bg-white px-2 py-1 border border-gray-400/50 rounded-sm cursor-pointer hover:bg-gray-400/50 transition-all"
								>
									<p className="">{genre}</p>
									<IoChevronForward className="mt-[3px]" />
								</div>
							))}
						</div>

						{/* Screenplay, director etc for large devices */}
						<div className="flex flex-col gap-y-2 w-full lg:text-sm">
							{director && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4 lg:min-w-1/5 lg:w-1/5">
										Director{" "}
									</span>
									<p className="w-3/4 lg:w-4/5">{director}</p>
								</div>
							)}

							{createdBy && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4 lg:min-w-1/5 lg:w-1/5">
										Creators{" "}
									</span>
									<p className="w-3/4 lg:w-4/5">{createdBy}</p>
								</div>
							)}

							{screenplay && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4 lg:min-w-1/5 lg:w-1/5">
										Screenplay
									</span>
									<p className="w-3/4 lg:w-4/5">{screenplay}</p>
								</div>
							)}

							{originCountry && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4 lg:min-w-1/5 lg:w-1/5">
										Country
									</span>
									<p className="w-3/4 lg:w-4/5">{originCountry}</p>
								</div>
							)}

							{seasons && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4 lg:min-w-1/5 lg:w-1/5">
										Seasons
									</span>
									<p className="w-3/4 lg:w-4/5">{seasons}</p>
								</div>
							)}

							{platforms && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4 lg:min-w-1/5 lg:w-1/5">
										Platforms
									</span>
									<div className="flex flex-wrap gap-x-1 md:gap-2 w-3/4 lg:w-4/5">
										{platforms.map((platform, i) => (
											<>
												<div className="flex text-sm font-bold bg-white cursor-pointer hover:bg-gray-400/50 transition-all">
													<p className="underline">{platform}</p>
												</div>
												{i !== platforms.length - 1 ? <div>/</div> : null}
											</>
										))}
									</div>
								</div>
							)}

							{developers && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4 lg:min-w-1/5 lg:w-1/5">
										Developers
									</span>
									<p className="w-3/4 lg:w-4/5">{developers}</p>
								</div>
							)}

							{publishers && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4 lg:min-w-1/5 lg:w-1/5">
										Publishers
									</span>
									<p className="w-3/4 lg:w-4/5">{publishers}</p>
								</div>
							)}

							{universe && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4 lg:min-w-1/5 lg:w-1/5">
										Universe
									</span>
									<p className="w-3/4 lg:w-4/5">{universe}</p>
								</div>
							)}
						</div>
					</div>
					<div
						className={
							!mobileView && !tabletView
								? "absolute right-0 top-0 translate-x-[110%] translate-y-[-70%] bg-white px-3 border"
								: "border-y"
						}
					>
						{!userRatingLoading ? (
							<div className={"flex flex-col border-gray-400/30 py-4 gap-y-4"}>
								{access_token ? (
									<div className="flex items-center gap-x-2">
										<Link
											to={`/user/${username}`}
											className="rounded-full border border-gray-400 p-[1px] cursor-pointer"
										>
											<img
												src={profile_img}
												alt="user image"
												className="h-[50px] w-[50px] object-cover rounded-full"
											/>
										</Link>
										<div className="flex flex-col">
											<div className="flex items-center gap-x-2">
												{userRating ? (
													<p className="text-xl md:text-base">
														{grades[userRating - 1]}
													</p>
												) : (
													<p className="text-gray-400">
														I've seen it. My rating is:
													</p>
												)}
												{userRatingData && (
													<div
														className="mt-1 cursor-pointer p-1"
														onClick={handleReviewRemoval}
													>
														<IoMdClose />
													</div>
												)}
											</div>
											<p className="text-xs">
												{userRatingData
													? getFullDay(userRatingData.timestamp)
													: null}
											</p>
										</div>
										<button
											className="ml-auto"
											onClick={() => handleMediaLike(media._id)}
										>
											{likedMedia ? (
												<FaHeartCircleCheck className="text-2xl hover:text-gray-400/70 text-red-600 hover:scale-110 cursor-pointer" />
											) : (
												<FaHeartCircleMinus className="text-2xl hover:text-red-600 text-gray-400/70 hover:scale-110 cursor-pointer" />
											)}
										</button>
									</div>
								) : (
									<div className="flex items-center gap-x-2">
										Log in to be able to rate
									</div>
								)}

								<button
									className={
										"flex justify-center items-center gap-x-2 border py-2 group duration-300 " +
										(wantToSee ? "bg-white hover:bg-green-500/90" : "bg-green-500/90 hover:bg-white")
									}
									onClick={() => handleMediaWantToSee(media._id)}
								>
									{wantToSee ? (
										<FaRegEyeSlash className={"text-2xl duration-300 mt-[1px] " + (wantToSee ? "text-black group-hover:text-white" : "text-white group-hover:text-green-500/90")}  />
									) : (
										<FaRegEye className={"text-2xl duration-300 mt-[1px] " + (wantToSee ? "text-black group-hover:text-white" : "text-white group-hover:text-green-500/90")}/>
									)}
									<p className={"duration-300 " + (wantToSee ? "text-black group-hover:text-white" : "text-white group-hover:text-black")}>Want to see</p>
								</button>
								<div className="flex items-center gap-x-1">
									{[...Array(10)].map((_, i) =>
										i < userRating ? (
											<FaStar
												key={i}
												className="text-3xl text-yellow-400 cursor-pointer"
												onClick={() =>
													access_token &&
													rateMovie(media._id, i + 1, ratingTextValue)
												}
											/>
										) : (
											<FaRegStar
												key={i}
												className="text-3xl text-yellow-400 cursor-pointer"
												onClick={() =>
													access_token &&
													rateMovie(media._id, i + 1, ratingTextValue)
												}
											/>
										),
									)}
								</div>

								<div>
									<textarea
										type="text"
										max-length={ratingTextValueMaxLength}
										value={ratingTextValue}
										onChange={handleRatingTextInputValue}
										disabled={!userRating}
										onBlur={() =>
											rateMovie(media._id, userRating, ratingTextValue)
										}
										placeholder="Share your opinion"
										className="relative w-full input-box2 border border-gray-400/30 bg-gray-400/10 focus:bg-transparent"
									/>

									<p className="mt-1 text-dark-grey text-sm text-right">
										{ratingTextValueMaxLength - ratingTextValue.length}{" "}
										characters left
									</p>
								</div>
							</div>
						) : (
							<Loader />
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilmDetails;
