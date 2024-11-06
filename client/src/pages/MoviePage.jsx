import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MediaQueriesContext } from "../App";
import Loader from "../components/Loader";
import { FaRegCirclePlay } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import MainPreviewSingle from "../components/MainPreviewSingle";
import FilmDetails from "../common/FilmDetails";
import FilmPhotos from "../common/FilmPhotos";

const MoviePage = () => {
	const { movieId } = useParams();

	const fetchMovie = async (movieId) => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/get-movie",
				{ titleId: movieId },
			);
			return response.data.movie;
		} catch (err) {
			console.error(err);
		}
	};

	const [movie, setMovie] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadMovie = async () => {
			const movieData = await fetchMovie(movieId);
			if (movieData) {
				const ratedCount = movieData.activity.ratedByCount;
				if (ratedCount >= 1000 && ratedCount < 1000000)
					movieData.activity.ratedByCount = (ratedCount / 1000).toFixed(0).replace(/\.0$/, "") + "k";
				else if (ratedCount >= 1000000)
					movieData.activity.ratedByCount = ratedCount = (ratedCount / 1000000).toFixed(0).replace(/\.0$/, "") + "m";
				setMovie(movieData);
			}
			setLoading(false); // Set loading to false after fetching
		};

		loadMovie();
	}, [movieId]);

	return loading ? (
		<Loader />
	) : (
		<>
			<MainPreviewSingle type="movie" media={movie} />
			<FilmDetails type="movie" media={movie} />
      <FilmPhotos photos={movie.photos}/>
		</>
	);
};

export default MoviePage;
