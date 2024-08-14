import Birthday from "../components/Birthday";
import Download from "../components/Download";
import Footer from "../components/Footer";
import MainPreview from "../components/MainPreview";
import MostPopular from "../components/MostPopular";
import News from "../components/News";
import Ranking from "../components/Ranking";
import WideTrailerSlider from "../components/WideTrailerSlider";

const MoviesPage = () => {
	return (
		<>
			<MainPreview />
			<WideTrailerSlider showCategories={false} />
			<Ranking anticipated={true} />
			<MostPopular type="roles" />
			<Birthday />
			<MostPopular type="characters" />
      <News />
			<Download />
			<Footer />
		</>
	);
};

export default MoviesPage;
