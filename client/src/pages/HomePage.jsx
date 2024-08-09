import MainNews from "../components/MainNews";
import LatestNews from "../components/LatestNews";
import WideMovieSlider from "../components/WideMovieSlider";
import Reviews from "../components/Reviews";
import WideReviewSlider from "../components/WideReviewSlider";
import Ranking from "../components/Ranking";
import Games from "../components/Games";
import Download from "../components/Download";
import Footer from "../components/Footer";

const HomePage = () => {
	return (
		<>
			<section className="bg-black lg:w-[55vw] mx-auto">
				<MainNews />
				<LatestNews />
			</section>
			<WideMovieSlider />
			<section className="lg:w-[55vw] mx-auto">
				<Reviews />
			</section>
			<WideReviewSlider />
			<section className="lg:w-[55vw] mx-auto">
				<Ranking />
				<Games />
				<Download />
			</section>
			<Footer />
		</>
	);
};

export default HomePage;
