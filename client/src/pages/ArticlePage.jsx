import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "axios";
import Download from "../components/Download.jsx";
import Footer from "../components/Footer";
import ArticleInfo from "../components/ArticleInfo.jsx";
import Comments, { fetchComments } from "../components/Comments.jsx";

export const articleStructure = {
	title: "",
	description: "",
	content: [],
	author: {
		personal_info: {},
	},
	banner: "",
	publishedAt: "",
};

export const ArticleContext = createContext({});

const ArticlePage = () => {
	const { articleId } = useParams();

	const [article, setArticle] = useState(articleStructure);
	const [latestArticles, setLatestArticles] = useState([]);
	const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);
	const [loading, setLoading] = useState(true);

	const fetchArticle = async (articleId) => {
		try {
			const response = await axios.post( import.meta.env.VITE_SERVER_DOMAIN + "/api/get-article", { articleId },);

			response.data.article.comments = await fetchComments({
				mediaId: response.data.article._id,
				setParentCommentCountFunc: setTotalParentCommentsLoaded,
			});

			return response.data.article;
		} catch (err) {
			console.error(err);
		}
	};

	const fetchLatestArticles = async () => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/api/get-articles-latest",
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
		<ArticleContext.Provider
			value={{
				media: article,
				setMedia: setArticle,
				latestArticles,
				totalParentCommentsLoaded,
				setTotalParentCommentsLoaded,
			}}
		>
			<ArticleInfo article={article} latestArticles={latestArticles} />
			<Comments type="article" />
			<Download />
			<Footer />
		</ArticleContext.Provider>
	);
};

export default ArticlePage;
