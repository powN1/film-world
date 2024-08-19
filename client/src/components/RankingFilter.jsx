import { useState } from "react";
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { IoFilter } from "react-icons/io5";

const categories = [
	"movies",
	"series",
	"animes",
	"movie roles",
	"serie roles",
	"anime roles",
	"actors",
	"games",
];

const subCategories = ["top 500", "new"];

const filters = [
	{
		title: "genre",
		elements: [
			"action",
			"adventure",
			"animation",
			"Adult animation",
			"anime",
			"biography",
			"comedy",
			"crime",
			"documentary",
			"drama",
			"family",
			"fantasy",
			"game show",
			"history",
			"horror",
			"lifestyle",
			"music",
			"musical",
			"mystery",
			"reality tv",
			"romance",
			"sci-fi",
			"seasonal",
			"sport",
			"thriller",
			"western",
		],
	},
	{
		title: "country",
		elements: [
			"Australia",
			"Austria",
			"Belgium",
			"Brazil",
			"Canada",
			"China",
			"Czech Republic",
			"Denmark",
			"Finland",
			"France",
			"Germany",
			"Hungary",
			"India",
			"Iran",
			"Italy",
			"Japan",
			"Mexico",
			"Netherlands",
			"Norway",
			"Poland",
			"Romania",
			"Russia",
			"South Korea",
			"Spain",
			"Sweden",
			"Switzerland",
			"Turkey",
			"United Kingdom",
			"United States",
		],
	},
	{ title: "years", elements: [] },
];

for (let year = new Date().getFullYear(); year >= 1839; year--) {
	filters[2].elements.push(`${year}`);
}

const RankingFilter = () => {
	const [currentCategory, setCurrentCategory] = useState("movies");
	const [currentSubCategory, setCurrentSubCategory] = useState("top 500");
	const [filterModalVisible, setFilterModalVisible] = useState(true);

	const [currentGenre, setCurrentGenre] = useState(null);
	const [currentCountry, setCurrentCountry] = useState(null);
	const [currentYear, setCurrentYear] = useState(null);

	const handleShowUnderline = (e) => {
		const category = e.target.innerText.toLowerCase();

		if (category !== currentCategory && categories.includes(category)) {
			setCurrentCategory(category);
		} else if (
			category !== currentSubCategory &&
			subCategories.includes(category)
		) {
			setCurrentSubCategory(category);
		}
	};

	const handleFilters = (e) => {
		const category = e.target.innerText.toLowerCase();

		if (filters[0].elements.map(element => element.toLowerCase()).includes(category)) {
			if (category !== currentGenre) {
				setCurrentGenre(category);
			}
		} else if (filters[1].elements.map(element => element.toLowerCase()).includes(category)) {
			if (category !== currentCountry) {
				setCurrentCountry(category);
			}
		} else if (filters[2].elements.map(element => element.toLowerCase()).includes(category)) {
			if (category !== currentYear) {
				setCurrentYear(category);
			}
		}
	};

	return (
		<div>
			<div className="w-full lg:w-[55%] mx-auto flex flex-col gap-y-2 py-10">
				<h2 className="uppercase text-4xl font-bold text-center tracking-tighter font-sansNarrow text-white">
					Ranking
				</h2>

				<ul
					className={
						"list-none flex overflow-x-auto relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:h-[1px] after:w-full after:-translate-y-[50%] after:bg-gray-300/50 text-white"
					}
				>
					{categories.map((category, i) => {
						return (
							<li key={i}>
								<Link
									path="/"
									className={
										"block px-5 py-3 relative text-[18px] duration-300 capitalize after:content-[''] after:z-10 after:absolute after:bottom-0 after:h-[3px] after:bg-yellow-400 after:duration-300 after:transition-[width_left] whitespace-nowrap " +
										(currentCategory === category.toLowerCase()
											? "after:w-[100%] after:left-0 "
											: "after:w-[0%] after:left-[50%] text-gray-400 hover:text-white")
									}
									onClick={handleShowUnderline}
								>
									{category}
								</Link>
							</li>
						);
					})}
				</ul>

				<div className="flex items-center gap-x-2 px-3 lg:px-0">
					{subCategories.map((subCategory, i) => {
						return (
							<Link
								key={i}
								path="/"
								className={
									"block px-3 py-2 rounded-sm capitalize relative duration-300 after:content-[''] after:z-10  " +
									(currentSubCategory === subCategory.toLowerCase()
										? "bg-yellow-400"
										: "text-white")
								}
								onClick={handleShowUnderline}
							>
								{subCategory}
							</Link>
						);
					})}
					<div
						className="flex items-center gap-x-2 ml-auto p-2 md:px-3 lg:py-1 lg:px-8 border border-gray-400/50 rounded-sm text-white cursor-pointer hover:border-gray-400 duration-300"
						onClick={() => setFilterModalVisible(true)}
					>
						<IoFilter />
						<p className="hidden md:block">Filters</p>
					</div>
				</div>
			</div>

			{filterModalVisible ? (
				<div className="w-screen h-screen flex flex-col fixed top-0 left-0 bg-white z-30">
					<div className="relative flex justify-center items-center text-black py-3 border-b border-gray-400/50">
						<h2 className="text-2xl font-sansNarrow uppercase">Filters</h2>
						<IoMdClose
							className="absolute top-0 right-2 translate-y-[50%] text-3xl cursor-pointer"
							onClick={() => setFilterModalVisible((prevVal) => !prevVal)}
						/>
					</div>
					{filters.map((filter, i) => (
						<div className="flex flex-col gap-y-2 px-4 py-2" key={i}>
							<p className="capitalize">{filter.title}</p>
							<div className="flex overflow-x-scroll gap-x-2">
								{filter.elements.map((element, i) => (
									<button
										className={ "py-1 px-3 text-gray-600 whitespace-nowrap capitalize duration-300 " + 

										((currentGenre === element.toLowerCase()) || (currentCountry === element.toLowerCase()) || (currentYear === element.toLowerCase())
											? "bg-yellow-400"
											: "bg-gray-400/20 hover:bg-gray-400/40")
                    }
										key={i}
										onClick={handleFilters}
									>
										{element}
									</button>
								))}
							</div>
							<p className="self-start py-1 pr-3 text-gray-400 font-bold cursor-pointer text-sm hover:text-black duration-300">
								Show all...
							</p>
							<span className="w-full h-[1px] border-b border-gray-400/50"></span>
						</div>
					))}
				</div>
			) : null}
		</div>
	);
};

export default RankingFilter;
