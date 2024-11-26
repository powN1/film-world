import { Link } from "react-router-dom";

const GameSlide = ({ title, link, img, comments }) => {
	return (
		<Link
			to={`/article/${link}`}
			className="mx-3 mb-1 flex flex-col gap-y-2 duration-300 group hover:[box-shadow:_0px_0px_6px_rgb(0_0_0_/_25%)]"
		>
			<div className="relative h-[180px] overflow-hidden border border-gray-300">
				<img
					src={img}
					alt={title}
					className="h-full w-full object-cover group-hover:scale-110 duration-700"
				/>
			</div>
			<div className="self-center flex flex-col items-center text-center gap-y-2 p-2">
				<p>{title}</p>
				<p className="text-sm text-gray-400">{comments} comments</p>
			</div>
		</Link>
	);
};

export default GameSlide;
