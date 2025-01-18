import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

const SettingsPage = () => {
	const { userAuth, userAuth: { username, access_token }, } = useContext(UserContext);
	const navigate = useNavigate();

	const [user, setUser] = useState();
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
			const userData = await fetchUser(username);
			if (userData) {
				setUser(userData);
			}
			setLoading(false); // Set loading to false after fetching
		};

		loadUser();
	}, []);

	useEffect(() => {
		const checkUserLoginStatus = () => {
			if (!access_token) {
				navigate("/login");
				return;
			}
		};
		checkUserLoginStatus();
	}, [access_token, navigate]);


	return loading ? (
		<Loader />
	) : (
		<>
			<div className="w-full bg-white">
				<div className="h-[50vh] lg:w-[55%] w-full mx-auto relative p-2 lg:pt-4 flex flex-col gap-y-4">
					<h1 className="text-2xl lg:text-3xl font-sansNarrow uppercase font-bold">
						Settings
					</h1>
          <span className="border-b border-gray-400/30"></span>
					<div className="flex flex-col gap-y-4">
						<h2 className="text-2xl font-sansNarrow uppercase font-bold lg:tracking-widest">
							Personal details
						</h2>
						<div className="flex flex-col gap-y-3 text-xl lg:text-base ml-8">
							<div className="flex flex-col">
								<p className="font-bold capitalize">Name</p>
								<p className="ml-3 capitalize">
									{user.personal_info.firstName} {user.personal_info.surname}
								</p>
							</div>
							<div className="flex flex-col">
								<p className="font-bold capitalize">username</p>
								<p className="ml-3">{user.personal_info.username}</p>
							</div>
							<div className="flex flex-col">
								<p className="font-bold capitalize">email</p>
								<p className="ml-3">{user.personal_info.email}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default SettingsPage;
