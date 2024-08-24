import MainNews from "../components/MainNews";
import LatestNews from "../components/LatestNews";
import WideMovieSlider from "../components/WideMovieSlider";
import Reviews from "../components/Reviews";
import WideTrailerSlider from "../components/WideTrailerSlider";
import Ranking from "../components/Ranking";
import Games from "../components/Games";
import Download from "../components/Download";
import Footer from "../components/Footer";
import Loader from "../components/Loader.jsx";
import { useState, useEffect, createContext } from "react";
import axios from "axios";

export const DataContext = createContext({});

const HomePage = () => {
	const [movies, setMovies] = useState([]);
	const [articles, setArticles] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchMovies = () => axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-movies");
	const fetchArticles = () => axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-movies");
	const fetchReviews = () => axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-movies");

	useEffect(() => {
		// Use Promise.all to wait for all fetches to complete
		Promise.all([fetchMovies(), fetchArticles(), fetchReviews()])
			.then(([moviesResponse, articlesResponse, reviewsResponse]) => {
				setMovies(moviesResponse.data.movies);
				setArticles(articlesResponse.data.movies);
				setReviews(reviewsResponse.data.movies);
				setLoading(false); 
			})
			.catch((err) => {
				console.log(err);
				setLoading(false); 
			});
	}, []);

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<>
					<DataContext.Provider value={{ movies, articles, reviews}} >
						<MainNews />
						<LatestNews />
						<WideMovieSlider />
						<Reviews />
						<WideTrailerSlider />
						<Ranking />
						<Games />
					</DataContext.Provider>
					<Download />
					<Footer />
				</>
			)}
		</>
	);
};

export default HomePage;
