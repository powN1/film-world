import { useContext, useEffect, useState } from "react";
import { DataContext } from "../App";
import { Link, useLocation } from "react-router-dom";
import Review from "../common/Review";
import { getFullYear } from "../common/date";
import ArticlesReviewsCategories from "../components/ArticlesReviewsCategories";
import ArticlesReviewsTexts from "../components/ArticlesReviewsTexts";
import Download from "../components/Download";
import Footer from "../components/Footer";

const categories = [{ name: "movies" }, { name: "series" }, { name: "games" }];

const ReviewsPage = () => {
  const { latestMovieReviews, latestSeriesReviews, latestGamesReviews } = useContext(DataContext);

  const location = useLocation();

  const [currentCategory, setCurrentCategory] = useState("movies");
  const [loading, setLoading] = useState(false);
  const [reviewsToShow, setReviewsToShow] = useState([]);

  const handleMediaShow = () => {
    // Show specific media given specific category that user chose
    if (currentCategory.toLowerCase() === "movies") {
      setCurrentCategory("movies");
      setReviewsToShow(latestMovieReviews);
    } else if (currentCategory.toLowerCase() === "series") {
      setCurrentCategory("series");
      setReviewsToShow(latestSeriesReviews);
    } else if (currentCategory.toLowerCase() === "games") {
      setCurrentCategory("games");
      setReviewsToShow(latestGamesReviews);
    }
  };

  const handleShowUnderline = (e) => {
    const category = e.target.innerText.toLowerCase();

    if (category !== currentCategory && categories.map((category) => category.name).includes(category)) {
      setCurrentCategory(category);
    }
  };

  useEffect(() => {
    handleMediaShow();
  }, [currentCategory]);

  useEffect(() => {
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
      <ArticlesReviewsCategories
        type="reviews"
        currentCategory={currentCategory}
        setCurrentCategory={setCurrentCategory}
      />
      <ArticlesReviewsTexts type="reviews" medias={reviewsToShow} />
      <Download />
      <Footer />
    </>
  );
};

export default ReviewsPage;
