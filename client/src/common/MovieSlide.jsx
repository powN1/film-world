import { Link } from "react-router-dom";

const MovieSlide = ({ title, img, ranking = null, description, type, }) => {
	const renderMovieSlide = () => {
		switch (type) {
			case "movie":
				return (
					<Link className="flex flex-col mx-4 gap-y-2 relative group">
						<div className="h-[260px] border border-gray-700 overflow-hidden">
							<img
								src={img}
								alt={title}
								className="h-full object-cover group-hover:scale-110 duration-700"
							/>
						</div>
						<p className="text-center">{title}</p>
						<span className="absolute bottom-[8%] left-[-10%] font-bold text-7xl">
							{ranking ? ranking : null}
						</span>
					</Link>
				);
			case "trailer":
				return (
					<Link className="flex flex-col mx-4 gap-y-2 relative group">
						<div className="h-[400px] border border-gray-300 overflow-hidden">
							<img
								src={img}
								alt={title}
								className="h-full object-cover"
							/>
						</div>
						<div className="absolute bottom-0 left-0 px-3 text-white">
							<p className="">{title}</p>
              <p>2024</p>
              <div className="">{description ? description : null}</div>
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
