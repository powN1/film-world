import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { MediaQueriesContext } from "../App";
import { UserRatingsContext } from "../pages/UserDetailsPage";

const categories = [
	{ title: "Ratings" },
	{ title: "Wants to see" },
	{ title: "Favorite" },
];

const medias = [
	{ title: "Movies" },
	{ title: "Series" },
	{ title: "Games" },
	{ title: "Roles" },
];

const UserRatingsInfo = ({ user }) => {
  const { currentCategory, setCurrentCategory, currentMediaSelected, setCurrentMediaSelected } = useContext(UserRatingsContext)

	const { personal_info: { firstName, surname, username, profile_img }, ratings } = user;

	const handleShowUnderline = (e) => {
		const category = e.target.innerText.toLowerCase();

		if (category !== currentCategory) {
			setCurrentCategory(category);
			setCurrentMediaSelected(medias[0].title.toLowerCase());
		}
	};

	const handleShowHighlight = (e) => {
		const media = e.target.innerText.toLowerCase();

		if (media !== currentMediaSelected) {
			setCurrentMediaSelected(media);
		}
	};
	return (
		<>
			<div className="w-full border-t border-gray-400/20">
				<div className="lg:w-[55%] w-full mx-auto relative text-white">
					<div className="relative flex flex-col">
						<div className="flex flex-col lg:flex-row justify-between pb-[30px] pt-3 px-2 lg:px-0">
							{/* User profile */}
							<div className="flex items-center gap-x-2 lg:-mt-3">
								<Link
									to={`/user/${username}`}
									className="h-[40px] w-[40px] rounded-full border border-gray-400 p-[1px]"
								>
									<img
										src={profile_img}
										alt="user image"
										className="w-full h-full object-cover rounded-full"
									/>{" "}
								</Link>
								<div className="capitalize font-bold text-xl">
									{firstName} {surname}
								</div>
							</div>

							{/* Categories */}
							<div className="flex items-center flex-wrap justify-center gap-x-8 lg:px-3">
								{categories.map((category, i) => {
									return (
										<li key={i} className="list-none">
											<Link
												path="/"
												className={
													"block px-3 py-2 relative duration-300 after:content-[''] after:z-10 after:absolute after:bottom-0 after:h-[3px] after:bg-yellow-400 after:duration-300 after:transition-[width_left] " +
													(currentCategory === category.title.toLowerCase()
														? "after:w-[100%] after:left-0 "
														: "after:w-[0%] after:left-[50%] text-gray-400 hover:text-white")
												}
												onClick={handleShowUnderline}
											>
												{category.title}
											</Link>
										</li>
									);
								})}
							</div>
						</div>
						{/* Media categories */}
						<div className="w-full flex items-center justify-evenly z-10 md:justify-start px-5 md:gap-x-6 absolute left-0 bottom-0 translate-y-[50%] h-[60px] lg:rounded-sm bg-white [box-shadow:_2px_2px_6px_rgb(0_0_0_/_15%)] text-black">
							{medias.map((media, i) => {
                if(currentCategory.toLowerCase() === "wants to see" && media.title.toLowerCase() === "roles") {
                  return
                }
								return (
									<li key={i} className="list-none">
										<Link
											path="/"
											className={
												"block px-3 py-1 relative " +
												(currentMediaSelected === media.title.toLowerCase()
													? "bg-yellow-400 font-bold"
													: "")
											}
											onClick={handleShowHighlight}
										>
											{media.title}
										</Link>
									</li>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default UserRatingsInfo;
