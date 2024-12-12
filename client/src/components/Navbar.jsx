import { Link, Outlet } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { CiUser } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";
import { IoMdExit } from "react-icons/io";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import filmwebLogo from "../imgs/filmweb-logo.png";
import filmwebLogoSmall from "../imgs/filmweb-logo-small.png";
import { navbarItems } from "./navbarItems";
import { useContext, useEffect, useRef, useState } from "react";
import SearchPoster from "../common/SearchPoster";
import { DataContext, MediaQueriesContext, UserContext } from "../App";
import LoginModal from "./LoginModal";
import { removeFromSession, storeInSession } from "../common/session";
import { authWithGoogle } from "../common/firebase";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { getFullYear } from "../common/date";

const Navbar = () => {
	let { movies, series } = useContext(DataContext);
	let {
		userAuth,
		userAuth: {
			access_token,
			admin,
			profile_img,
			firstName,
			surname,
			username,
		},
		setUserAuth,
	} = useContext(UserContext);

	const { mobileView, tabletView } = useContext(MediaQueriesContext);

	const [navbarSize, setNavbarSize] = useState("big");
	const [searchModalVisible, setSearchModalVisible] = useState(false);
	const [modalInputValue, setModalInputValue] = useState("");
	const [allMedias, setAllMedias] = useState([]);
	const [foundMedias, setFoundMedias] = useState([]);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showMobileNavbar, setShowMobileNavbar] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [showProfilePanel, setShowProfilePanel] = useState(false);

	const [loginModalVisible, setLoginModalVisible] = useState(false);

	const prevSearchModalVisibleRef = useRef();
	const prevShowMobileMenuRef = useRef();
	const prevLoginModalVisibleRef = useRef();

	const modalInputRef = useRef(null);

	const fetchMovies = async () =>
		await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-movies");
	const fetchSeries = async () =>
		await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-series");
	const fetchGames = async () =>
		await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-games");
	const fetchActors = async () =>
		await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-actors");

	const handleMediaFetch = async () => {
		const movies = await fetchMovies();
		const series = await fetchSeries();
		const games = await fetchGames();
		const actors = await fetchActors();
		const allMedias = [
			...movies.data.movies,
			...series.data.series,
			...games.data.games,
			...actors.data.actors,
		];
		const sortedAllMedias = allMedias.sort((a, b) => {
			const aText = a.title ? a.title : a.personal_info.name;
			const bText = b.title ? b.title : b.personal_info.name;
			return aText.localeCompare(bText);
		});
		setAllMedias(sortedAllMedias);
	};

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

	const handleSearchModal = async () => {
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
			setFoundMedias([]);
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

	const handleLoginModal = () => {
		if (loginModalVisible) {
			document.body.style.overflow = "hidden";
			document.body.style.position = "fixed";
			document.body.style.width = "100%";
		} else {
			document.body.style.overflow = "visible";
			document.body.style.position = "";
			document.body.style.width = "";
		}
	};

	const handleUserPanel = () => {
		setShowProfilePanel((prevVal) => !prevVal);
	};

	const handleUserPanelBlur = () => {
		setTimeout(() => setShowProfilePanel(false), 100);
	};

	const signOutUser = () => {
		removeFromSession("user");
		setUserAuth({ access_token: null });
	};

	const userAuthThroughServer = (serverRoute, formData) => {
		axios
			.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
			.then(({ data }) => {
				storeInSession("user", JSON.stringify(data));
				setUserAuth(data);
			})
			.catch((err) => {
				toast.error(err);
			});
	};

	const handleGoogleAuth = (e) => {
		e.preventDefault();

		authWithGoogle()
			.then((user) => {
				let serverRoute = "/google-auth";

				let formData = { access_token: user.accessToken };

				userAuthThroughServer(serverRoute, formData);
			})
			.catch((err) => {
				toast.error("Trouble loggin in through google");
				return console.log(err);
			});
	};

	useEffect(() => {
		window.addEventListener("scroll", resizeNavbar);
		window.addEventListener("scroll", showOrHideNavbarMobile);

		if (movies.length === 0) fetchMovies();

		// Check for specific state change and invoke related function
		if (
			prevSearchModalVisibleRef.current !== undefined &&
			prevSearchModalVisibleRef.current !== searchModalVisible
		) {
			handleSearchModal();
		}
		if (
			prevShowMobileMenuRef.current !== undefined &&
			prevShowMobileMenuRef.current !== showMobileMenu
		) {
			handleMobileMenu();
		}
		if (
			prevLoginModalVisibleRef.current !== undefined &&
			prevLoginModalVisibleRef.current !== loginModalVisible
		) {
			handleLoginModal();
		}
		prevSearchModalVisibleRef.current = searchModalVisible;
		prevShowMobileMenuRef.current = showMobileMenu;
		prevLoginModalVisibleRef.current = loginModalVisible;

		if (modalInputValue) {
			const found = setFoundMedias(
				allMedias.filter((media) => {
					const found = media.title
						? media.title.toLowerCase().includes(modalInputValue)
						: media.personal_info.name.toLowerCase().includes(modalInputValue);
					return found;
				}),
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
		loginModalVisible,
	]);

	return (
		<>
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
								? "gap-x-5"
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
									? "w-[40px] cursor-pointer group"
									: "grow max-lg:grow-0")
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
								onClick={handleMediaFetch}
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
						{access_token ? null : (
							<button
								className={
									"py-2 px-7 flex justify-center items-center gap-x-3 rounded bg-white text-black font-medium max-lg:hidden " +
									(navbarSize === "small" ? "" : "self-stretch")
								}
								onClick={handleGoogleAuth}
							>
								<FaGoogle className="text-yellow-400 text-lg" />
								Sign in through google
							</button>
						)}
						{/* Sign in button */}
						{access_token ? (
							<div className="relative flex items-center gap-x-3 max-h-[40px]">
								<Link
									to={`/user/${username}`}
									className="rounded-full border border-gray-400 p-[1px] cursor-pointer"
								>
									<img
										src={profile_img}
										alt="user image"
										className="h-[40px] w-[40px] object-cover rounded-full"
									/>
								</Link>
								<Link
									to={`/user/${username}`}
									className="hidden lg:block capitalize cursor-pointer"
								>
									{firstName} {surname}
								</Link>
								<div
									className="hidden lg:block p-2 rounded-sm hover:bg-gray-400/25 cursor-pointer"
									onClick={handleUserPanel}
									onBlur={handleUserPanelBlur}
									tabIndex={0}
								>
									<IoChevronDown
										className={
											"duration-300 origin-center " +
											(showProfilePanel ? "rotate-180" : "")
										}
									/>
								</div>
								{showProfilePanel ? (
									<div className="absolute top-0 right-0 translate-y-[50%] translate-x-[35%] lg:translate-x-[0] -mt-3 bg-gray-100 text-gray-600 w-36 lg:w-80 flex flex-col [box-shadow:_1px_1px_6px_rgb(0_0_0_/_100%)]">
										<Link
											to={`/user/${username}`}
											className="flex items-center gap-x-2 p-3 hover:bg-gray-200 duration-300"
										>
											<CiUser className="text-2xl" />
											<p className="font-bold">Profile</p>
										</Link>
										<Link
											to="/settings"
											className="flex items-center gap-x-2 p-3 hover:bg-gray-200 duration-300"
										>
											<HiOutlineCog6Tooth className="text-2xl" />
											<p className="font-bold">Settings</p>
										</Link>
										<div
											className="flex items-center gap-x-2 p-3 hover:bg-gray-200 duration-300 cursor-pointer"
											onClick={signOutUser}
										>
											<IoMdExit className="text-2xl" />
											<p className="font-bold">Log out</p>
										</div>
									</div>
								) : null}
							</div>
						) : (
							<button
								className={
									"flex justify-center items-center gap-x-2 h-full lg:hover:text-yellow-400 duration-200 max-lg:flex-col " +
									(navbarSize === "small" ? "flex-col" : "")
								}
								onClick={() => setLoginModalVisible((prevVal) => !prevVal)}
							>
								<CiUser
									className={
										mobileView || tabletView
											? "text-2xl max-lg:text-2xl"
											: navbarSize === "small"
												? "text-xl"
												: "text-2xl max-lg:text-2xl"
									}
								/>
								<p
									className={
										navbarSize === "small" ? "text-xs" : "max-lg:text-xs"
									}
								>
									Sign in
								</p>
							</button>
						)}

						{/* Mobile menu button */}
						<button
							className="flex justify-center items-center gap-x-2 h-full max-lg:flex-col lg:hidden"
							onClick={() => setShowMobileMenu((prevVal) => !prevVal)}
						>
							<RxHamburgerMenu
								className={
									mobileView || tabletView
										? "text-2xl max-lg:text-2xl"
										: navbarSize === "small"
											? "text-xl"
											: "text-2xl max-lg:text-2xl"
								}
							/>
							<p
								className={
									navbarSize === "small" ? "text-xs" : "max-lg:text-xs"
								}
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
								if (item.adminOnly) {
									if (admin) {
										return (
											<li
												key={itemIndex}
												className="relative float-left group hover:text-yellow-500 duration-200 hover:before:content-[''] hover:before:absolute hover:before:bottom-0 hover:before:left-0 hover:before:bg-yellow-500 hover:before:w-full hover:before:h-[4px]"
											>
												<Link
													to={item.path}
													className={
														"relative flex items-center gap-x-1 " +
														(navbarSize === "small"
															? "text-xs py-5 px-2"
															: "py-3 px-5")
													}
												>
													{item.title}
													{item.submenu && (
														<IoChevronDown className="mt-1 origin-center group-hover:rotate-180 duration-300" />
													)}
												</Link>
												{item.submenu ? (
													<ul className="absolute left-0 list-none group-hover:block hidden z-10">
														{item.submenu.map((submenu, submenuIndex) => (
															<li
																key={submenuIndex}
																className="bg-neutral-200 text-black text-nowrap first:pt-3 last:pb-3"
															>
																<Link
																	to={submenu.path}
																	className="block py-2 px-7 font-bold hover:text-yellow-500"
																>
																	{submenu.title}
																</Link>
															</li>
														))}
													</ul>
												) : null}
											</li>
										);
									} else {
										return null;
									}
								} else {
									return (
										<li
											key={itemIndex}
											className="relative float-left group hover:text-yellow-500 duration-200 hover:before:content-[''] hover:before:absolute hover:before:bottom-0 hover:before:left-0 hover:before:bg-yellow-500 hover:before:w-full hover:before:h-[4px]"
										>
											<Link
												to={item.path}
												className={
													"group relative flex items-center gap-x-1 " +
													(navbarSize === "small"
														? "text-xs py-5 px-2"
														: "py-3 px-5")
												}
											>
												{item.title}
												{item.submenu && (
													<IoChevronDown className="group-hover:rotate-180 origin-center duration-300 mt-1" />
												)}
											</Link>
											{item.submenu ? (
												<ul className="absolute left-0 list-none group-hover:block hidden z-10">
													{item.submenu.map((submenu, submenuIndex) => {
														const category =
															submenu.category && submenu.category;
														const subCategory =
															submenu.subCategory && submenu.subCategory;

														const dataToPass = { category, subCategory };

														return (
															<li
																key={submenuIndex}
																className="bg-neutral-200 text-black text-nowrap first:pt-3 last:pb-3"
															>
																<Link
																	to={submenu.path}
																	state={dataToPass}
																	className="block py-2 px-7 font-bold hover:text-yellow-500"
																>
																	{submenu.title}
																</Link>
															</li>
														);
													})}
												</ul>
											) : null}
										</li>
									);
								}
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
										{foundMedias.slice(0, 6).map((media, i) => {
											const mediaType =
												(media.itemType !== "person" && media.itemType) ? `${media.itemType.slice(0, -1)}` : "person";
											const mediaLink = media.title
												? media.titleId
												: media.personal_info.nameId;
											const mediaTitle = media.title
												? media.title
												: media.personal_info.name;
											const mediaImg = media.title ? media.cover : media.banner;
											const mediaYear = media.releaseDate
												? getFullYear(media.releaseDate)
												: media.firstAirDate
													? getFullYear(media.firstAirDate)
													: null;
											return (
												<SearchPoster
													key={i}
													media={mediaType}
													link={mediaLink}
													title={mediaTitle}
													img={mediaImg}
													year={mediaYear}
													type="searchResult"
													setSearchModalVisible={setSearchModalVisible}
												/>
											);
										})}
									</div>
									{foundMedias.length !== 0 ? (
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
												to="/movies"
												className="text-xs text-yellow-700 hover:text-yellow-400 duration-500"
												onClick={() => setSearchModalVisible(false)}
											>
												See all
											</Link>
										</div>
										<div className="flex gap-x-5">
											{/* SLIDES */}
											{movies.slice(0, 3).map((movie, i) => (
												<SearchPoster
													key={i}
													media="movie"
													title={movie.title}
													link={movie.titleId}
													img={movie.cover}
													type="poster"
													setSearchModalVisible={setSearchModalVisible}
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
												to="/series"
												className="text-xs text-yellow-700 hover:text-yellow-400 duration-500"
												onClick={() => setSearchModalVisible(false)}
											>
												See all
											</Link>
										</div>
										<div className="grid grid-rows-1 grid-cols-3 gap-x-5">
											{/* SLIDES */}
											{series.slice(0, 3).map((movie, i) => (
												<SearchPoster
													key={i}
													media="serie"
													title={movie.title}
													link={movie.titleId}
													img={movie.cover}
													type="poster"
													setSearchModalVisible={setSearchModalVisible}
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
							<div
								className={
									"flex items-center justify-between " +
									(access_token ? "pb-2 border-b border-gray-400" : "")
								}
							>
								{access_token ? (
									<div className="flex items-center gap-x-2">
										<Link
											to={`/user/${username}`}
											className="rounded-full border border-gray-400 p-[1px] cursor-pointer"
										>
											<img
												src={profile_img}
												alt="user image"
												className="h-[40px] w-[40px] object-cover rounded-full"
											/>
										</Link>
										<Link
											to={`/user/${username}`}
											className="capitalize cursor-pointer text-white text-xl"
										>
											{firstName} {surname}
										</Link>
									</div>
								) : (
									<Link to="/" className="h-[32px]">
										<img
											src={filmwebLogo}
											alt="website logo"
											className="h-full w-full object-cover block mx-auto select-none"
										/>
									</Link>
								)}

								<button className="" onClick={handleMobileMenu}>
									<IoMdClose
										className="text-white text-4xl"
										onClick={() => setShowMobileMenu((prevVal) => !prevVal)}
									/>
								</button>
							</div>
							{!access_token && (
								<div className="flex flex-col gap-y-2">
									<button
										className="h-[36px] py-2 px-7 flex justify-center items-center gap-x-2 rounded bg-white text-gray-600 font-bold text-sm"
										onClick={handleGoogleAuth}
									>
										<FaGoogle className="text-yellow-400 text-lg" />
										Sign in through google
									</button>
									<button
										className="h-[36px] py-2 px-7 flex justify-center items-center gap-x-2 rounded bg-transparent text-white text-sm border border-gray-200"
										onClick={() => setLoginModalVisible((prevVal) => !prevVal)}
									>
										<CiUser className="text-xl" />
										Sign in
									</button>
								</div>
							)}
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
											{item.submenu && (
												<IoChevronDown className="text-gray-400 text-xl duration-300 origin-center" />
											)}
										</Link>
										{item.submenu && (
											<ul className="w-full list-none block transition-all duration-500 max-h-0 invisible sliding relative after:content-[''] after:w-[4px] after:h-full after:absolute after:left-0 after:top-0 after:bg-yellow-400 ">
												{item.submenu.map((submenu, submenuIndex) => (
													<li
														key={submenuIndex}
														className="bg-neutral-200 text-black text-nowrap first:pt-3 last:pb-3"
													>
														<Link
															to={submenu.path}
															className="block py-3 px-7 font-medium hover:text-yellow-500"
															onClick={() =>
																setShowMobileMenu((prevVal) => !prevVal)
															}
														>
															{submenu.title}
														</Link>
													</li>
												))}
											</ul>
										)}
									</li>
								);
							})}
						</ul>

						{access_token ? (
							<div className="flex flex-col text-gray-600 border-t border-gray-400/25 pt-1">
								<Link
									to="/settings"
									onClick={() => setShowMobileMenu((prevVal) => !prevVal)}
									className="flex items-center gap-x-2 p-3 hover:bg-gray-200 duration-300"
								>
									<HiOutlineCog6Tooth className="text-2xl" />
									<p>Settings</p>
								</Link>
								<div
									to="/"
									className="flex items-center gap-x-2 p-3 hover:bg-gray-200 duration-300 cursor-pointer"
									onClick={signOutUser}
								>
									<IoMdExit className="text-2xl" />
									<p>Log out</p>
								</div>
							</div>
						) : null}
					</div>
				) : null}

				<div
					className={
						"inset-0 bg-black z-30 " +
						(loginModalVisible
							? "fixed bg-opacity-50 backdrop-blur-sm "
							: "invisible bg-opacity-0")
					}
				></div>

				{loginModalVisible && (
					<LoginModal setLoginModalVisible={setLoginModalVisible} />
				)}
				<Outlet />
			</div>
			<Toaster />
		</>
	);
};

export default Navbar;
