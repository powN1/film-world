const SingleNews = ({ title, comments, img, type }) => {
	const renderArticle = () => {
		switch (type) {
			case "tiny":
				return <article></article>;
			case "small":
				return <article></article>;
			case "medium":
				return (
					<article className="flex flex-col gap-y-1 group overflow-hidden cursor-pointer">
						<div className="h-[65%] overflow-hidden border border-gray-300">
							<img
								src={img}
								alt={title}
								className="h-full w-full object-cover group-hover:scale-110 duration-700"
							/>
						</div>
						<div className="flex flex-col">
							<p className="text-sm py-1 group-hover:text-yellow-400 duration-300 text-ellipsis overflow-hidden line-clamp-2">
								{title}
							</p>
							<span className="text-gray-400 text-xs">{comments} comments</span>
						</div>
					</article>
				);
			case "big":
				return <article></article>;
			case "large":
				return <article></article>;
			case "gigantic":
				return (
					<article className="relative group overflow-hidden cursor-pointer">
						<img
							src={img}
							alt={title}
							className="object-cover h-full w-full group-hover:scale-110 duration-700"
						/>
						<div className="absolute bottom-3 left-0 flex flex-col p-3">
							<p className="text-3xl text-white group-hover:text-yellow-400 duration-300 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
								{title}
							</p>
							<span className="text-gray-400">{comments} comments</span>
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
