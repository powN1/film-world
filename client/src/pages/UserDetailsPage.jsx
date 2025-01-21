import { createContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "axios";
import Download from "../components/Download";
import Footer from "../components/Footer";
import UserRatingsInfo from "../components/UserRatingsInfo";
import UserRatingsMedias from "../components/UserRatingsMedias";

export const UserRatingsContext = createContext({});

const UserDetailsPage = () => {
	const { userId } = useParams();

  const location = useLocation()

	const [user, setUser] = useState({ personal_info: {} });
	const [loading, setLoading] = useState(true);

	const [currentCategory, setCurrentCategory] = useState("ratings");
	const [currentSubCategory, setCurrentSubCategory] = useState("movies");
	const [mediasToShow, setMediasToShow] = useState([]);

	const fetchUser = async (userId) => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/api/get-user",
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
    if(currentCategory.toLowerCase() === "ratings") {
      if (user.ratings) { 
        const show = user.ratings.filter((media) => media.itemType === currentSubCategory.toLowerCase());
        setMediasToShow(show);
      }
    } else if(currentCategory.toLowerCase() === "wants to see") {
      if (user.wantToSeeMedias) { 
        const show = user.wantToSeeMedias.filter((media) => media.itemType === currentSubCategory.toLowerCase());
        setMediasToShow(show);
      }
    } else if(currentCategory.toLowerCase() === "favorite") {
      if (user.wantToSeeMedias) { 
        const show = user.favoriteMedias.filter((media) => media.itemType === currentSubCategory.toLowerCase());
        setMediasToShow(show);
      }
    }
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
	return loading ? (
		<Loader />
	) : (
		<UserRatingsContext.Provider
			value={{
				currentCategory,
				setCurrentCategory,
				currentSubCategory,
				setCurrentSubCategory,
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
