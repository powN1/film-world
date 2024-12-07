import { createContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "axios";
import Download from "../components/Download";
import Footer from "../components/Footer";
import UserTextsInfo from "../components/UserTextsInfo";
import UserTextsMedias from "../components/UserTextsMedias";

export const UserTextsContext = createContext({});

const UserTextsPage = () => {

	const location = useLocation();

	const { userId } = useParams();

	const [user, setUser] = useState({ personal_info: {} });
	const [loading, setLoading] = useState(true);

	const [currentCategory, setCurrentCategory] = useState("articles");
	const [mediasToShow, setMediasToShow] = useState([]);

	const fetchUser = async (userId) => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/get-user",
				{ userId },
			);
			return response.data.user;
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		const loadUser = async () => {
			const userData = await fetchUser(userId);

			if (userData) {
        // Flip the array so the most recent articles and reviews are the ones starting from index 0
				userData.reviews.reverse();
				userData.articles.reverse();

				setUser(userData);
				setMediasToShow(userData.articles);
			}
			setLoading(false); // Set loading to false after fetching
		};

		loadUser();
	}, [userId]);

	useEffect(() => {
		if (currentCategory.toLowerCase() === "reviews") {
			if (user.reviews && user.reviews.length !== 0) {
				setMediasToShow(user.reviews);
			}
		} else if (currentCategory.toLowerCase() === "articles") {
			if (user.articles && user.articles.length !== 0) {
				setMediasToShow(user.articles);
			}
		}
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
		<UserTextsContext.Provider
			value={{
				currentCategory,
				setCurrentCategory,
			}}
		>
			<UserTextsInfo user={user} />
			<UserTextsMedias medias={mediasToShow} author={user} />
			<Download />
			<Footer />
		</UserTextsContext.Provider>
	);
};

export default UserTextsPage;
