import { useContext } from "react";
import { Link } from "react-router-dom";
import { MediaQueriesContext } from "../App";

const UserInfoPreview = ({ user }) => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);
	const {
		personal_info: { firstName, surname, username, profile_img },
		articles,
		reviews,
		ratings,
	} = user;

	return (
		<div className="w-full">
			<div className="h-[50vh] lg:w-[55%] w-full mx-auto relative text-white">
				<div
					to={""}
					style={{
						backgroundImage: `linear-gradient(to bottom ,rgba(0,0,0,1) 2%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 98%), ${mobileView ? "" : "linear-gradient(to right, rgba(0,0,0,1) 5%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 95%),"} url(${user.personal_info.profile_img})`,
					}}
					className="h-full w-full block bg-cover bg-center bg-no-repeat transition-opactiy duration-500 "
				></div>
				<div className="w-full absolute left-1/2 lg:left-0 bottom-[50%] translate-y-[50%] translate-x-[-50%] lg:translate-x-[0] px-3 md:px-12 lg:px-0 flex flex-col items-center lg:flex-row gap-x-6 gap-y-1 lg:gap-y-2 transition-opacity duration-500">
					<div className="h-[160px] w-[160px] lg:h-[120px] lg:w-[120px] rounded-full border border-gray-400 p-1">
						<img
							src={profile_img}
							alt="user image"
							className="w-full h-full object-cover rounded-full"
						/>{" "}
					</div>
					<div className="flex flex-col gap-y-1">
						<h2 className="font-bold text-5xl capitalize font-sansNarrow">
							{firstName} {surname}{" "}
						</h2>
						<p className="text-center lg:text-left">{username}</p>
					</div>
				</div>

				{(articles || reviews || ratings) && (
					<div className="w-full flex items-center justify-evenly z-10 md:justify-center md:gap-x-6 absolute left-0 bottom-0 translate-y-[50%] h-[60px] lg:rounded-md bg-white [box-shadow:_2px_2px_6px_rgb(0_0_0_/_15%)] text-black">
						{articles && (
							<>
								<Link
									to=""
									className="capitalize hover:bg-gray-400/40 py-1 px-4 cursor-pointer flex flex-col items-center lg:flex-row gap-x-1"
								>
									articles <span className="font-bold">
										{articles.length}
									</span>{" "}
								</Link>
								<span className="w-[1px] h-3/4 bg-gray-400/30 first:hidden last:hidden"></span>
							</>
						)}
						{reviews && (
							<>
								<Link
									to=""
									className="capitalize hover:bg-gray-400/40 py-1 px-4 cursor-pointer flex flex-col items-center lg:flex-row gap-x-1"
								>
									reviews <span className="font-bold">
										{reviews.length}
									</span>{" "}
								</Link>

								<span className="w-[1px] h-3/4 bg-gray-400/30 first:hidden last:hidden"></span>
							</>
						)}
						{ratings && (
							<>
								<Link
									to=""
									className="capitalize hover:bg-gray-400/40 py-1 px-4 cursor-pointer flex flex-col items-center lg:flex-row gap-x-1"
								>
									ratings <span className="font-bold">
										{ratings.length}
									</span>{" "}
								</Link>
								<span className="w-[1px] h-3/4 bg-gray-400/30 first:hidden last:hidden"></span>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default UserInfoPreview;
