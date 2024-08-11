import { Link } from "react-router-dom";
import deadpool from "../imgs/deadpool.jpg";
import mcu from "../imgs/mcu.jpg";
import rdj from "../imgs/rdj.jpg";
import giancarlo from "../imgs/giancarlo.jpg";
import reaper from "../imgs/reaper.jpg";
import SingleNews from "../common/SingleNews";

const MainNews = () => {
	const movies = [
		{ title: "I am legend 2 - new director blablalbalablablbal", img: rdj, comments: 14 },
		{
			title: "Netflix presents most interesting premieres of august 2024",
			img: deadpool,
			comments: 4,
		},
		{
			title: `Gangster quarrel and family issues. Penguin trailer`,
			img: mcu,
			comments: 56,
		},
		{
			title: `10 Poles that succeeded in movie industry`,
			img: mcu,
			comments: 21,
		},
		{
			title: `Henry Cavill and Tom Cruise together again! In a movie about world war II`,
			img: giancarlo,
			comments: 85,
		},
		{
			title: `Captain America 4. Giancarlo Esposito reveals who he's going to play`,
			img: reaper,
			comments: 42,
		},
		{
			title: `Captain America 4. Giancarlo Esposito reveals who he's going to play`,
			img: reaper,
			comments: 42,
		},
		{
			title: `Captain America 4. Giancarlo Esposito reveals who he's going to play`,
			img: reaper,
			comments: 42,
		},
		{
			title: `Captain America 4. Giancarlo Esposito reveals who he's going to play`,
			img: reaper,
			comments: 42,
		},
	];

	return (
		<div className="grid grid-rows-[80px_80px_80px_80px_80px_80px] grid-cols-[3fr_3fr_4fr] max-lg:grid-rows-[70px_70px_70px_70px_70px_70px_70px_70px_70px_70px_70px] max-lg:grid-cols-[1fr_1fr] gap-7 max-lg:gap-5 p-4">
			{movies.map((movie, i) => {
				let gridarea = {};
				if (i === 0) {
					gridarea["row-start"] = "row-start-1";
					gridarea["row-span"] = "row-span-4";
					gridarea["col-start"] = "col-start-1";
					gridarea["col-span"] = "col-span-2";
				} else if (i === 1) {
					gridarea["row-start"] = "row-start-5";
					gridarea["row-span"] = "row-span-2";
					gridarea["col-start"] = "col-start-1";
					gridarea["col-span"] = "col-span-1";
				} else if (i === 2) {
					gridarea["row-start"] = "row-start-5";
					gridarea["row-span"] = "row-span-2";
					gridarea["col-start"] = "col-start-2";
					gridarea["col-span"] = "col-span-1";
				} 

				return (
					<SingleNews
						key={i}
						title={movie.title}
						comments={movie.comments}
						img={movie.img}
						type={
							i === 0 ? "gigantic" : i === 1 || i === 2 ? "big" :  "small"
						}
						gridarea={i <= 2 ? gridarea : null }
					/>
				);
			})}
		</div>
	);
};

export default MainNews;
