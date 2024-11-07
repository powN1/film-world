import { getFullDay } from "./date";

const FilmDetailsExpanded = ({ type, media }) => {
	const genre = media.genre.join(", ");
	const releaseDate = getFullDay(
		new Date(media.releaseDate || media.firstAirDate),
	);

	let director,
		screenplay,
		revenue,
		originalTitle,
		originCountry,
		createdBy,
		seasons,
		episodes,
		lastAirDate,
		dlcs,
		platforms,
		universe,
		developers,
		publishers;

	if (type === "movie") {
		director = media.director.join(", ");
		screenplay = media.screenplay.join(", ");
		revenue = new Intl.NumberFormat("en-US", { useGrouping: true })
			.format(media.revenue)
			.replace(/,/g, " ");
		originCountry = media.originCountry.join(", ");
		originalTitle = media.originalTitle;
	} else if (type === "serie") {
		createdBy = media.createdBy.join(", ");
		originCountry = media.originCountry.join(", ");
		seasons = media.numberOfSeasons;
		episodes = media.numberOfEpisodes;
		lastAirDate = getFullDay(new Date(media.lastAirDate));
	} else if (type === "game") {
		dlcs = media.dlcs;
		platforms = media.platforms;
		universe = media.universe.join(", ");
		developers = media.developers.join(", ");
		publishers = media.publishers.join(", ");
	}

	return (
		<div className="w-full bg-white">
			<div className="mx-auto lg:w-[55%]">
				<div className="flex flex-col px-4 md:px-12 lg:px-0 lg:w-2/3 gap-y-4 py-8">
					<h2 className="text-lg font-bold">Information about {media.title}</h2>
					{/* Media details */}
					<div className="grow flex flex-col md:flex-row gap-y-2">
						{/* Screenplay, director etc */}
						<div className="flex flex-col gap-y-2 w-full text-sm">
							<div className="flex">
								<span className="text-gray-400 min-w-1/4 w-1/4 md:min-w-1/3 md:w-1/3">
									Release date
								</span>
								<p className="w-3/4 md:w-2/3">{releaseDate}</p>
							</div>
							{lastAirDate && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4 md:min-w-1/3 md:w-1/3">
										Last air date
									</span>
									<p>{lastAirDate}</p>
								</div>
							)}
							{createdBy && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4 md:min-w-1/3 md:w-1/3">
										Creators
									</span>
									<p className="w-3/4 md:w-2/3">{createdBy}</p>
								</div>
							)}
							{originCountry && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4 md:min-w-1/3 md:w-1/3">
										Country
									</span>
									<p className="w-3/4 md:w-2/3">{originCountry}</p>
								</div>
							)}
							{revenue && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4 md:min-w-1/3 md:w-1/3">
										Revenue{" "}
									</span>
									<p className="w-3/4 md:w-2/3">${revenue}</p>
								</div>
							)}
							{originalTitle && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4 md:min-w-1/3 md:w-1/3">
										Original title
									</span>
									<p className="w-3/4 md:w-2/3">{media.originalTitle}</p>
								</div>
							)}
							{platforms && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4 md:min-w-1/3 md:w-1/3">Platforms</span>
									<div className="flex flex-wrap gap-x-1 md:gap-2 w-3/4 md:w-2/3">
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
						</div>

						<div className="flex flex-col gap-y-2 w-full text-sm">
							<div className="flex">
								<span className="text-gray-400 min-w-1/4 w-1/4">Genre</span>
								<p className="w-3/4">{genre}</p>
							</div>
							{director && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4">
										Director{" "}
									</span>
									<p className="w-3/4">{director}</p>
								</div>
							)}
							{screenplay && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4">
										Screenplay
									</span>
									<p className="w-3/4">{screenplay}</p>
								</div>
							)}
							{seasons && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4">Seasons</span>
									<p className="w-3/4">{seasons}</p>
								</div>
							)}
							{episodes && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4">
										Episodes
									</span>
									<p className="w-3/4">{episodes}</p>
								</div>
							)}

							{universe && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4">
                    Universe
									</span>
									<p className="w-3/4">{universe}</p>
								</div>
							)}
							{developers && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4">
                    Developers
									</span>
									<p className="w-3/4">{developers}</p>
								</div>
							)}
							{publishers && (
								<div className="flex">
									<span className="text-gray-400 min-w-1/4 w-1/4">
                    Publishers
									</span>
									<p className="w-3/4">{publishers}</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilmDetailsExpanded;
