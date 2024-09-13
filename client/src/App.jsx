import "./App.css";
import { Route, Routes } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import SeriesPage from "./pages/SeriesPage";
import GamesPage from "./pages/GamesPage";
import RankingPage from "./pages/RankingPage";
import MyFilmwebPage from "./pages/MyFilmwebPage";
import { lookInSession } from "./common/session";
import axios from "axios";
import CreateArticlePage from "./pages/CreateArticlePage";
import Loader from "./components/Loader";

export const UserContext = createContext({});
export const MediaQueriesContext = createContext({});
export const DataContext = createContext({});

function App() {
	const [mobileView, setMobileView] = useState(false);
	const [tabletView, setTabletView] = useState(false);
	const [userAuth, setUserAuth] = useState({});

	const [movies, setMovies] = useState([]);
	const [series, setSeries] = useState([]);
	const [animes, setAnimes] = useState([]);
	const [articles, setArticles] = useState([]);
	const [actors, setActors] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);

	const checkDevice = () => {
		if (window.innerWidth < 768) {
			if (tabletView === true) {
				setTabletView(false);
			}
			if (mobileView === false) {
				setMobileView(true);
			}
		} else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
			if (mobileView === true) {
				setMobileView(false);
			}
			if (tabletView === false) {
				setTabletView(true);
			}
		} else if (window.innerWidth >= 1024) {
			if (mobileView === true) {
				setMobileView(false);
			}
			if (tabletView === true) {
				setTabletView(false);
			}
		}
	};

	const fetchMovies = async () => await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-movies");
	const fetchSeries = async () =>
		await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-animes");
	const fetchAnimes = async () =>
		await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-animes");
	const fetchArticles = async () =>
		await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-articles");
	const fetchReviews = async () =>
		await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-movies");
	const fetchActors = async () =>
		await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-actors");

	useEffect(() => {
		checkDevice();
		window.addEventListener("resize", checkDevice);

		return () => {
			window.removeEventListener("resize", checkDevice);
		};
	}, [mobileView, tabletView]);

	useEffect(() => {
		let userInSession = lookInSession("user");
		userInSession
			? setUserAuth(JSON.parse(userInSession))
			: setUserAuth({ access_token: null });

		// Use Promise.all to wait for all fetches to complete
		Promise.all([ fetchMovies(), fetchSeries(), fetchAnimes(), fetchArticles(), fetchReviews(), fetchActors(), ])
			.then(
				([
					moviesResponse,
					seriesResponse,
					animesResponse,
					articlesResponse,
					reviewsResponse,
					actorsResponse,
				]) => {
					setMovies(moviesResponse.data.movies);
					setSeries(seriesResponse.data.series);
					setAnimes(animesResponse.data.animes);
					setArticles(articlesResponse.data.articles);
					setReviews(reviewsResponse.data.movies);
					setActors(actorsResponse.data.actors);
					setLoading(false);
				},
			)
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	}, []);

	return loading ? (
		<Loader />
	) : (
		<MediaQueriesContext.Provider value={{ mobileView, tabletView }}>
			<UserContext.Provider value={{ userAuth, setUserAuth }}>
				<DataContext.Provider
					value={{ movies, series, animes, articles, reviews, actors, loading }}
				>
					<Routes>
						<Route path="/" element={<Navbar />}>
							<Route index element={<HomePage />} />
							<Route path="/movies" element={<MoviesPage />} />
							<Route path="/series" element={<SeriesPage />} />
							<Route path="/games" element={<GamesPage />} />
							<Route path="/ranking" element={<RankingPage />} />
							<Route path="/my" element={<MyFilmwebPage />} />
							<Route path="/create-article" element={<CreateArticlePage />} />
						</Route>
					</Routes>
				</DataContext.Provider>
			</UserContext.Provider>
		</MediaQueriesContext.Provider>
	);
}

export default App;
