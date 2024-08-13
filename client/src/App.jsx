import "./App.css";
import { Route, Routes } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";

export const MediaQueriesContext = createContext({});

function App() {
	const [mobileView, setMobileView] = useState(false);
	const [tabletView, setTabletView] = useState(false);

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
		checkDevice();
		window.addEventListener("resize", checkDevice);
	}, [mobileView, tabletView]);

	return (
		<MediaQueriesContext.Provider value={{ mobileView, tabletView }}>
			<Routes>
				<Route path="/" element={<Navbar />}>
					<Route index element={<HomePage />} />
					<Route path="/movies" element={<MoviesPage />} />
				</Route>
			</Routes>
		</MediaQueriesContext.Provider>
	);
}

export default App;
