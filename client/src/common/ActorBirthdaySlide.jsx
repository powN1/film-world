import { Link } from "react-router-dom";
import { getYear } from "./date";

const ActorBirthdaySlide = ({ img, firstName, surname, age }) => {
  let date = new Date();
  const actorsAge = date.getYear() - getYear(age)

	return (
		<Link
			to=""
			className="relative flex flex-col mx-3 items-center cursor-pointer group"
		>
			<div className="h-[220px] overflow-hidden border border-gray-400">
				<img
					src={img}
					alt={`${surname} image`}
					className="relative h-full w-full object-cover group-hover:scale-110 duration-300"
				/>
			</div>
			<div className="flex flex-col gap-y-1 py-3 items-center text-center">
				<p className="text-xl">{firstName} {surname}</p>
				<p>{actorsAge} years old</p>
			</div>
		</Link>
	);
};

export default ActorBirthdaySlide;
