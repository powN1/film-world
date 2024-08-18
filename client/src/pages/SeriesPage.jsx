import MainPreview from "../components/MainPreview";
import Ranking from "../components/Ranking";
import WideTrailerSlider from "../components/WideTrailerSlider";
import Download from "../components/Download";
import Footer from "../components/Footer";
import MostPopular from "../components/MostPopular";
import News from "../components/News";

const SeriesPage = () => {
	return (
		<>
			<MainPreview />
			<Ranking anticipated={true} showCategories={false} />
			<WideTrailerSlider showCategories={false} />
			<MostPopular type="roles" />
      <News />
			<Download />
			<Footer />
		</>
	);
};

export default SeriesPage;
