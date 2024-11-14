import { useContext, useEffect, useState } from "react";
import SingleNews from "../common/SingleNews";
import { DataContext } from "../App";

const MainNews = () => {
	const { randomArticles } = useContext(DataContext);

	return (
		<div className="bg-white">
			<div
				className="lg:w-[55%] mx-auto bg-black grid grid-rows-[80px_80px_80px_80px_80px_80px] grid-cols-[3fr_3fr_4fr] max-md:grid-rows-[70px_70px_70px_70px_70px_70px_70px_70px_70px_70px_70px] max-md:grid-cols-[1fr_1fr] gap-7 max-md:gap-5 p-4"
			>
				{randomArticles.slice(0, 9).map((article, i) => {
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
              link={article.articleId}
							description={article.description}
							comments={article.activity.total_comments}
							img={article.banner}
							type={i === 0 ? "gigantic" : i === 1 || i === 2 ? "big" : "small"}
							gridarea={i <= 2 ? gridarea : null}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default MainNews;
