import lightGallery from "lightgallery";
import lgZoom from "lightgallery/plugins/zoom";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import { useEffect } from "react";

const FilmPhotos = ({ media }) => {

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

	return (
		<div className="w-full bg-white">
			<div className="mx-auto lg:w-[55%]">
				<div className="flex flex-col gap-y-4 w-2/3 pt-8">
          <h3 className="text-lg font-bold">Photos of {media.title}</h3>

					<div id="lightgallery" className="grid grid-cols-4">
						{media.photos.map((photo, i) => (
							<a key={i} href={photo} className={"border border-white " + (i === 0 ? "col-start-1 col-end-3 row-start-1 row-end-3 aspect-video" : i === 5 ? "row-start-2 row-end-4 col-span-2 aspect-video" :  "aspect-square" )}>
								<img className="w-full h-full object-cover" src={photo} alt={`${media.title} photo`}/>
							</a>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilmPhotos;
