import Download from "../components/Download";
import Footer from "../components/Footer";
import RankingFilter from "../components/RankingFilter";
import RankingResults from "../components/RankingResults";

const RankingPage = () => {
	return (
		<>
      <RankingFilter />
      <RankingResults />
			<Download />
			<Footer />
		</>
	);
};

export default RankingPage;
