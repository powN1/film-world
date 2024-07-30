import MainNews from "../components/MainNews";
import LatestNews from "../components/LatestNews";
import WideSlide from "../components/WideSlide";

const HomePage = () => {
	return (
		<section className="bg-black w-[55vw] mx-auto">
			<MainNews />
			<LatestNews />
			<WideSlide theme="light" />
		</section>
	);
};

export default HomePage;
