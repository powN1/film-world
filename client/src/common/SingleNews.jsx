import { Link } from "react-router-dom";
import { getDay } from "../common/date";

const SingleNews = ({
	title,
	link,
	description,
	comments,
	date,
	img,
	type,
	gridarea = null,
	category,
}) => {
	const renderArticle = () => {
		switch (type) {
			case "tiny":
				return (
					<Link
						to={`/article/${link}`}
						className="flex justify-between group overflow-hidden cursor-pointer"
					>
						<p className="w-[70%] text-sm group-hover:text-yellow-400 duration-300 overflow-hidden line-clamp-3">
							{description}
						</p>
						<div className="h-[65px] w-[65px] overflow-hidden border border-gray-300">
							<img
								src={img}
								alt={description}
								className="h-full object-cover group-hover:scale-110 duration-700"
							/>
						</div>
					</Link>
				);
			case "small":
				return (
					<Link
						to={`/article/${link}`}
						className="flex group overflow-hidden cursor-pointer max-md:col-span-2 max-md:row-span-1"
					>
						<div className="w-[40%] overflow-hidden border border-gray-800">
							<img
								src={img}
								alt={description}
								className="object-cover w-full h-full group-hover:scale-110 duration-700"
							/>
						</div>
						<div className="flex flex-col px-2 py-1 justify-between w-[60%]">
							<p className="text-white text-sm line-clamp-2 text-ellipsis group-hover:text-yellow-400 duration-300 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
								{description}
							</p>
							<span className="text-xs text-gray-400">{comments} comments</span>
						</div>
					</Link>
				);
			case "medium":
				return (
					<Link
						to={`/article/${link}`}
						className="flex md:flex-col gap-y-1 max-md:gap-x-2 group overflow-hidden cursor-pointer"
					>
						<div className="h-[65%] max-md:h-full max-md:w-[40%] overflow-hidden border border-gray-300">
							<img
								src={img}
								alt={description}
								className="h-full w-full object-cover group-hover:scale-110 duration-700"
							/>
						</div>
						<div className="flex flex-col justify-between max-md:w-[60%] lg:h-1/3">
							<p className="text-sm py-1 group-hover:text-yellow-500 duration-300 text-ellipsis overflow-hidden line-clamp-2">
								{description}
							</p>
							<span className="text-gray-400 text-xs">{comments} comments</span>
						</div>
					</Link>
				);
			case "big":
				return (
					<Link
						to={`/article/${link}`}
						className={`relative group cursor-pointer max-md:flex max-md:flex-col max-md:col-span-1 max-md:row-span-2 ${gridarea["row-start"]} ${gridarea["row-span"]} ${gridarea["col-start"]} ${gridarea["col-span"]}`}
					>
						<div className="h-full max-md:h-1/2 overflow-hidden border border-gray-800">
							<img
								src={img}
								alt={description}
								className="object-cover h-full w-full group-hover:scale-110 duration-700"
							/>
						</div>
						<div className="md:absolute md:bottom-0 md:left-0 flex flex-col md:p-3">
							<p className="text-white text-sm line-clamp-3 text-ellipsis py-1 group-hover:text-yellow-400 duration-300 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
								{description}
							</p>
							<span className="text-xs text-gray-400">{comments} comments</span>
						</div>
					</Link>
				);
			case "large":
				return (
					<Link
						to={`/article/${link}`}
						className={`relative group overflow-hidden cursor-pointer max-md:row-span-2 max-md:col-span-1 ${gridarea["row-start"]} ${gridarea["row-span"]} ${gridarea["col-start"]} ${gridarea["col-span"]}`}
					>
						<img
							src={img}
							alt={description}
							className="object-cover h-full w-full group-hover:scale-110 duration-700"
						/>
						<div className="absolute bottom-3 max-md:bottom-0 left-0 flex flex-col p-3">
							<p className="text-2xl max-md:text-base text-white group-hover:text-yellow-500 duration-300 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
								{description}
							</p>
							<span className="text-gray-400 max-md:text-xs">
								{comments} comments
							</span>
						</div>
					</Link>
				);
			case "gigantic":
				return (
					<Link
						to={`/article/${link}`}
						className={`relative group overflow-hidden cursor-pointer max-md:row-span-3 max-md:col-span-2 ${gridarea["row-start"]} ${gridarea["row-span"]} ${gridarea["col-start"]} ${gridarea["col-span"]} border border-gray-800`}
					>
						<img
							src={img}
							alt={description}
							className="object-cover h-full w-full group-hover:scale-110 duration-700"
						/>
						<div className="absolute bottom-3 max-lg:bottom-0 left-0 flex flex-col p-3">
							<p className="text-3xl max-lg:text-xl text-white line-clamp-2 text-ellipsis group-hover:text-yellow-400 duration-300 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
								{description}
							</p>
							<span className="text-gray-400 max-lg:text-sm">
								{comments} comments
							</span>
						</div>
					</Link>
				);
			case "categorized":
				return (
					<Link
						to={`/article/${link}`}
						className="flex md:flex-col gap-y-1 max-md:gap-x-2 group overflow-hidden cursor-pointer hover:[box-shadow:_0px_0px_6px_rgb(0_0_0_/_25%)] duration-300 ease-in-out"
					>
						<div className="min-w-[150px] h-[150px] md:h-[180px] lg:h-auto aspect-square lg:aspect-video overflow-hidden border border-gray-300">
							<img
								src={img}
								alt={description}
								className="h-full w-full object-cover group-hover:scale-110 duration-700"
							/>
						</div>
						<div className="flex flex-col py-1 md:items-center md:py-3 md:px-3">
							<p className="text-yellow-400 uppercase text-xs font-bold">
								{category}
							</p>
							<p className="py-1 text-black text-ellipsis overflow-hidden line-clamp-3 md:text-center">
								{description}
							</p>
							<span className="text-gray-400 text-xs mt-auto">
								{getDay(date)} / {comments.length} comments
							</span>
						</div>
					</Link>
				);
			default:
				return <article></article>;
		}
	};

	return renderArticle();
};

export default SingleNews;
