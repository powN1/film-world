import { useContext, useEffect } from "react";
import { FaRegCirclePlay } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { MediaQueriesContext } from "../App";

const FilmVideos = ({ media }) => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);
	// All preview/trailer links are youtube links so extract yt video ID from the link
	// so we can use it for the thumbnail link

	const getYoutubeThumbnail = (url) => {
		const videoIdMatch =
			url.match(
				/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
			) || url.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
		return videoIdMatch
			? `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`
			: null;
	};

	let thumbnails;
	if (media.videos.length >= 3)
		thumbnails = media.videos.slice(0, 3).map(getYoutubeThumbnail);

	return media.videos && media.videos.length > 0 ? (
		<div className={ "w-full " + (media.videos.length > 1 ? "bg-black text-white" : "bg-white") }
		>
			<div className="mx-auto lg:w-[55%]">
				<div
					className={ "flex flex-col gap-y-4 pt-4 pb-8 px-4 md:px-12 lg:px-0 " + (media.videos.length > 1 ? "" : mobileView ? "" : tabletView ? "" : "w-2/3") }
				>
					<h3 className="text-lg font-bold">Videos of {media.title}</h3>

					{/* Video gallery */}
					{media.videos.length <= 1 ? (
						<div className="grid">
							{media.videos.map((video, i) => {
								const thumbnailUrl = getYoutubeThumbnail(video);

								return (
									<Link
										key={i}
										to={video}
										target="_blank" // Opens video in a new tab
										rel="noopener noreferrer"
										className="relative group border border-gray-400/50 aspect-video"
									>
										<div className="absolute flex flex-col left-[3%] bottom-[3%]">
											<p className="text-yellow-400 text-xs uppercase font-bold">
												{media.title}
											</p>
											<p className="text-white text-xl p-1 self-start bg-black">
												Trailer #{i + 1}
											</p>
										</div>
										<FaRegCirclePlay className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-7xl transition-all duration-200 ease-in-out text-white group-hover:text-yellow-400" />
										{thumbnailUrl ? (
											<img
												className="w-full h-full object-cover"
												src={thumbnailUrl}
												alt={`Thumbnail of ${media.title} video`}
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
												No thumbnail
											</div>
										)}
									</Link>
								);
							})}
						</div>
					) : media.videos.length <= 2 ? (
						<div className="flex overflow-x-scroll md:grid md:grid-cols-2 md:overflow-x-hidden gap-5">
							{media.videos.map((video, i) => {
								const thumbnailUrl = getYoutubeThumbnail(video);

								return (
									<Link
										key={i}
										to={video}
										target="_blank" // Opens video in a new tab
										rel="noopener noreferrer"
										className="min-h-[170px] relative group border border-gray-400/50 aspect-video"
									>
										<div className="absolute flex flex-col left-[3%] bottom-[3%]">
											<p className="text-yellow-400 text-xs uppercase font-bold">
												{media.title}
											</p>
											<p className="text-white text-lg p-1 self-start bg-black">
												Trailer #{i + 1}
											</p>
										</div>
										<FaRegCirclePlay className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-7xl transition-all duration-200 ease-in-out text-white group-hover:text-yellow-400" />
										{thumbnailUrl ? (
											<img
												className="w-full h-full object-cover"
												src={thumbnailUrl}
												alt={`Thumbnail of ${media.title} video`}
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
												No thumbnail
											</div>
										)}
									</Link>
								);
							})}
						</div>
					) : media.videos.length >= 3 ? (
						<div className="flex overflow-x-scroll md:grid md:grid-cols-3 md:overflow-x-hidden gap-5 md:gap-0">
							{mobileView ? (
								media.videos.map((video, i) => {
									const thumbnailUrl = getYoutubeThumbnail(video);

									return (
										<Link
											key={i}
											to={video}
											target="_blank" // Opens video in a new tab
											rel="noopener noreferrer"
											className="min-h-[170px] relative group border border-gray-400/50 aspect-video"
										>
											<div className="absolute flex flex-col left-[3%] bottom-[3%]">
												<p className="text-yellow-400 text-xs uppercase font-bold">
													{media.title}
												</p>
												<p className="text-white text-xl p-1 self-start bg-black">
													Trailer #{i + 1}
												</p>
											</div>
											<FaRegCirclePlay className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-7xl transition-all duration-200 ease-in-out text-white group-hover:text-yellow-400" />
											{thumbnailUrl ? (
												<img
													className="w-full h-full object-cover"
													src={thumbnailUrl}
													alt={`Thumbnail of ${media.title} video`}
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
													No thumbnail
												</div>
											)}
										</Link>
									);
								})
							) : (
								<>
									{/* Large thumbnail on the left */}
									<div className="relative group col-span-2 aspect-video border border-gray-400/50">
										<Link
											to={media.videos[0]}
											target="_blank"
											rel="noopener noreferrer"
										>
											<img
												src={thumbnails[0]}
												alt={`Thumbnail of ${media.title} video`}
												className="w-full h-full object-cover"
											/>

											<div className="absolute flex flex-col left-[3%] bottom-[3%]">
												<p className="text-yellow-400 text-xs uppercase font-bold">
													{media.title}
												</p>
												<p className="text-white text-xl p-1 self-start bg-black">
													Trailer #1
												</p>
											</div>
											<FaRegCirclePlay className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-7xl transition-all duration-200 ease-in-out text-white group-hover:text-yellow-400" />
										</Link>
									</div>

									{/* Two stacked thumbnails on the right */}
									<div className="flex flex-col gap-y-5">
										{thumbnails.slice(1, 3).map((thumbnail, i) => (
											<div
												key={i}
												className="relative group aspect-video ml-5 border border-gray-400/50 "
											>
												<Link
													to={media.videos[i + 1]}
													target="_blank"
													rel="noopener noreferrer"
												>
													<div className="absolute flex flex-col left-[3%] bottom-[3%]">
														<p className="text-yellow-400 text-xs uppercase font-bold">
															{media.title}
														</p>
														<p className="text-white p-1 self-start bg-black">
															Trailer #{i + 2}
														</p>
													</div>
													<FaRegCirclePlay className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-7xl transition-all duration-200 ease-in-out text-white group-hover:text-yellow-400" />
													<img
														src={thumbnail}
														alt={`Thumbnail of ${media.title} video ${i + 2}`}
														className="w-full h-full object-cover"
													/>
												</Link>
											</div>
										))}
									</div>
								</>
							)}
						</div>
					) : null}
				</div>
			</div>
		</div>
	) : null;
};

export default FilmVideos;
