import Download from "../components/Download";
import Footer from "../components/Footer";
import MainPreview from "../components/MainPreview";
import MostPopular from "../components/MostPopular";
import Ranking from "../components/Ranking";
import WideTrailerSlider from "../components/WideTrailerSlider";

const MoviesPage = () => {
	return (
		<>
			<MainPreview />
			<WideTrailerSlider showCategories={false} />
      <Ranking anticipated={true}/>
      <MostPopular />
      <Download />
      <Footer />
		</>
	);
};

export default MoviesPage;
