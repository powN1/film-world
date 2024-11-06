import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const RankingResultActor = (props) => {
	const { index, img, name, roles, rating, ratedByCount } = props;

	const [currentRole, setCurrentRole] = useState("");

	useEffect(() => {
		if (roles.length > 0) setCurrentRole(roles[0]);
	}, []);

	const handleSelectedRole = (role) => {
		setCurrentRole(role);
	};

	return (
		<div className={ "w-full flex lg:flex-col py-5 gap-5 " + (index % 2 === 1 ? "bg-gray-200/25" : "") } >
			<Link className="lg:hidden relative min-w-[100px] w-[100px] min-h-[150px] max-h-[150px] md:min-w-[90px] md:w-[90px] md:min-h-[125px] border border-gray-300 cursor-pointer">
				<img src={img} alt="" className="h-full w-full object-cover" />
			</Link>

			{/* Name and rating */}
			<div className="w-full flex flex-col lg:flex-row lg:items-center justify-between">
				{/* Name */}
				<p className="text-xl lg:pl-4">
					<span>{index + 1}. </span>
					{name}
				</p>

				{/* Rating */}
				<div className="flex items-center gap-x-2 lg:pr-4 pb-4">
					<div className="flex items-center gap-x-1">
						<FaStar className="text-yellow-400 text-2xl md:text-xl" />
						<span className="text-xl">{rating.toFixed(2)}</span>
					</div>
					<div className="flex flex-col md:flex-row gap-x-1 gap-y-[2px] text-gray-400 text-xs leading-3">
						<p>{ratedByCount}</p>
						<p>ratings</p>
					</div>
				</div>
			</div>

			{/* Roles */}
			<div className="hidden lg:flex flex-col gap-y-5">
				<div className="flex gap-x-5 ml-16">
					{roles.slice(0, 5).map((role, i) => (
						<Link
							key={i}
							className={
								"relative min-w-[110px] w-[110px] min-h-[110px] h-[110px] cursor-pointer " +
								(currentRole === role
									? "border-2 border-yellow-400"
									: "border border-gray-300")
							}
							onMouseEnter={() => handleSelectedRole(role)}
						>
							<img
								src={role.characterBanner || img}
								alt="character img"
								className="h-full w-full object-cover"
							/>
						</Link>
					))}
				</div>
				<div className="ml-16">
					<span className="text-gray-400">as </span>
					<span>{currentRole.characterName}</span>{" "}
					<span className="text-gray-400">
						in{" "}
						{currentRole.movie
							? "movie"
							: currentRole.serie
								? "serie "
								: null}{" "}
					</span>
					<span>
						{currentRole.movie
							? currentRole.movie.title
							: currentRole.serie
								? currentRole.serie.title
								: null}
					</span>
				</div>
			</div>
		</div>
	);
};

export default RankingResultActor;
