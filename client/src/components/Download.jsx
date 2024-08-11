import { Link } from "react-router-dom";
import googlePlay from "../imgs/button_google.svg";
import appleStore from "../imgs/button_ios.svg";
import phoneApp from "../imgs/phoneApp.webp";

const Download = () => {
	return (
		<div className="flex justify-evenly items-center max-lg:px-4">
			<div className="flex flex-col gap-y-2">
				<h4 className="font-bold text-xl">Download our app!</h4>
				<p className="w-[75%] max-lg:w-[85%]">
					Explore movie world in your reach! Watch, rate and share your favorite
					productions with friends!
				</p>
				<div className="flex mt-6 gap-x-3">
					<Link to="/" className="h-full w-[17%] max-lg:w-[40%]">
						<img
							src={appleStore}
							alt="apple store image"
							className="h-full w-full object-cover"
						/>
					</Link>
					<Link to="/" className="h-full w-[17%] max-lg:w-[40%]">
						<img
							src={googlePlay}
							alt="google play image"
							className="h-full w-full object-cover"
						/>
					</Link>
				</div>
			</div>
			<div>
				<img
					src={phoneApp}
					alt="phone app image"
					className="h-full w-full object-cover"
				/>
			</div>
		</div>
	);
};

export default Download;
