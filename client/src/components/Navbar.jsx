import { Link, Outlet } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { CiUser } from "react-icons/ci";
import filmwebLogo from "../imgs/filmweb-logo.svg";
import { navbarItems } from "./navbarItems";
import { useRef } from "react";

const Navbar = () => {
	let ref = useRef();
	const handleDropdown = () => {
		console.log(ref.current);
		ref.current.classList.toggle("hidden");
	};

	return (
		<>
			<nav className="font-lato bg-black flex flex-col justify-between items-center gap-y-3 text-white pt-3">
				<div className="flex items-center justify-center gap-x-4 w-[55%]">
					<Link to="/">
						<img
							src={filmwebLogo}
							alt="website logo"
							className="h-full object-contain block mx-auto select-none"
						/>
					</Link>
					<div className="relative h-full grow-[8] text-black">
						<input
							type="text"
							className="input-box w-full"
							placeholder="Look for movies, series, animations..."
						/>
						<FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 text-yellow-400 text-lg" />
					</div>
					<button className="grow-[2] p-2 flex justify-center items-center gap-x-3 rounded bg-white text-black font-medium">
						<FaGoogle className="text-yellow-400 text-lg" />
						Sign in through google
					</button>
					<button className="flex justify-center items-center gap-x-2 px-3 h-full hover:text-yellow-400 duration-200">
						<CiUser className="text-2xl" />
						Sign in
					</button>
				</div>
				<ul className="list-none w-[55%]">
					{navbarItems.map((item, itemIndex) => {
						return (
							<li
								key={itemIndex}
								className="relative float-left group hover:text-yellow-500 duration-200 hover:before:content-[''] hover:before:absolute hover:before:bottom-0 hover:before:left-0 hover:before:bg-yellow-500 hover:before:w-full hover:before:h-[4px]"
							>
								<Link to={item.path} className="relative block py-3 px-5">
									{item.title.toUpperCase()}
								</Link>
								{item.submenu ? (
									<ul className="absolute left-0 list-none group-hover:block hidden z-10">
										{item.submenu.map((submenu, submenuIndex) => (
											<li
												key={submenuIndex}
												className="bg-neutral-200 text-black text-nowrap first:pt-3 last:pb-3"
											>
												<Link className="block py-2 px-7 uppercase font-medium hover:text-yellow-500">
													{submenu.title}
												</Link>
											</li>
										))}
									</ul>
								) : null}
							</li>
						);
					})}
				</ul>
			</nav>
			<Outlet />
		</>
	);
};

export default Navbar;
