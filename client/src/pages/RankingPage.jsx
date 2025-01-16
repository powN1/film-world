import { createContext, useContext, useEffect, useState } from "react";
import Download from "../components/Download";
import Footer from "../components/Footer";
import RankingFilter from "../components/RankingFilter";
import RankingResults from "../components/RankingResults";
import axios from "axios";
import { DataContext, UserContext } from "../App";
import { filtersCountries } from "../common/filters";
import { useLocation } from "react-router-dom";

export const RankingContext = createContext({});

const RankingPage = () => {
  const {
    userAuth: { access_token },
  } = useContext(UserContext);

  const {
    latestMovies,
    topRatedMovies,
    topRatedSeries,
    latestSeries,
    movieTopRatedMaleRoles,
    movieTopRatedFemaleRoles,
    serieTopRatedMaleRoles,
    serieTopRatedFemaleRoles,
    actorsTopRated,
    topRatedGames,
    anticipatedGames,
  } = useContext(DataContext);

  const location = useLocation();

  const [currentCategory, setCurrentCategory] = useState("movies");
  const [currentSubCategory, setCurrentSubCategory] = useState("top 500");
  const [localCurrentCategory, setLocalCurrentCategory] = useState([]);

  const [currentGenre, setCurrentGenre] = useState(null);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);

  const [mediaToShow, setMediaToShow] = useState([]);

  const handleMediaFilterSearch = async (genre = null, country = null, year = null) => {
    if (country) {
      // Get the iso (PL, GB, US etc) value for a specific country since countries in the db
      // are using the iso values
      country = filtersCountries.find(
        (filterCountry) => filterCountry.english_name.toLowerCase() === country.toLowerCase()
      ).iso;
    }

    let urlPath;
    if (currentCategory.toLowerCase() === "movies") urlPath = "/get-movies-by-filters";
    else if (currentCategory.toLowerCase() === "series") urlPath = "/get-series-by-filters";
    else if (currentCategory.toLowerCase() === "games") urlPath = "/get-games-by-filters";

    try {
      const response = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + urlPath,
        { count: 100, genre, country, year },
        { headers: { Authorization: `${access_token}` } }
      );
      if (response.data) {
        if (response.data.movies) setMediaToShow(response.data.movies);
        else if (response.data.series) setMediaToShow(response.data.series);
        else if (response.data.games) setMediaToShow(response.data.games);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMediaShow = () => {
    // Show specific media given specific category that user chose
    if (currentCategory.toLowerCase() === "movies") {
      setLocalCurrentCategory("movies");
      if (currentSubCategory === "top 500") {
        setMediaToShow(topRatedMovies);
      } else if (currentSubCategory === "new") {
        setMediaToShow(latestMovies.sort((a, b) => b.activity.rating - a.activity.rating));
      }
    } else if (currentCategory.toLowerCase() === "series") {
      setLocalCurrentCategory("series");
      if (currentSubCategory === "top 500") {
        setMediaToShow(topRatedSeries);
      } else if (currentSubCategory === "new") {
        setMediaToShow(latestSeries);
      }
    } else if (currentCategory.toLowerCase() === "games") {
      setLocalCurrentCategory("games");
      if (currentSubCategory === "top 100") {
        setMediaToShow(topRatedGames);
      } else if (currentSubCategory === "most anticipated") {
        setMediaToShow(anticipatedGames);
      }
    } else if (currentCategory.toLowerCase() === "movie roles") {
      setLocalCurrentCategory("movie roles");
      if (currentSubCategory === "male") {
        setMediaToShow(movieTopRatedMaleRoles);
      } else if (currentSubCategory === "female") {
        setMediaToShow(movieTopRatedFemaleRoles);
      }
    } else if (currentCategory.toLowerCase() === "serie roles") {
      setLocalCurrentCategory("serie roles");
      if (currentSubCategory === "male") {
        setMediaToShow(serieTopRatedMaleRoles);
      } else if (currentSubCategory === "female") {
        setMediaToShow(serieTopRatedFemaleRoles);
      }
    } else if (currentCategory.toLowerCase() === "actors") {
      setLocalCurrentCategory("actors");
      setMediaToShow(actorsTopRated);
    }
  };

  useEffect(() => {
    setCurrentGenre(null);
    setCurrentCountry(null);
    setCurrentYear(null);
    handleMediaShow();
  }, [currentCategory, currentSubCategory]);

  useEffect(() => {
    // Retrieve the state passed from the previous page
    if (location.state) {
      const cat = location.state.category;
      const subCat = location.state.subCategory;

      if (cat) {
        if (currentCategory !== cat) setCurrentCategory(cat);
      }
      if (subCat) {
        if (currentSubCategory !== subCat) setCurrentSubCategory(subCat);
      }
    }
  }, [location]);

  useEffect(() => {
    console.log("current media to show: ", mediaToShow);
  }, [mediaToShow]);

  return (
    <>
      <RankingContext.Provider
        value={{
          currentCategory,
          setCurrentCategory,
          currentSubCategory,
          setCurrentSubCategory,
          currentGenre,
          setCurrentGenre,
          currentCountry,
          setCurrentCountry,
          currentYear,
          setCurrentYear,
          mediaToShow,
          localCurrentCategory,
          handleMediaFilterSearch,
          handleMediaShow,
        }}
      >
        <RankingFilter />
        <RankingResults />
        <Download />
        <Footer />
      </RankingContext.Provider>
    </>
  );
};

export default RankingPage;
