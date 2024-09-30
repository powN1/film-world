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
			<MainPreview type="series"/>
			<Ranking type="series" showCategories={false} />
			<WideTrailerSlider type="series" showCategories={false} />
			<MostPopular type="roles" category="series" />
      <News type="series" />
			<Download />
			<Footer />
		</>
	);
};

export default SeriesPage;
