import { useContext } from "react";
import { MediaQueriesContext } from "../App";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { getFullDay, getFullYear } from "../common/date";

const PersonDetails = ({ person }) => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);

	const covers = person.roles.map((role) => {
		return role.movie ? role.movie.cover : role.serie ? role.serie.cover : null;
	});
	const currentYear = getFullYear(new Date());
	const personBirthYear =
		currentYear - getFullYear(person.personal_info.dateOfBirth);
	const personAge = getFullDay(person.personal_info.dateOfBirth);

	return (
		<div className="flex flex-col">
			<div className="flex items-end relative min-h-[230px] h-[230px] md:min-h-[300px] md:h-[300px] w-full">
				{/* Covers background */}
				<div className="absolute top-0 left-1/2 -translate-x-1/2 transform-x-[20%] flex justify-center items-center gap-x-5 w-3/4 h-full opacity-20">
					{covers.map((cover, i) => (
						<img
							key={i}
							src={cover}
							className={"h-2/3 blur-[1px] " + (i % 2 ? "-mt-10" : "mt-10")}
						/>
					))}
				</div>

				{/* Actor name */}
				<div className="flex flex-col ml-5 mb-5 z-10 sm:px-12 sm:ml-0 lg:absolute lg:bottom-0 lg:left-[32%]">
					<span className="text-xs font-bold text-yellow-400 uppercase">
						Actor
					</span>
					<h1 className="text-white text-3xl sm:text-4xl font-bold font-sansNarrow uppercase">
						{person.personal_info.name}
					</h1>

					<div className="flex gap-2 mt-2 self-start text-white">
						<div className="flex items-center gap-x-2">
							<FaStar className="text-2xl sm:text-3xl text-yellow-400" />
							<p className="text-2xl sm:text-3xl">{person.activity.rating}</p>
						</div>
						<p className="flex flex-col justify-center lg:justify-start text-gray-400">
							<span className="text-xs -mb-[1px]">
								{person.activity.ratedByCount}
							</span>
							<span className="text-xs -mt-[1px]">ratings</span>
						</p>
					</div>
				</div>
			</div>

			{/* Actor info */}
			<div className="w-full bg-white">
				<div className="mx-auto lg:w-[55%]">
					<div className="flex flex-col gap-y-3 w-full px-4 sm:px-12 lg:px-0 py-4 lg:py-5">
              {/* Tablet and desktop img */}
						<div className="hidden lg:block h-[285px] w-[200px] min-w-[200px] border border-gray-400/50 translate-y-[-70%] absolute ">
							<img
								src={person.banner}
								alt="person image"
								className="h-full w-full"
							/>
						</div>
						<div className="flex lg:w-[60%] mx-auto">
							{/* Actor img */}
							<div className="lg:hidden h-[150px] w-[105px] min-w-[105px] border border-gray-400/50">
								<img
									src={person.banner}
									alt="person image"
									className="h-full w-full"
								/>
							</div>

							<p className="w-full pl-4 line-clamp-4 leading-6 md:leading-7 text-ellipsis">
								{person.personal_info.bio}
							</p>
						</div>

						<div className="flex flex-col gap-y-2 w-full lg:text-sm lg:w-[60%] lg:mx-auto lg:px-4">
							<p className="text-base">Personal info</p>
							<div className="flex text-base">
								<span className="text-gray-400 min-w-1/3 w-1/3 md:min-w-1/5 md:w-1/5">
									Age:
								</span>
								<p className="w-2/3 lg:w-4/5">{personBirthYear}</p>
							</div>

							<div className="flex">
								<span className="text-gray-400 min-w-1/ w-1/3 md:min-w-1/5 md:w-1/5">
									Date of birth:
								</span>
								<p className="w-2/3 lg:w-4/5">{personAge}</p>
							</div>

							<div className="flex">
								<span className="text-gray-400 min-w-1/3 w-1/3 md:min-w-1/5 md:w-1/5">
									Place of birth:
								</span>
								<p className="w-2/3 lg:w-4/5">
									{person.personal_info.placeOfBirth}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PersonDetails;
