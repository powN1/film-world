import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const RankingResultRole = (props) => {
  const { type, index, img, actor, nameId, role, title, titleId, year, rating, ratedByCount } = props;
  console.log(`type is ${type} titleId is :${titleId}`)
  return (
    <div className={"w-full flex gap-x-4 px-3 py-2 pb-6 md:pb-2 md:px-0 " + (index % 2 === 1 ? "bg-gray-200/25" : "")}>
      <Link
        to={`/person/${nameId}`}
        className="relative min-w-[110px] w-[110px] min-h-[110px] h-[110px] border border-gray-300 cursor-pointer"
      >
        <img src={img} alt="" className="h-full w-full object-cover" />
      </Link>

      <div className="w-full flex flex-col gap-y-3 justify-between py-1">
        <div className="w-full flex flex-col lg:flex-row lg:items-start justify-between basis-1/2 gap-y-3">
          <div className="flex flex-col gap-y-3 text-xl">
            <div className="flex gap-x-1 font-base md:font-bold">
              <div className="md:flex">
                <p className="md:mr-1">
                  <span>{index + 1}. </span>
                  <Link to={`/person/${nameId}`}>{actor.personal_info.name}</Link>
                </p>{" "}
                <p className="text-gray-400">as {role}</p>
              </div>
            </div>
            <div className="hidden md:block text-sm">
              <Link to={titleId && `/${type}/${titleId}`}>{title}</Link> ({year})
            </div>
          </div>

          {/* Rating */}
          <div className="flex md:flex-col items-center md:items-end gap-x-2 lg:pr-4">
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
      </div>
    </div>
  );
};

export default RankingResultRole;
