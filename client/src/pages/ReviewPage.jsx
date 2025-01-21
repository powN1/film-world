import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "axios";
import Download from "../components/Download.jsx";
import Footer from "../components/Footer";
import ArticleInfo from "../components/ArticleInfo.jsx";
import Comments, { fetchComments } from "../components/Comments.jsx";

export const reviewStructure = {
	title: "",
	description: "",
	content: [],
	author: {
		personal_info: {},
	},
	banner: "",
	publishedAt: "",
};

export const ReviewContext = createContext({});

const ReviewPage = () => {
	const { reviewId } = useParams();

	const [review, setReview] = useState(reviewStructure);
	const [latestReviews, setLatestReviews] = useState([]);
	const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);
	const [loading, setLoading] = useState(true);

	const fetchReview = async (reviewId) => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/api/get-review",
				{ reviewId },
			);
			response.data.review.comments = await fetchComments({
				mediaId: response.data.review._id,
				setParentCommentCountFunc: setTotalParentCommentsLoaded,
			});
      
			return response.data.review;
		} catch (err) {
			console.error(err);
		}
	};

	const fetchLatestReviews = async () => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/api/get-reviews-latest",
				{ count: 8 },
			);

			return response.data.reviews;
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		const loadReview = async () => {
			const reviewData = await fetchReview(reviewId);
			const latestReviewsData = await fetchLatestReviews();
			if (reviewData) {
				setReview(reviewData);
			}
			if (latestReviewsData) {
				setLatestReviews(latestReviewsData);
			}
			setLoading(false); // Set loading to false after fetching
		};

		loadReview();
	}, [reviewId]);

	return loading ? (
		<Loader />
	) : (
		<ReviewContext.Provider
			value={{
				media: review,
				setMedia: setReview,
				totalParentCommentsLoaded,
				setTotalParentCommentsLoaded,
			}}
		>
			<ArticleInfo article={review} latestArticles={latestReviews} />
			<Comments type="review" />
			<Download />
			<Footer />
		</ReviewContext.Provider>
	);
};

export default ReviewPage;
