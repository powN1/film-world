import "./App.css";
import { Route, Routes } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import SeriesPage from "./pages/SeriesPage";
import GamesPage from "./pages/GamesPage";
import RankingPage from "./pages/RankingPage";
import MyMoviesPage from "./components/MyMoviesPage";
import { lookInSession } from "./common/session";

export const UserContext = createContext({});
export const MediaQueriesContext = createContext({});

function App() {
	const [mobileView, setMobileView] = useState(false);
	const [tabletView, setTabletView] = useState(false);
	const [userAuth, setUserAuth] = useState({});

	const checkDevice = () => {
		if (window.innerWidth < 768) {
			if (tabletView === true) {
				setTabletView(false);
			}
			if (mobileView === false) {
				setMobileView(true);
			}
		} else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
			if (mobileView === true) {
				setMobileView(false);
			}
			if (tabletView === false) {
				setTabletView(true);
			}
		} else if (window.innerWidth >= 1024) {
			if (mobileView === true) {
				setMobileView(false);
			}
			if (tabletView === true) {
				setTabletView(false);
			}
		}
	};

	useEffect(() => {
    if(Object.keys(userAuth).length === 0) {
      let userInSession = lookInSession("user");
      userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null });
    }

		checkDevice();
		window.addEventListener("resize", checkDevice);
	}, [mobileView, tabletView]);

	return (
		<MediaQueriesContext.Provider value={{ mobileView, tabletView }}>
			<UserContext.Provider value={{ userAuth, setUserAuth }}>
				<Routes>
					<Route path="/" element={<Navbar />}>
						<Route index element={<HomePage />} />
						<Route path="/movies" element={<MoviesPage />} />
						<Route path="/series" element={<SeriesPage />} />
						<Route path="/games" element={<GamesPage />} />
						<Route path="/ranking" element={<RankingPage />} />
						<Route path="/my" element={<MyMoviesPage />} />
					</Route>
				</Routes>
			</UserContext.Provider>
		</MediaQueriesContext.Provider>
	);
}

export default App;
