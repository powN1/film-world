import FilmRolesRankingSlide from "./FilmRolesRankingSlide";

const FilmRolesRanking = ({ media }) => {
	return (
		<div className="bg-gray-100 border-y border-gray-200 py-10">
			<div className="flex flex-col gap-y-5 mx-auto lg:w-[55%]">
				<h3 className="text-lg font-bold">Role ranking</h3>
				<div className="flex pb-4 overflow-x-scroll">
					{media.roles.map((role, i) => {
						return <FilmRolesRankingSlide key={i} actor={role.actor} role={role} />;
					})}
				</div>
			</div>
		</div>
	);
};

export default FilmRolesRanking;
