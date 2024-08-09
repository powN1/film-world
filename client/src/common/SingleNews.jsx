const SingleNews = ({ title, comments, img, type, gridarea = null }) => {
	console.log(gridarea);
	const gridClass = gridarea
		? `row-start-${gridarea["row-start"]} row-span-${gridarea["row-span"]} col-start-${gridarea["col-start"]} col-span-${gridarea["col-span"]}`
		: "";
	const renderArticle = () => {
		switch (type) {
			case "tiny":
				return (
					<article className="flex justify-between group overflow-hidden cursor-pointer">
						<p className="block w-[70%] text-sm group-hover:text-yellow-400 duration-300 text-ellipsis overflow-hidden line-clamp-2">
							{title}
						</p>
						<div className="h-[65px] w-[65px] overflow-hidden border border-gray-300">
							<img
								src={img}
								alt={title}
								className="h-full object-cover group-hover:scale-110 duration-700"
							/>
						</div>
					</article>
				);
			case "small":
				return (
					<article className="flex group overflow-hidden cursor-pointer max-lg:col-span-2 max-lg:row-span-1">
						<div className="w-[40%] overflow-hidden border border-gray-800">
							<img
								src={img}
								alt={title}
								className="object-cover w-full h-full group-hover:scale-110 duration-700"
							/>
						</div>
						<div className="flex flex-col px-2 py-1 justify-between w-[60%]">
							<p className="text-white text-sm line-clamp-2 text-ellipsis group-hover:text-yellow-400 duration-300 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
                {title}
							</p>
							<span className="text-xs text-gray-400">13 komentarzy</span>
						</div>
					</article>
				);
			case "medium":
				return (
					<article className="flex lg:flex-col gap-y-1 max-lg:gap-x-2 group overflow-hidden cursor-pointer">
						<div className="h-[65%] max-lg:h-full max-lg:w-[40%] overflow-hidden border border-gray-300">
							<img
								src={img}
								alt={title}
								className="h-full w-full object-cover group-hover:scale-110 duration-700"
							/>
						</div>
						<div className="flex flex-col max-lg:w-[60%]">
							<p className="text-sm py-1 group-hover:text-yellow-500 duration-300 text-ellipsis overflow-hidden line-clamp-2">
								{title}
							</p>
							<span className="text-gray-400 text-xs">{comments} comments</span>
						</div>
					</article>
				);
			case "big":
				return (
					<article
						className={
							"relative group overflow-hidden cursor-pointer max-lg:flex max-lg:flex-col max-lg:col-span-1 max-lg:row-span-2 " + gridClass
						}
					>
						<img
							src={img}
							alt={title}
							className="object-cover h-1/2 w-full group-hover:scale-110 duration-700"
						/>
						<div className="lg:absolute lg:bottom-2 lg:left-0 flex flex-col lg:p-3">
							<p className="text-white text-sm line-clamp-3 text-ellipsis py-1 group-hover:text-yellow-400 duration-300 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
								{title}
							</p>
							<span className="text-xs text-gray-400">{comments} comments</span>
						</div>
					</article>
				);
			case "large":
				return (
					<article
						className={
							"relative group overflow-hidden cursor-pointer max-lg:row-span-3 " + gridClass
						}
					>
						<img
							src={img}
							alt={title}
							className="object-cover h-full w-full group-hover:scale-110 duration-700"
						/>
						<div className="absolute bottom-3 max-lg:bottom-0 left-0 flex flex-col p-3">
							<p className="text-2xl max-lg:text-xl text-white group-hover:text-yellow-500 duration-300 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
								{title}
							</p>
							<span className="text-gray-400 max-lg:text-xs">{comments} comments</span>
						</div>
					</article>
				);
			case "gigantic":
				return (
					<article
						className={
							"relative group overflow-hidden cursor-pointer max-lg:row-span-3 max-lg:col-span-2 " + gridClass
						}
					>
						<img
							src={img}
							alt={title}
							className="object-cover h-full w-full group-hover:scale-110 duration-700"
						/>
						<div className="absolute bottom-3 max-lg:bottom-0 left-0 flex flex-col p-3">
							<p className="text-3xl max-lg:text-xl text-white line-clamp-2 text-ellipsis group-hover:text-yellow-400 duration-300 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
								{title}
							</p>
							<span className="text-gray-400 max-lg:text-sm">
								{comments} comments
							</span>
						</div>
					</article>
				);
			default:
				return <article></article>;
		}
	};

	return renderArticle();
};

export default SingleNews;
