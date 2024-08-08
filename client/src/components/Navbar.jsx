import { Link, Outlet } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { CiUser } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import filmwebLogo from "../imgs/filmweb-logo.png";
import filmwebLogoSmall from "../imgs/filmweb-logo-small.png";
import { navbarItems } from "./navbarItems";
import { useEffect, useRef, useState } from "react";
import deadpool from "../imgs/deadpool.jpg";
import mcu from "../imgs/mcu.jpg";
import rdj from "../imgs/rdj.jpg";
import batman from "../imgs/batman.jpg";
import giancarlo from "../imgs/giancarlo.jpg";
import dexter from "../imgs/dexter.jpg";
import SearchPoster from "../common/SearchPoster";

const Navbar = () => {
	const movies = [
		{
			title: "I am legend 2",
			img: deadpool,
			year: 2012,
		},
		{
			title: "Awoken",
			img: mcu,
			year: 2001,
		},
		{
			title: `Code of Evil`,
			img: rdj,
			year: 1995,
		},
		{
			title: `Twisters`,
			img: batman,
			year: 1982,
		},
		{
			title: `Black telephone`,
			img: giancarlo,
			year: 2022,
		},
		{
			title: `Dexter`,
			img: dexter,
			year: 1999,
		},
	];

	const [navbarSize, setNavbarSize] = useState("big");
	const [searchModalVisible, setSearchModalVisible] = useState(false);
	const [modalInputValue, setModalInputValue] = useState("");
	const [foundMovies, setFoundMovies] = useState([]);
	const [showMobileMenu, setShowMobileMenu] = useState(false);

	const modalInputRef = useRef(null);

	const handleDropdown = (e) => {
		const list = e.currentTarget.children[1];
		list.classList.toggle("animate-slide");
		list.classList.toggle("h-fit");
		list.classList.toggle("visible");
		// if (list.classList.contains("invisible")) {
		// 	list.classList.remove("invisible");
		// 	list.classList.remove("h-0");
		// 	list.classList.add("visible");
		// 	list.classList.add("h-fit");
		// } else {
		// 	list.classList.remove("visible");
		// 	list.classList.remove("h-fit");
		// 	list.classList.add("invisible");
		// 	list.classList.add("h-0");
		// }
	};

	const handleInputSearch = (e) => {
		setModalInputValue(e.target.value);
	};

	const resizeNavbar = () => {
		if (window.scrollY >= 250) {
			if (navbarSize !== "small") {
				setNavbarSize("small");
			}
		} else if (window.scrollY < 100) {
			if (navbarSize !== "big") {
				setNavbarSize("big");
			}
		}
	};

	const handleSearchModal = () => {
		if (searchModalVisible) {
			document.body.style.overflow = "hidden";
			modalInputRef.current.focus();
		} else {
			document.body.style.overflow = "visible";
			setModalInputValue("");
			setFoundMovies([]);
		}
	};

	const handleMobileMenu = () => {
		if (showMobileMenu) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "visible";
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", resizeNavbar);

		handleSearchModal();
		handleMobileMenu();

		if (modalInputValue) {
			setFoundMovies(
				movies.filter((movie) =>
					movie.title.toLowerCase().includes(modalInputValue),
				),
			);
		}
	}, [navbarSize, searchModalVisible, modalInputValue, showMobileMenu]);

	return (
		<>
			<nav className="sticky top-0 z-20 font-lato bg-black flex flex-col justify-between items-center gap-y-3 text-white">
				<div
					className={
						"flex items-center gap-y-2 w-[55%] max-lg:w-full max-lg:gap-x-6 max-lg:px-4 max-lg:py-3 " +
						(navbarSize === "small"
							? "gap-x-2"
							: "flex-wrap justify-evenly lg:gap-x-4 lg:pt-3 max-lg:flex-nowrap max-lg:justify-end")
					}
				>
					<Link
						to="/"
						className={
							navbarSize === "small"
								? "h-[25px] -order-2"
								: "h-[40px] max-lg:mr-auto max-lg:h-[32px]"
						}
					>
						<img
							src={navbarSize === "small" ? filmwebLogoSmall : filmwebLogo}
							alt="website logo"
							className="h-full w-full object-cover block mx-auto select-none"
						/>
					</Link>
					{/* Search input */}
					<div
						className={
							"relative text-black text-sm self-stretch w-[40px] " +
							(navbarSize === "small"
								? "self-stretch w-[40px] cursor-pointer group"
								: "self-stretch grow max-lg:grow-0")
						}
						onClick={() => {
							setSearchModalVisible(true);
						}}
					>
						<input
							type="text"
							className={
								"h-full max-lg:w-0 " +
								(navbarSize === "small" ? "w-0" : "w-full lg:input-box")
							}
							placeholder="Look for movies, series, animations..."
						/>
						<FaMagnifyingGlass
							className={
								"absolute left-3 top-1/2 translate-y-[-50%] text-lg " +
								(navbarSize === "small"
									? "text-white opacity-75"
									: "text-yellow-400 max-lg:text-white opacity-50 max-lg:opacity-75 max-lg:text-2xl")
							}
						/>
					</div>
					{/* Sign in google button */}
					<button
						className={
							"py-2 px-7 flex justify-center items-center gap-x-3 rounded bg-white text-black font-medium max-lg:hidden " +
							(navbarSize === "small" ? "" : "self-stretch")
						}
					>
						<FaGoogle className="text-yellow-400 text-lg" />
						Sign in through google
					</button>
					{/* Sign in button */}
					<button
						className={
							"flex justify-center items-center gap-x-2 h-full lg:hover:text-yellow-400 duration-200 max-lg:flex-col " +
							(navbarSize === "small" ? "flex-col" : "")
						}
					>
						<CiUser
							className={
								navbarSize === "small" ? "text-xl" : "text-2xl max-lg:text-2xl"
							}
						/>
						<p
							className={navbarSize === "small" ? "text-xs" : "max-lg:text-xs"}
						>
							Sign in
						</p>
					</button>

					{/* Mobile menu button */}
					<button
						className="flex justify-center items-center gap-x-2 h-full max-lg:flex-col lg:hidden"
						onClick={() => setShowMobileMenu((prevVal) => !prevVal)}
					>
						<RxHamburgerMenu
							className={
								navbarSize === "small" ? "text-xl" : "text-2xl max-lg:text-2xl"
							}
						/>
						<p
							className={navbarSize === "small" ? "text-xs" : "max-lg:text-xs"}
						>
							Menu
						</p>
					</button>

					{/* Menu categories */}
					<ul
						className={
							"list-none max-lg:hidden " +
							(navbarSize === "small" ? "-order-1 grow" : "w-full")
						}
					>
						{navbarItems.map((item, itemIndex) => {
							return (
								<li
									key={itemIndex}
									className="relative float-left group hover:text-yellow-500 duration-200 hover:before:content-[''] hover:before:absolute hover:before:bottom-0 hover:before:left-0 hover:before:bg-yellow-500 hover:before:w-full hover:before:h-[4px]"
								>
									<Link
										to={item.path}
										className={
											"relative block " +
											(navbarSize === "small"
												? "text-xs py-5 px-2"
												: "py-3 px-5")
										}
									>
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
				</div>
			</nav>
			{searchModalVisible ? (
				<div className="w-screen h-screen fixed top-0 left-0 bg-white z-30 flex justify-center">
					<div className="w-[55%] flex flex-col py-8 gap-y-8">
						{/* Search */}
						<div className="flex gap-x-4">
							<div className="relative flex justify-between w-full">
								<input
									type="text"
									className="input-box grow border border-gray-400 rounded-md focus:border-yellow-400 duration-300 focus:[box-shadow:_2px_2px_6px_rgb(250_204_21/_15%)]"
									placeholder="Search..."
									ref={modalInputRef}
									onChange={handleInputSearch}
									value={modalInputValue}
								/>
								<FaMagnifyingGlass className="absolute left-3 top-1/2 translate-y-[-50%] text-lg text-yellow-400" />
								{modalInputValue ? (
									<button
										className="absolute right-3 top-1/2 translate-y-[-50%] py-2 px-5 font-bold text-xs border border-gray-200 rounded-sm hover:bg-black hover:text-white duration-300"
										onClick={() => setModalInputValue("")}
									>
										Clear
									</button>
								) : null}
							</div>
							<button
								className="py-3 px-6 rounded-sm text-black font-bold hover:bg-slate-50 duration-300"
								onClick={() => setSearchModalVisible(false)}
							>
								Cancel
							</button>
						</div>

						{modalInputValue ? (
							<div className="flex flex-col gap-y-10">
								<div className="grid grid-rows-1 grid-cols-6 gap-x-5">
									{/* SLIDES */}
									{foundMovies.map((movie, i) => (
										<SearchPoster
											key={i}
											title={movie.title}
											img={movie.img}
											year={movie.year}
											type="searchResult"
										/>
									))}
								</div>
								{foundMovies.length !== 0 ? (
									<Link
										to="/"
										className="self-center py-2 px-14 border border-gray-200 font-bold hover:bg-black hover:text-white duration-300"
									>
										See more results
									</Link>
								) : null}
							</div>
						) : (
							<div className="flex gap-x-5">
								<div className="w-1/2 flex flex-col gap-y-4">
									<div className="flex justify-between items-end">
										<p className="text-xl uppercase tracking-tighter">
											Best movies
										</p>
										<Link
											to="/"
											className="text-xs text-yellow-700 hover:text-yellow-400 duration-500"
										>
											See all
										</Link>
									</div>
									<div className="flex gap-x-5">
										{/* SLIDES */}
										{movies.slice(3).map((movie, i) => (
											<SearchPoster
												key={i}
												title={movie.title}
												img={movie.img}
												type="poster"
											/>
										))}
									</div>
								</div>

								<div className="w-1/2 flex flex-col gap-y-4">
									<div className="flex justify-between items-end">
										<p className="text-xl uppercase tracking-tighter">
											Best series
										</p>
										<Link
											to="/"
											className="text-xs text-yellow-700 hover:text-yellow-400 duration-500"
										>
											See all
										</Link>
									</div>
									<div className="grid grid-rows-1 grid-cols-3 gap-x-5">
										{/* SLIDES */}
										{movies.slice(3).map((movie, i) => (
											<SearchPoster
												key={i}
												title={movie.title}
												img={movie.img}
												type="poster"
											/>
										))}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			) : null}

			{showMobileMenu ? (
				<div className="flex flex-col w-screen h-screen fixed top-0 left-0 bg-white z-30">
					<div className="bg-red-200 px-3 py-3 flex flex-col gap-y-2">
						<div className="flex items-center justify-between">
							<Link to="/" className="h-[30px]">
								<img
									src={filmwebLogo}
									alt="website logo"
									className="h-full w-full object-cover block mx-auto select-none"
								/>
							</Link>
							<button className="" onClick={handleMobileMenu}>
								<IoMdClose
									className="text-white text-4xl"
									onClick={() => setShowMobileMenu((prevVal) => !prevVal)}
								/>
							</button>
						</div>
						<div className="flex flex-col gap-y-2">
							<button className="h-[36px] py-2 px-7 flex justify-center items-center gap-x-2 rounded bg-white text-gray-600 font-bold text-sm">
								<FaGoogle className="text-yellow-400 text-lg" />
								Sign in through google
							</button>
							<button className="h-[36px] py-2 px-7 flex justify-center items-center gap-x-2 rounded bg-transparent text-white text-sm border border-gray-200">
								<CiUser className="text-xl" />
								Sign in
							</button>
						</div>
					</div>

					<ul className="list-none flex flex-col">
						{navbarItems.map((item, itemIndex) => {
							return (
								<li
									key={itemIndex}
									className="relative  "
									onClick={handleDropdown}
								>
									<Link to={item.path} className="relative block py-3 px-5">
										{item.title}
									</Link>
									{item.submenu ? (
										<ul className="w-full list-none block transition-all duration-500 ease-in-out ">
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
				</div>
			) : null}
			<Outlet />
		</>
	);
};

export default Navbar;
