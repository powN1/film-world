import MainNews from "../components/MainNews";
import LatestNews from "../components/LatestNews";
import WideSlider from "../components/WideSlider";
import Reviews from "../components/Reviews";

const HomePage = () => {
	return (
		<>
			<section className="bg-black w-[55vw] mx-auto">
				<MainNews />
				<LatestNews />
			</section>
			<WideSlider theme="dark" type="movie"/>
			<section className="w-[55vw] mx-auto">
        <Reviews />
      </section>
			<WideSlider theme="light" type="trailer"/>
		</>
	);
};

export default HomePage;
