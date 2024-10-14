import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const RankingResultRole = (props) => {
	const { index, img, actor, role, title, year, rating, ratedByCount } = props;
	return (
		<div
			className={
				"w-full flex gap-x-4 py-2 " + (index % 2 === 1 ? "bg-gray-200/25" : "")
			}
		>
			{/* <div className="hidden lg:flex justify-center items-center text-xl pl-4 w-[5%]"> */}
			{/* 	{index + 1} */}
			{/* </div> */}

			<Link className="relative min-w-[110px] w-[110px] min-h-[110px] h-[110px] border border-gray-300 cursor-pointer">
				<img src={img} alt="" className="h-full w-full object-cover" />
				<div className="md:hidden absolute bottom-0 left-0 h-[40px] w-[40px] bg-gray-100 border border-gray-300 flex justify-center items-center font-bold">
					{index + 1}
				</div>
			</Link>

			<div className="w-full flex flex-col gap-y-3 justify-between py-1">
				<div className="w-full flex flex-col lg:flex-row lg:items-start justify-between basis-1/2 gap-y-3">
					<div className="flex flex-col gap-y-3 text-xl">
						<div className="flex gap-x-1 font-bold">
							<span>{index + 1}.</span>
							<p>
								{actor.personal_info.name}{" "}
								<span className="text-gray-400">as {role}</span>
							</p>
						</div>
            <div className="text-sm">{title} {year}</div>
					</div>

					{/* Rating */}
					<div className="flex flex-col justift-center gap-x-2 lg:pr-4">
						<div className="flex items-center gap-x-1">
							<FaStar className="text-yellow-400 text-xl" />
							<span className="text-xl">{rating}</span>
						</div>
						<div className="flex gap-x-1 text-gray-400 text-xs leading-3">
							<span>{ratedByCount}</span>
							<span>ratings</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RankingResultRole;
