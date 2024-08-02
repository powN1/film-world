import { Link } from "react-router-dom";

const Slide = ({ title, img, ranking }) => {
	return (
		<Link className="flex flex-col mx-4 gap-y-2 relative group">
			<div className="h-[260px] border border-gray-700 overflow-hidden">
				<img src={img} alt={title} className="h-full object-cover group-hover:scale-110 duration-700" />
			</div>
			<p className="text-center">{title}</p>
      <span className="absolute bottom-[8%] left-[-7%] font-bold text-7xl">{ranking}</span>
		</Link>
	);
};

export default Slide;
