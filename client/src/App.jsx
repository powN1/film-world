import "./App.css";
import { Route, Routes } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";

export const MediaQueriesContext = createContext({});

function App() {
	const [mobileView, setMobileView] = useState(false);

	useEffect(() => {
		window.addEventListener("resize", () => {
			if (window.innerWidth <= 768) {
				if (mobileView === false) {
					setMobileView(true);
				}
			} else {
				if (mobileView === true) {
					setMobileView(false);
				}
			}
			return () => {
				window.removeEventListener("resize", () => {});
			};
		});
	}, []);
	return (
		<MediaQueriesContext.Provider value={{ mobileView }}>
			<Routes>
				<Route path="/" element={<Navbar />}>
					<Route index element={<HomePage />} />
					<Route path="/news" element={<HomePage />} />
				</Route>
			</Routes>
		</MediaQueriesContext.Provider>
	);
}

export default App;
