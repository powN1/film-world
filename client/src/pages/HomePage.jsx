import MainNews from "../components/MainNews";
import LatestNews from "../components/LatestNews";
import WideMovieSlider from "../components/WideMovieSlider";
import Reviews from "../components/Reviews";
import WideTrailerSlider from "../components/WideTrailerSlider";
import Ranking from "../components/Ranking";
import Games from "../components/Games";
import Download from "../components/Download";
import Footer from "../components/Footer";

const HomePage = () => {
	return (
		<>
			<MainNews />
			<LatestNews />
			<WideMovieSlider />
			<Reviews />
			<WideTrailerSlider />
			<Ranking />
			<Games />
			<Download />
			<Footer />
		</>
	);
};

export default HomePage;
