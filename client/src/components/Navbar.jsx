import { Link, Outlet } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { CiUser } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";
import filmwebLogo from "../imgs/filmweb-logo.png";
import filmwebLogoSmall from "../imgs/filmweb-logo-small.png";
import { navbarItems } from "./navbarItems";
import { useContext, useEffect, useRef, useState } from "react";
import deadpool from "../imgs/deadpool.jpg";
import mcu from "../imgs/mcu.jpg";
import rdj from "../imgs/rdj.jpg";
import batman from "../imgs/batman.jpg";
import giancarlo from "../imgs/giancarlo.jpg";
import dexter from "../imgs/dexter.jpg";
import SearchPoster from "../common/SearchPoster";
import { MediaQueriesContext } from "../App";
import { dummyDataMovies } from "../common/dummyDataMovies";

const Navbar = () => {
	const { mobileView, tabletView } = useContext(MediaQueriesContext);


	const [navbarSize, setNavbarSize] = useState("big");
	const [searchModalVisible, setSearchModalVisible] = useState(false);
	const [modalInputValue, setModalInputValue] = useState("");
	const [foundMovies, setFoundMovies] = useState([]);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showMobileNavbar, setShowMobileNavbar] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	const modalInputRef = useRef(null);

	const handleMobileMenuDropdown = (e) => {
		const list = e.currentTarget.children[1];
		if (list) {
			if (list.classList.contains("invisible")) {
				list.classList.remove("invisible");
				list.classList.remove("max-h-0");
				list.classList.add("visible");
				list.classList.add("max-h-[700px]");
				e.currentTarget.children[0].children[0].classList.toggle("rotate-180");
			} else {
				list.classList.remove("visible");
				list.classList.remove("max-h-[700px]");
				list.classList.add("invisible");
				list.classList.add("max-h-0");
				e.currentTarget.children[0].children[0].classList.toggle("rotate-180");
			}
		}
	};

	const handleInputSearch = (e) => {
		setModalInputValue(e.target.value);
	};

	const showOrHideNavbarMobile = () => {
		if (window.scrollY > lastScrollY) {
			// if scroll down hide the navbar
			setShowMobileNavbar(false);
		} else {
			// if scroll up show the navbar
			setShowMobileNavbar(true);
		}

		// remember current page location to use in the next move
		setLastScrollY(window.scrollY);
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
			document.body.style.position = "fixed";
			document.body.style.width = "100%";
			modalInputRef.current.focus();
		} else {
			document.body.style.overflow = "visible";
			document.body.style.position = "";
			document.body.style.width = "";
			setModalInputValue("");
			setFoundMovies([]);
		}
	};

	const handleMobileMenu = () => {
		if (showMobileMenu) {
			document.body.style.overflow = "hidden";
			document.body.style.position = "fixed";
			document.body.style.width = "100%";
		} else {
			document.body.style.overflow = "visible";
			document.body.style.position = "";
			document.body.style.width = "";
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", resizeNavbar);
		window.addEventListener("scroll", showOrHideNavbarMobile);

		handleSearchModal();
		handleMobileMenu();

		if (modalInputValue) {
			setFoundMovies(
				dummyDataMovies.filter((movie) =>
					movie.title.toLowerCase().includes(modalInputValue),
				),
			);
		}

		return () => {
			window.removeEventListener("scroll", resizeNavbar);
			window.removeEventListener("scroll", showOrHideNavbarMobile);
		};
	}, [
		navbarSize,
		searchModalVisible,
		modalInputValue,
		showMobileMenu,
		lastScrollY,
	]);

	return (
		<div className="bg-black">
			<nav
				className={
					"sticky w-full top-0 z-20 font-lato bg-black flex flex-col justify-between items-center gap-y-3 text-white duration-300 " +
					(mobileView ? (showMobileNavbar ? "" : "translate-y-[-100%]") : "")
				}
			>
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
							mobileView || tabletView
								? "h-[40px] max-lg:mr-auto max-lg:h-[32px]"
								: navbarSize === "small"
									? "h-[25px] -order-2"
									: "h-[40px] max-lg:mr-auto max-lg:h-[32px]"
						}
					>
						<img
							src={
								mobileView || tabletView
									? filmwebLogo
									: navbarSize === "small"
										? filmwebLogoSmall
										: filmwebLogo
							}
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
									(mobileView || tabletView
									? "text-yellow-400 max-lg:text-white opacity-50 max-lg:opacity-75 max-lg:text-2xl"
									: navbarSize === "small"
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
                (mobileView || tabletView ?  "text-2xl max-lg:text-2xl" :  
								navbarSize === "small" 
									? "text-xl"
									: "text-2xl max-lg:text-2xl")
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
                (mobileView || tabletView ?  "text-2xl max-lg:text-2xl" : 

								navbarSize === "small"
									? "text-xl"
									: "text-2xl max-lg:text-2xl"
                )
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
				<div className="w-screen h-screen fixed top-0 left-0 bg-white z-30 flex justify-center overflow-hidden">
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
										{dummyDataMovies.slice(3).map((movie, i) => (
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
										{dummyDataMovies.slice(3).map((movie, i) => (
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
				<div className="flex flex-col w-screen h-screen fixed top-0 left-0 bg-white z-30 overflow-hidden">
					<div className="bg-gradient-to-r from-[#4D2F3B] from-10% via-[#1D2236] via-40% to-[#6B949A] px-3 py-4 flex flex-col gap-y-2">
						<div className="flex items-center justify-between">
							<Link to="/" className="h-[32px]">
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
									className="relative"
									onClick={handleMobileMenuDropdown}
								>
									<Link
										to={item.path}
										className="relative flex justify-between items-center py-3 px-5 bg-white"
									>
										{item.title}
										{item.submenu ? (
											<IoChevronDown className="text-gray-400 text-xl duration-300 origin-center" />
										) : null}
									</Link>
									{item.submenu ? (
										<ul className="w-full list-none block transition-all duration-500 max-h-0 invisible sliding relative after:content-[''] after:w-[4px] after:h-full after:absolute after:left-0 after:top-0 after:bg-yellow-400 ">
											{item.submenu.map((submenu, submenuIndex) => (
												<li
													key={submenuIndex}
													className="bg-neutral-200 text-black text-nowrap first:pt-3 last:pb-3"
												>
													<Link className="block py-3 px-7 font-medium hover:text-yellow-500">
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
		</div>
	);
};

export default Navbar;
