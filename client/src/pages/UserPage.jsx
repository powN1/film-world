import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserInfoPreview from "../components/UserInfoPreview";
import Loader from "../components/Loader";
import axios from "axios";
import Download from "../components/Download";
import Footer from "../components/Footer";
import UserLatestRatings from "../components/UserLatestRatings";
import UserHighestMovieRatings from "../components/UserHighestMovieRatings";
import { CiLink } from "react-icons/ci";

const UserPage = () => {
	const { userId } = useParams();

	const [user, setUser] = useState({personal_info: {}});
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
			<UserInfoPreview user={user} />
			<UserLatestRatings ratings={user.ratings} />
			<UserHighestMovieRatings ratings={user.ratings} />
			<Download />
			<Footer />
		</>
	);
};

export default UserPage;
