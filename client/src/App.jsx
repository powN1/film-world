import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Navbar />} />
		</Routes>
	);
}

export default App;
