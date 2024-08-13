import { Link } from "react-router-dom";
import { FaRegCirclePlay } from "react-icons/fa6";

const MovieSlide = ({
	title,
	img,
	ranking = null,
	description = null,
	type,
	pegi = null,
}) => {
	const renderMovieSlide = () => {
		switch (type) {
			case "movie":
				return (
					<Link className="flex flex-col gap-y-2 mx-3 relative group">
						<div className="h-[260px] border border-gray-700 overflow-hidden">
							<img
								src={img}
								alt={title}
								className="h-full w-full object-cover group-hover:scale-110 duration-700"
							/>
						</div>
						<p className="relative block text-center px-3">
							{title}
							<span className="absolute top-0 left-[5%] max-lg:left-0 translate-x-[-50%] translate-y-[-65%] font-bold text-6xl max-lg:text-4xl">
								{ranking}
							</span>
						</p>
					</Link>
				);
			case "trailer":
				return (
					<Link to="/" className="flex flex-col mx-2 gap-y-2 relative group">
						<div className="h-[400px] border border-gray-300 overflow-hidden after:content-[''] after:absolute after:left-0 after:top-0 after:w-full after:h-full after:bg-black after:opacity-25">
							<img
								src={img}
								alt={title}
								className="h-full w-full object-cover"
							/>
						</div>
						<FaRegCirclePlay className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-5xl text-white group-hover:text-yellow-400 duration-100" />
						<div className="absolute bottom-0 left-0 p-3 text-white">
							<p className="">{title}</p>
							<p className="text-sm">2024</p>
							<div className="text-sm w-[80%] max-lg:hidden">{description}</div>
						</div>
						<div
							className={
								"absolute top-0 left-0 text-black w-[27px] h-[27px] rounded flex justify-center items-center m-2 " +
								(pegi === 12
									? "bg-yellow-400"
									: pegi === 16
										? "bg-orange-400"
										: pegi === 18
											? "bg-red-500"
											: null)
							}
						>
							<p className="text-xl text-white font-bold flex justify-center items-center">
								{pegi}
							</p>
						</div>
					</Link>
				);
			default:
				return <article></article>;
		}
	};
	return renderMovieSlide();
};

export default MovieSlide;
