import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "axios";
import Download from "../components/Download";
import Footer from "../components/Footer";
import { DataContext } from "../App";
import ArticlesReviewsCategories from "../components/ArticlesReviewsCategories";
import ArticlesReviewsTexts from "../components/ArticlesReviewsTexts";

export const ArticlesPageContext = createContext({});

const ArticlesPage = () => {
  const { latestMovieArticles, latestSeriesArticles, latestGamesArticles } = useContext(DataContext);
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const [currentCategory, setCurrentCategory] = useState("movies");
  const [mediasToShow, setMediasToShow] = useState([]);

  useEffect(() => {
    if (currentCategory.toLowerCase() === "movies") setMediasToShow(latestMovieArticles);
    else if (currentCategory.toLowerCase() === "series") setMediasToShow(latestSeriesArticles);
    else if (currentCategory.toLowerCase() === "games") setMediasToShow(latestGamesArticles);
  }, [currentCategory]);

  useEffect(() => {
    // Retrieve the state passed from the previous page
    if (location.state) {
      const cat = location.state.category;

      if (cat) {
        if (currentCategory !== cat) setCurrentCategory(cat);
      }
    }
  }, [location]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <ArticlesReviewsCategories type="articles" currentCategory={currentCategory} setCurrentCategory={setCurrentCategory} />
      <ArticlesReviewsTexts type="articles" medias={mediasToShow} />
      <Download />
      <Footer />
    </>
  );
};

export default ArticlesPage;
