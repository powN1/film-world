import { IoChevronForward } from "react-icons/io5";
import { UserContext } from "../App";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaRegStar, FaStar } from "react-icons/fa";
import { getFullDay, getFullYear } from "./date";
import { IoMdClose } from "react-icons/io";

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
		userAuth: { access_token, profile_img, firstName, surname },
	} = useContext(UserContext);
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
	const [userRatingLoading, setUserRatingLoading] = useState(true);

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

	const rateMovie = async (movieId, userRating, userReview = null) => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/add-rating",
				{ mediaId: movieId, type: "movie", userRating, userReview },
				{
					headers: { Authorization: `${access_token}` },
				},
			);
			setUserRating(response.data.rating.userRating);
			setUserRatingData(response.data.rating);
		} catch (err) {
			console.error(err);
		}
	};

	const checkUserMovieRating = async (movieId) => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/check-rating",
				{ mediaId: movieId },
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
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		const movieId = media._id;
		const loadUserRating = async () => {
			const movieRatingData = await checkUserMovieRating(movieId);
			if (movieRatingData) {
				if (movieRatingData.hasRated) {
					setUserRating(movieRatingData.rating.userRating);
					setUserRatingData(movieRatingData.rating);
				}
				console.log(movieRatingData);
			}
			setUserRatingLoading(false); // Set loading to false after fetching
		};
		loadUserRating();
	}, []);

	return (
		<div className="w-full bg-white">
			<div className="mx-auto lg:w-[55%]">
				<div className="flex flex-col gap-y-3 md:flex-row w-full px-4 sm:px-12 lg:px-0 lg:w-2/3 py-4 lg:py-8">
					{/* Mobile img and description */}
					<div className="flex md:hidden">
						{/* Img mobile */}
						<div className="h-[150px] w-[105px] min-w-[105px] border border-gray-400/50">
							<img
								src={media.cover}
								alt="media poster"
								className="h-full w-full"
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
						<p className="hidden md:block line-clamp-3 leading-7">
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

						{userAuth && !userRatingLoading ? (
							<div className="flex flex-col border-y border-gray-400/30 py-4 gap-y-4">
								<div className="flex items-center gap-x-2">
									<Link
										to="/"
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
											<p className="text-xl md:text-base">
												{grades[userRating - 1]}
											</p>
											{userRatingData && (
												<div
													className="mt-1 cursor-pointer"
													onClick={handleReviewRemoval}
												>
													<IoMdClose className="text-xl " />
												</div>
											)}
										</div>
										<p className="text-xs">
											{userRatingData ? getFullDay(userRatingData.timestamp) : null}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-x-1">
									{[...Array(10)].map((_, i) =>
										i < userRating ? (
											<FaStar
												key={i}
												className="text-3xl text-yellow-400 cursor-pointer"
												onClick={() => rateMovie(media._id, i + 1)}
											/>
										) : (
											<FaRegStar
												key={i}
												className="text-3xl text-yellow-400 cursor-pointer"
												onClick={() => rateMovie(media._id, i + 1)}
											/>
										),
									)}
								</div>
							</div>
						) : (
							<div className="border-y border-gray-400/30 py-4 gap-y-4">
								Log in to be able to rate
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilmDetails;
