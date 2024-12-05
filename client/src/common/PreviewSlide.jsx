import { Link } from "react-router-dom";

const PreviewSlide = ({ film, film: { title, cover }, activeSlide, filmIndex, index, changeSlide }) => {
	return (
		<div
			className="mx-3 px-1 flex flex-col gap-y-3 cursor-pointer box-order"
			onClick={() => changeSlide(index)}
		>
			<div>
				<div
					className={
						"h-[200px] relative after:content-[''] after:h-full after:w-full after:top-0 after:left-0 after:absolute after:border-yellow-400 after:transition-all after:duration-100 " +
						(activeSlide === filmIndex
							? "after:border-[3px]"
							: "after:border-0")
					}
				>
					<img
						src={cover}
						alt={`${title} image`}
						className="h-full w-full object-cover"
					/>
				</div>
			</div>
			<p className="text-center line-clamp-2">{title}</p>
		</div>
	);
};

export default PreviewSlide;
