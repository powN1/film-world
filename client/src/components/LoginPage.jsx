import { useContext, useEffect, useState } from "react";
import LoginModal from "./LoginModal";
import { DataContext, UserContext } from "../App";
import LoginBackground from "./LoginBackground";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
	const { movies } = useContext(DataContext);
	const { userAuth: { access_token }, } = useContext(UserContext);

	const navigate = useNavigate();

	const covers = movies.slice(0, 50).map((movie) => movie.cover);

	useEffect(() => {
		const checkUserLoginStatus = () => {
			if (access_token) {
				navigate("/");
				return;
			}
		};
		checkUserLoginStatus();
	}, [access_token, navigate]);

	return (
		<>
			<LoginBackground covers={covers} />
			<LoginModal mode="static"/>
		</>
	);
};

export default LoginPage;
