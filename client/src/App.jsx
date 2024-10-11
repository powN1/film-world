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
import WriteArticlePage from "./pages/WriteArticlePage";
import WriteReviewPage from "./pages/WriteReviewPage";
import Loader from "./components/Loader";
import WritePage from "./pages/WritePage";

export const UserContext = createContext({});
export const MediaQueriesContext = createContext({});
export const DataContext = createContext({});

function App() {
	const [mobileView, setMobileView] = useState(false);
	const [tabletView, setTabletView] = useState(false);
	const [userAuth, setUserAuth] = useState({});

	const [popularMovies, setPopularMovies] = useState([]);
	const [topRatedMovies, setTopRatedMovies] = useState([]);
	const [anticipatedMovies, setAnticipatedMovies] = useState([]);
	const [upcomingMovies, setUpcomingMovies] = useState([]);

	const [popularSeries, setPopularSeries] = useState([]);
	const [topRatedSeries, setTopRatedSeries] = useState([]);
	const [upcomingSeries, setUpcomingSeries] = useState([]);
	const [latestSeries, setLatestSeries] = useState([]);

	const [animes, setAnimes] = useState([]);
	const [popularAnimes, setPopularAnimes] = useState([]);
	const [topRatedAnimes, setTopRatedAnimes] = useState([]);
	const [upcomingAnimes, setUpcomingAnimes] = useState([]);

	const [randomGames, setRandomGames] = useState([]);
	const [latestGames, setLatestGames] = useState([]);
	const [topRatedGames, setTopRatedGames] = useState([]);
	const [anticipatedGames, setAnticipatedGames] = useState([]);

	const [moviesRoles, setMoviesRoles] = useState([]);
	const [seriesRoles, setSeriesRoles] = useState([]);

	const [randomArticles, setRandomArticles] = useState([]);
	const [latestArticles, setLatestArticles] = useState([]);
	const [latestMovieArticles, setLatestMovieArticles] = useState([]);
	const [latestSeriesArticles, setLatestSeriesArticles] = useState([]);
	const [latestGamesArticles, setLatestGamesArticles] = useState([]);

	const [randomReviews, setRandomReviews] = useState([]);
	const [latestReviews, setLatestReviews] = useState([]);
	const [latestMovieReviews, setLatestMovieReviews] = useState([]);
	const [latestSeriesReviews, setLatestSeriesReviews] = useState([]);
	const [latestGamesReviews, setLatestGamesReviews] = useState([]);

	const [actors, setActors] = useState([]);
	const [characters, setCharacters] = useState([]);

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

	// NOTE: Random articles
	// NOTE: Latest articles
	// NOTE: Most popular articles
	// NOTE: Most popular movies, series, games
	// NOTE: Latest reviews
	// NOTE: Upcoming movies, series, games
	// NOTE: Top rated movies, series and upcoming
	// NOTE: Latest game articles

	const fetchMovies = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-movies");
	const fetchPopularMovies = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-movies", { type: "popular", count: 20 });
	const fetchTopRatedMovies = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-movies-top-rated", { count: 10 });
	const fetchAnticipatedMovies = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-movies-most-anticipated", { count: 10 });
	const fetchUpcomingMovies = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-movies-upcoming", { count: 10 });

	// const fetchPopularSeries = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-series-popular", { count: 20 });
	const fetchTopRatedSeries = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-series-top-rated", { count: 10 });
	// const fetchUpcomingSeries = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-series-upcoming", { count: 10 });
	const fetchLatestSeries = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-series-latest", { sortByRating: true, count: 10 });

	const fetchAnimes = async () => await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-animes");
	const fetchPopularAnimes = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-movies");
	const fetchTopRatedAnimes = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-movies");
	const fetchUpcomingAnimes = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-movies");

	const fetchRandomGames = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-games-random", { count: 20 });
	const fetchLatestGames = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-games-latest", { count: 20 });
	const fetchTopRatedGames = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-games-top-rated", { count: 20 });
	const fetchAnticipatedGames = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-games-anticipated", { sortByRating: true, count: 20 });

	const fetchMoviesRoles = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-roles", { sortByRating: true, type: "movies" });
	const fetchSeriesRoles = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-roles", { sortByRating: true, type: "series" });


	const fetchRandomArticles = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-articles", { random: true, count: 20 });
	const fetchLatestArticles = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-articles-latest", { count: 20 });
	const fetchLatestMoviesArticles = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-articles-latest-movies", { count: 20 });
	const fetchLatestSeriesArticles = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-articles-latest-series", { count: 20 });
	const fetchLatestGamesArticles = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-articles-latest-games", { count: 20 });

	const fetchRandomReviews = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-reviews-random", { count: 20 });
	const fetchLatestReviews = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-reviews-latest", { count: 20 });
	const fetchLatestMoviesReviews = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-reviews-latest-movies", { count: 20 });
	const fetchLatestSeriesReviews = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-reviews-latest-series", { count: 20 });
	const fetchLatestGamesReviews = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-reviews-latest-games", { count: 20 });

	const fetchActors = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-actors");
	const fetchCharacters = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-characters");

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
		Promise.all([
      fetchPopularMovies(),
			fetchTopRatedMovies(),
      fetchAnticipatedMovies(),
			fetchUpcomingMovies(),

      // fetchPopularSeries(),
			fetchTopRatedSeries(),
			// fetchUpcomingSeries(),
			fetchLatestSeries(),

      fetchRandomGames(), 
      fetchLatestGames(), 
      fetchTopRatedGames(),
      fetchAnticipatedGames(),

      fetchMoviesRoles(),
      fetchSeriesRoles(),

      fetchRandomArticles(),
      fetchLatestArticles(),
      fetchLatestMoviesArticles(),
      fetchLatestSeriesArticles(),
      fetchLatestGamesArticles(),

      fetchRandomReviews(),
      fetchLatestReviews(),
      fetchLatestMoviesReviews(),
      fetchLatestSeriesReviews(),
      fetchLatestGamesReviews(),

			fetchActors(),
      fetchCharacters(),
		])
			.then(
				([
          popularMoviesResponse,
          topRatedMoviesResponse,
          anticipatedMoviesResponse,
          upcomingMoviesResponse,
          
          // popularSeriesResponse,
          topRatedSeriesResponse,
          // upcomingSeriesResponse,
          latestSeriesResponse,

          randomGamesResponse,
          latestGamesResponse,
          topRatedGamesResponse,
          anticipatedGamesResponse,

          moviesRolesResponse,
          seriesRolesResponse,

          randomArticlesResponse,
          latestArticlesResponse,
          latestMoviesArticlesResponse,
          latestSeriesArticlesResponse,
          latestGamesArticlesResponse,

          randomReviewsResponse,
          latestReviewsResponse,
          latestMoviesReviewsResponse,
          latestSeriesReviewsResponse,
          latestGamesReviewsResponse,

          actorsResponse,
          charactersResponse,
				]) => {
					setPopularMovies(popularMoviesResponse.data.movies);
					setTopRatedMovies(topRatedMoviesResponse.data.movies);
					setAnticipatedMovies(anticipatedMoviesResponse.data.movies);
					setUpcomingMovies(upcomingMoviesResponse.data.movies);

					// setPopularSeries(popularSeriesResponse.data.series);
					setTopRatedSeries(topRatedSeriesResponse.data.series);
					// setUpcomingSeries(upcomingSeriesResponse.data.series);
					setLatestSeries(latestSeriesResponse.data.series);

          setRandomGames(randomGamesResponse.data.games)
          setLatestGames(latestGamesResponse.data.games)
          setTopRatedGames(topRatedGamesResponse.data.games)
          setAnticipatedGames(anticipatedGamesResponse.data.games),
    
					setMoviesRoles(moviesRolesResponse.data.roles);
					setSeriesRoles(seriesRolesResponse.data.roles);

					setRandomArticles(randomArticlesResponse.data.articles);
          setLatestArticles(latestArticlesResponse.data.articles)
          setLatestMovieArticles(latestMoviesArticlesResponse.data.articles)
          setLatestSeriesArticles(latestSeriesArticlesResponse.data.articles)
          setLatestGamesArticles(latestGamesArticlesResponse.data.articles)

					setRandomReviews(randomReviewsResponse.data.reviews);
          setLatestReviews(latestReviewsResponse.data.reviews)
          setLatestMovieReviews(latestMoviesReviewsResponse.data.reviews)
          setLatestSeriesReviews(latestSeriesReviewsResponse.data.reviews)
          setLatestGamesReviews(latestGamesReviewsResponse.data.reviews)

					setActors(actorsResponse.data.actors);
					setCharacters(charactersResponse.data.characters);
					setLoading(false);
				},
			)
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	}, []);

  const dataContextObj = {
    popularMovies, setPopularMovies,
    topRatedMovies, setTopRatedMovies,
    anticipatedMovies, setAnticipatedMovies,
    upcomingMovies, setUpcomingMovies,

    // popularSeries, setPopularSeries,
    topRatedSeries, setTopRatedSeries,
    // upcomingSeries, setUpcomingSeries,
    latestSeries, setLatestSeries,

    animes, setAnimes,
    popularAnimes, setPopularAnimes,
    topRatedAnimes, setTopRatedAnimes,
    upcomingAnimes, setUpcomingAnimes,

    randomGames, setRandomGames,
    latestGames, setLatestGames,
    topRatedGames, setTopRatedGames,
    anticipatedGames, setAnticipatedGames,

    moviesRoles, setMoviesRoles,
    seriesRoles, setSeriesRoles,

    randomArticles, setRandomArticles,
    latestArticles, setLatestArticles,
    latestMovieArticles, setLatestMovieArticles,
    latestSeriesArticles, setLatestSeriesArticles,
    latestGamesArticles, setLatestGamesArticles,

    randomReviews, setRandomReviews,
    latestReviews, setLatestReviews,
    latestMovieReviews, setLatestMovieReviews,
    latestSeriesReviews, setLatestSeriesReviews,
    latestGamesReviews, setLatestGamesReviews,

    actors, setActors,
    characters, setCharacters,
  }

	return loading ? (
		<Loader />
	) : (
		<MediaQueriesContext.Provider value={{ mobileView, tabletView }}>
			<UserContext.Provider value={{ userAuth, setUserAuth }}>
				<DataContext.Provider
					value={dataContextObj}
				>
					<Routes>
						<Route path="/" element={<Navbar />}>
							<Route index element={<HomePage />} />
							<Route path="/movies" element={<MoviesPage />} />
							<Route path="/series" element={<SeriesPage />} />
							<Route path="/games" element={<GamesPage />} />
							<Route path="/ranking" element={<RankingPage />} />
							<Route path="/my" element={<MyFilmwebPage />} />
							<Route path="/write" element={<WritePage />} />
							<Route path="/write-article" element={<WriteArticlePage />} />
							<Route path="/write-review" element={<WriteReviewPage />} />
						</Route>
					</Routes>
				</DataContext.Provider>
			</UserContext.Provider>
		</MediaQueriesContext.Provider>
	);
}

export default App;
