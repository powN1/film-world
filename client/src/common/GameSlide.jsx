import { Link } from "react-router-dom";

const GameSlide = ({ title, img, comments }) => {

	return (
		<div className="mx-3 mb-1 flex flex-col gap-y-2 duration-300 hover:[box-shadow:_2px_2px_6px_rgb(0_0_0_/_7%)]">
			{/* Movie img */}
			<Link
				to="/"
				className="relative h-[180px] group overflow-hidden border border-gray-300"
			>
				<img
					src={img}
					alt={title}
					className="h-full w-full object-cover group-hover:scale-110 duration-700"
				/>
			</Link>
			<div className="self-center flex flex-col items-center gap-y-2 py-2">
				<p>Gothic with a new game!</p>
				<p className="text-sm text-gray-400">{comments} comments</p>
			</div>
		</div>
	);
};

export default GameSlide;
