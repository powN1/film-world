import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Navbar />}>
				<Route index element={<HomePage />} />
				<Route path="/news" element={<HomePage />} />
			</Route>
		</Routes>
	);
}

export default App;
