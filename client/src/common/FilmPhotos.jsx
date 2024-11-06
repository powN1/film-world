import lightGallery from "lightgallery";
import LightGallery from "lightgallery/react";
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

const FilmPhotos = ({ photos }) => {
	return (
		<div className="w-full bg-white">
			<div className="mx-auto lg:w-[55%]">
				<div className="flex w-2/3 pt-8">
					{/* <div id="lightgallery"> */}
					{/* 	{photos.map((photo, index) => ( */}
					{/* 		<a */}
					{/* 			key={index} */}
					{/* 			data-lg-size="1600-2400" */}
					{/* 		> */}
					{/* 			<img */}
					{/* 				className="gallery-image" */}
					{/* 				src={photo} */}
					{/* 				alt="media photo" */}
					{/* 			/> */}
					{/* 		</a> */}
					{/* 	))} */}
					{/* </div> */}
					<LightGallery
						speed={500}
						plugins={[lgThumbnail, lgZoom]}
					>
						<a href="">
							<img alt="img1" src={photos[0]} />
						</a>
						<a href="">
							<img alt="img2" src={photos[1]} />
						</a>
					</LightGallery>
				</div>
			</div>
		</div>
	);
};

export default FilmPhotos;
