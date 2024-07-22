import { Link } from "react-router-dom";

import filmwebLogo from "../imgs/filmweb-logo.svg";

const Navbar = () => {
	return (
		<div className="h-[12vh] bg-red-300 flex flex-col justify-center items-center">
			<div className="flex items-center w-[55%] bg-slate-600">
				<Link to="/">
					<img
						src={filmwebLogo}
						alt="website logo"
						className="h-full object-contain block mx-auto select-none"
					/>
				</Link>
				<input type="text" className="" />
				<button>Sign in through google</button>
				<button>Sign in</button>
			</div>
			<div>second</div>
		</div>
	);
};

export default Navbar;
