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
				<div className="w-full absolute left-0 bottom-[50%] translate-y-[50%] px-3 md:px-12 lg:px-0 flex gap-x-6 gap-y-1 lg:gap-y-2 transition-opacity duration-500">
					<div className="h-[120px] w-[120px] rounded-full border border-gray-400 p-1">
						<img
							src={profile_img}
							alt="user image"
							className="w-full h-full object-cover rounded-full"
						/>
					</div>
					<div className="flex flex-col gap-y-1">
						<h2 className="font-bold text-5xl capitalize font-sansNarrow">
							{firstName} {surname}
						</h2>
						<p>{username}</p>
					</div>
				</div>

				{(articles || reviews || ratings) && (
					<div className="w-full flex items-center justify-center gap-x-10 absolute left-0 bottom-0 translate-y-[50%] h-[60px] rounded-md bg-white border border-gray-400/30 text-black">
						{articles && (
							<Link
								to=""
								className="capitalize hover:bg-gray-400/40 py-1 px-4 cursor-pointer"
							>
								articles <span className="font-bold">
									{articles.length}
								</span>{" "}
							</Link>
						)}
						{reviews && (
							<Link
								to=""
								className="capitalize hover:bg-gray-400/40 py-1 px-4 cursor-pointer"
							>
								reviews <span className="font-bold">{reviews.length}</span>{" "}
							</Link>
						)}
						{ratings && (
							<Link
								to=""
								className="capitalize hover:bg-gray-400/40 py-1 px-4 cursor-pointer"
							>
								ratings <span className="font-bold">{ratings.length}</span>{" "}
							</Link>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default UserInfoPreview;
