import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const RankingResultActor = (props) => {
	const { index, img, name, roles, rating, ratedByCount } = props;

  console.log(roles)
  const [currentRole, setCurrentRole] = useState("");

  useEffect(() => {
    if(roles.length > 0) setCurrentRole(roles[0])
  }, [ ])
	return (
		<div className={ "w-full flex flex-col py-5 gap-5 " + (index % 2 === 1 ? "bg-gray-200/25" : "") } >
			<div className="w-full flex items-center justify-between">
				{/* Name */}
				<p className="text-xl">
					<span>{index + 1}. </span>
					{name}
				</p>
				{/* Rating */}
				<div className="flex items-center gap-x-2 lg:pr-4">
					<div className="flex items-center gap-x-1">
						<FaStar className="text-yellow-400 text-2xl md:text-xl" />
						<span className="text-xl">{rating}</span>
					</div>
					<div className="flex flex-col md:flex-row gap-x-1 gap-y-[2px] text-gray-400 text-xs leading-3">
						<p>{ratedByCount}</p>
						<p>ratings</p>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-y-5">
				<div className="flex gap-x-5 ml-16">
					{roles.slice(0,5).map((role, i) => (
						<Link key={i} className="relative min-w-[110px] w-[110px] min-h-[110px] h-[110px] border border-gray-300 cursor-pointer">
							<img
								src={role.characterBanner}
								alt="character img"
								className="h-full w-full object-cover"
							/>
						</Link>
					))}
				</div>
				<div className="ml-16">
          as{" "}
          <span>{currentRole.characterName}</span>{" "}
          in
          <span>{currentRole.filmTitle}</span>
        </div>
			</div>
		</div>
	);
};

export default RankingResultActor;
