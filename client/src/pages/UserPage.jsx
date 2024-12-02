import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserInfoPreview from "../components/UserInfoPreview";
import Loader from "../components/Loader";
import axios from "axios";
import Download from "../components/Download";
import Footer from "../components/Footer";
import UserLatestRatings from "../components/UserLatestRatings";
import UserHighestRatings from "../components/UserHighestRatings";
import UserLatestReviews from "../components/UserLatestReviews";

const UserPage = () => {
	const { userId } = useParams();

	const [user, setUser] = useState({ personal_info: {} });
	const [loading, setLoading] = useState(true);

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
			}
			setLoading(false); // Set loading to false after fetching
		};

		loadUser();
	}, [userId]);

	return loading ? (
		<Loader />
	) : (
		<>
			<UserInfoPreview user={user} setUser={setUser} />
			<UserLatestReviews author={user.personal_info} reviews={user.reviews} />
			<UserLatestRatings ratings={user.ratings} />
			<UserHighestRatings type="movies" ratings={user.ratings} />
			<UserHighestRatings type="series" ratings={user.ratings} />
			<UserHighestRatings type="games" ratings={user.ratings} />
			<Download />
			<Footer />
		</>
	);
};

export default UserPage;
