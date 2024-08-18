import MainPreview from "../components/MainPreview";
import Ranking from "../components/Ranking";
import WideTrailerSlider from "../components/WideTrailerSlider";
import Download from "../components/Download";
import Footer from "../components/Footer";
import MostPopular from "../components/MostPopular";
import News from "../components/News";
import Games from "../components/Games";
import NewestReviews from "../components/NewestReviews";
import NarrowTrailers from "../components/NarrowTrailers";

const GamesPage = () => {
	return (
		<>
			<Games />
			<NarrowTrailers />
			<MostPopular type="games" />
			<Ranking anticipated={true} showCategories={false} />
			<NewestReviews />
			<Ranking showCategories={false} />
			<News />
			<Download />
			<Footer />
		</>
	);
};

export default GamesPage;
