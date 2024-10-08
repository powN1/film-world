import React from "react";
import { Link } from "react-router-dom";

export default function WritePage() {
	return (
		<section className="flex flex-col bg-white">
			<div className="lg:w-[55%] w-full px-3 lg:px-0 mx-auto">
				<div className="flex flex-col py-10 items-center text-center">
					<Link to="/write-article" className="w-full lg:w-1/3 p-4 border border-gray-400 rounded cursor-pointer">
						Article/News
					</Link>
					<div className="flex py-2 w-full lg:w-1/3 items-center">
            <div className="bg-gray-300 h-[1px] w-full"></div>
						<div className="p-2 -mt-1 text-gray-500">or</div>
            <div className="bg-gray-300 h-[1px] w-full"></div>
					</div>
					<Link to="/write-review" className="w-full lg:w-1/3 p-4 border border-gray-400 rounded cursor-pointer">
						Review
					</Link>
				</div>
			</div>
		</section>
	);
}
