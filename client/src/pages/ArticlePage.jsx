import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "axios";
import Download from "../components/Download.jsx";
import Footer from "../components/Footer";
import ArticleInfo from "../components/ArticleInfo.jsx";

const ArticlePage = () => {
	const { articleId } = useParams();

	const [article, setArticle] = useState({});
	const [latestArticles, setLatestArticles] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchArticle = async (articleId) => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/get-article",
				{ articleId },
			);
			return response.data.article;
		} catch (err) {
			console.error(err);
		}
	};

	const fetchLatestArticles = async () => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/get-articles-latest",
				{ count: 8 },
			);
			return response.data.articles;
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		const loadArticle = async () => {
			const articleData = await fetchArticle(articleId);
			const latestArticlesData = await fetchLatestArticles();
			if (articleData) {
				setArticle(articleData);
			}
			if (latestArticlesData) {
				setLatestArticles(latestArticlesData);
			}
			setLoading(false); // Set loading to false after fetching
		};

		loadArticle();
	}, [articleId]);
	return loading ? (
		<Loader />
	) : (
		<>
			<ArticleInfo article={article} latestArticles={latestArticles} />
			<Download />
			<Footer />
		</>
	);
};

export default ArticlePage;
