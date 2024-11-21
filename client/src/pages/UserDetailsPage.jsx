import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "axios";
import Download from "../components/Download";
import Footer from "../components/Footer";
import UserRatingsInfo from "../components/UserRatingsInfo";
import UserRatingsMedias from "../components/UserRatingsMedias";

export const UserRatingsContext = createContext({});

const UserDetailsPage = () => {
	const { userId } = useParams();

	const [user, setUser] = useState({ personal_info: {} });
	const [loading, setLoading] = useState(true);

	const [currentCategory, setCurrentCategory] = useState("ratings");
	const [currentMediaSelected, setCurrentMediaSelected] = useState("movies");
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
				setUser(userData);
				const show = userData.ratings.filter(
					(media) => media.itemType === "movies",
				);
				setMediasToShow(show);
			}
			setLoading(false); // Set loading to false after fetching
		};

		loadUser();
	}, [userId]);

	useEffect(() => {
		if (user.ratings) { 
      const show = user.ratings.filter((media) => media.itemType === currentMediaSelected.toLowerCase());
			setMediasToShow(show);
		}
	}, [currentMediaSelected]);

	return loading ? (
		<Loader />
	) : (
		<UserRatingsContext.Provider
			value={{
				currentCategory,
				setCurrentCategory,
				currentMediaSelected,
				setCurrentMediaSelected,
			}}
		>
			<UserRatingsInfo user={user} />
			<UserRatingsMedias medias={mediasToShow} />
			<Download />
			<Footer />
		</UserRatingsContext.Provider>
	);
};

export default UserDetailsPage;
