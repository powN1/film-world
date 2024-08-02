import MainNews from "../components/MainNews";
import LatestNews from "../components/LatestNews";
import WideSlider from "../components/WideSlider";

const HomePage = () => {
	return (
		<>
			<section className="bg-black w-[55vw] mx-auto">
				<MainNews />
				<LatestNews />
			</section>
			<WideSlider theme="light" />
		</>
	);
};

export default HomePage;
