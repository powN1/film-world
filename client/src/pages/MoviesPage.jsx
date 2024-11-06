import Birthday from "../components/Birthday";
import Download from "../components/Download";
import Footer from "../components/Footer";
import MainPreviewWithSlides from "../components/MainPreviewWithSlides";
import MostPopular from "../components/MostPopular";
import News from "../components/News";
import Ranking from "../components/Ranking";
import WideTrailerSlider from "../components/WideTrailerSlider";

const MoviesPage = () => {
	return (
		<>
			<MainPreviewWithSlides type="movies"/>
			<WideTrailerSlider type="movies" showCategories={false} />
			<Ranking type="movies" anticipated={true} showCategories={false} />
			<MostPopular type="roles" category="movies" />
			<Birthday />
			<MostPopular type="characters" />
      <News type="movies" />
			<Download />
			<Footer />
		</>
	);
};

export default MoviesPage;
