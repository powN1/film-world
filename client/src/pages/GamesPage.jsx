import Ranking from "../components/Ranking";
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
			<Ranking type="games" anticipated={true} showCategories={false} />
			<NewestReviews />
			<Ranking type="games" showCategories={false} />
			<News type="games" />
			<Download />
			<Footer />
		</>
	);
};

export default GamesPage;
