import { createContext, useState } from "react";
import Download from "../components/Download";
import Footer from "../components/Footer";
import RankingFilter from "../components/RankingFilter";
import RankingResults from "../components/RankingResults";

export const RankingContext = createContext({});

const RankingPage = () => {
	const [currentCategory, setCurrentCategory] = useState("movies");
	const [currentSubCategory, setCurrentSubCategory] = useState("top 500");

	return (
		<>
			<RankingContext.Provider value={{ currentCategory, setCurrentCategory, currentSubCategory, setCurrentSubCategory }}>
				<RankingFilter />
				<RankingResults />
				<Download />
				<Footer />
			</RankingContext.Provider>
		</>
	);
};

export default RankingPage;
