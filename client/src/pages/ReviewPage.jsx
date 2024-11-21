
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "axios";
import Download from "../components/Download.jsx";
import Footer from "../components/Footer";
import ArticleInfo from "../components/ArticleInfo.jsx";

const ReviewPage = () => {
	const { reviewId } = useParams();

	const [review, setReview] = useState({});
	const [latestReviews, setLatestReviews] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchReview = async (reviewId) => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/get-review",
				{ reviewId },
			);
			return response.data.review;
		} catch (err) {
			console.error(err);
		}
	};

	const fetchLatestReviews = async () => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/get-reviews-latest",
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
        console.log(reviewData)
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
		<>
			<ArticleInfo article={review} latestArticles={latestReviews} />
			<Download />
			<Footer />
		</>
	);
};

export default ReviewPage;
