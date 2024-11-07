import lightGallery from "lightgallery";
import lgZoom from "lightgallery/plugins/zoom";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import { useContext, useEffect } from "react";
import { MediaQueriesContext } from "../App";

const FilmPhotos = ({ media }) => {
	const { mobileView } = useContext(MediaQueriesContext);
	useEffect(() => {
		// Initialize the gallery once the component is mounted
		const gallery = lightGallery(document.getElementById("lightgallery"), {
			plugins: [lgZoom], // Optional: Add zoom functionality
			speed: 500, // Speed of the gallery transition
		});

		// Cleanup the gallery when the component is unmounted
		return () => {
			gallery.destroy();
		};
	}, []);

	return media.photos && media.photos.length > 0 ? (
		<div className="w-full bg-white">
			<div className="mx-auto lg:w-[55%]">
				<div className="flex flex-col gap-y-4 lg:w-2/3 pb-4 md:pb-8 px-4 sm:px-12 lg:px-0">
					<h3 className="text-lg font-bold">Photos of {media.title}</h3>

					{/* Photo gallery */}
					<div id="lightgallery" className="flex overflow-x-scroll md:overflow-x-hidden md:grid md:grid-cols-4">
						{media.photos.map((photo, i) => {
							if (mobileView) {
								return (
									<a
										key={i}
										href={photo}
										className= "min-h-[170px] h-[170px] border border-white aspect-square"
									>
										<img
											className="w-full h-full object-cover"
											src={photo}
											alt={`${media.title}`}
										/>
									</a>
								);
							} else {
								return (
									<a
										key={i}
										href={photo}
										className={
											i < 6 // Display first 6 images with specific styling
												? "border border-white " +
													(i === 0 && media.photos.length > 5
														? "col-start-1 col-end-3 row-start-1 row-end-3 aspect-video"
														: i === 5 && media.photos.length > 5
															? "row-start-2 row-end-4 col-span-2 aspect-video"
															: "aspect-square")
												: "hidden" // Hide remaining images in the grid
										}
									>
										<img
											className="w-full h-full object-cover"
											src={photo}
											alt={`${media.title}`}
										/>
									</a>
								);
							}
						})}
					</div>
				</div>
			</div>
		</div>
	) : null;
};

export default FilmPhotos;
