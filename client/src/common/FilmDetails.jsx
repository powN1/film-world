import { IoChevronForward } from "react-icons/io5";

const FilmDetails = ({ type, media }) => {
	const director = media.director.join(", ");
	const screenplay = media.screenplay.join(", ");
  const originCountry = media.originCountry.join(", ");

	return (
		<div className="w-full bg-white">
			<div className="mx-auto lg:w-[55%]">
				<div className="flex w-2/3 pt-8">
					{/* Img */}
					<div className="h-[285px] w-[200px] min-w-[200px] bg-blue-200">
						<img
							src={media.cover}
							alt="media poster"
							className="h-full w-full"
						/>
					</div>
					{/* Media details */}
					<div className="grow flex flex-col gap-y-6 px-8 py-1">
            {/* Description */}
						<p className="line-clamp-3 leading-7">{media.description}</p>

						{/* Genres */}
						<div className="flex gap-x-2">
							{media.genre.map((genre) => (
								<div className="flex justify-center items-center gap-x-1 text-sm font-bold bg-white px-2 py-1 border border-gray-400/50 rounded-sm cursor-pointer hover:bg-gray-400/50 transition-all">
									<p className="">{genre}</p>
									<IoChevronForward className="mt-[3px]" />
								</div>
							))}
						</div>

						{/* Screenplay, director etc */}
						<div className="flex flex-col gap-y-2 w-full text-sm">
							<div className="flex">
								<span className="text-gray-400 min-w-1/5 w-1/5">Director </span>
								<p>{director}</p>
							</div>

							<div className="flex">
								<span className="text-gray-400 min-w-1/5 w-1/5">
									Screenplay
								</span>
								<p>{screenplay}</p>
							</div>

							<div className="flex">
								<span className="text-gray-400 min-w-1/5 w-1/5">
									Country
								</span>
								<p>{originCountry}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilmDetails;
