import React, { useContext, useState } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { UserContext } from "../App";
import filmwebLogoSmall from "../imgs/filmweb-logo-small.png";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { storeInSession } from "../common/session";
import { authWithGoogle, authWithFacebook } from "../common/firebase";

const LoginModal = ({ setLoginModalVisible }) => {
	let {
		userAuth: { access_token },
		setUserAuth,
	} = useContext(UserContext);

	const [normalLoginClicked, setNormalLoginClicked] = useState(false);
	const [newAccountClicked, setNewAccountClicked] = useState(false);

	const [firstName, setFirstName] = useState("");
	const [surname, setSurname] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [sex, setSex] = useState("");
	const [type, setType] = useState("password");

	const handleInputsClear = () => {
		setFirstName("");
		setSurname("");
		setUsername("");
		setEmail("");
		setPassword("");
		setSex("");
		setType("password");
	};

	const handlePasswordVisibilityChange = () => {
		if (type === "password") {
			setType("text");
		} else {
			setType("password");
		}
	};

	const userAuthThroughServer = (serverRoute, formData) => {
		axios
			.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
			.then(({ data }) => {
				storeInSession("user", JSON.stringify(data));
				setUserAuth(data);

				handleInputsClear();

				// setTimeout(() => {
				setNormalLoginClicked(false);
				setNewAccountClicked(false);
				setLoginModalVisible(false);
				// }, 1000);
			})
			.catch(({ response }) => {
				toast.error(response.data.error);
			});
	};

	const handleGoogleAuth = (e) => {
		e.preventDefault();

		authWithGoogle()
			.then((user) => {
				let serverRoute = "/google-auth";

				let formData = { access_token: user.accessToken };

				userAuthThroughServer(serverRoute, formData);
			})
			.catch((err) => {
				toast.error("Trouble loggin in through google");
				return console.log(err);
			});
	};

	const handleFacebookAuth = (e) => {
		e.preventDefault();

		authWithFacebook()
			.then((user) => {
				let serverRoute = "/facebook-auth";

				let formData = { access_token: user.accessToken, facebook_access_token: user.facebookAccessToken };

				userAuthThroughServer(serverRoute, formData);
			})
			.catch((err) => {
				toast.error("Trouble loggin in through facebook");
				return console.log(err);
			});
	};

	const handleSubmit = (type) => {
		const serverRoute = type === "sign-in" ? "/signin" : "/signup";

		// Regex for identifying whether the email and password are correctly formatted
		let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
		let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

		// form data
		let form = new FormData(formElement);
		let formData = {};
		for (let [key, value] of form.entries()) {
			formData[key] = value;
		}

		const { firstName, surname, username, email, password } = formData;

		if (firstName) {
			if (firstName.length < 2) {
				return toast.error("First name must be at least 2 letters long");
			}
		}

		if (surname) {
			if (surname.length < 3) {
				return toast.error("Surname must be at least 3 letters long");
			}
		}

		if (username) {
			if (username.length < 3) {
				return toast.error("Username must be at least 3 letters long");
			}
		}

		if (!email.length) {
			console.log("hello?");
			return toast.error("Enter email");
		}

		if (!emailRegex.test(email)) {
			return toast.error("Email is invalid");
		}

		if (!passwordRegex.test(password)) {
			return toast.error(
				"Password should be 6-20 characters long with a numeric, 1 lowercase and 1 uppercase letters",
			);
		}

		userAuthThroughServer(serverRoute, formData);
	};

	return (
		<>
			<div className="w-[95%] md:w-[50%] lg:w-[20%] fixed top-1/2 translate-y-[-50%] left-1/2 translate-x-[-50%] bg-white z-30 flex flex-col items-center gap-y-5">
				<Toaster />
				{!normalLoginClicked && !newAccountClicked ? (
					<div className="w-full flex flex-col items-center gap-y-5 py-10">
						<button onClick={() => setLoginModalVisible((prevVal) => !prevVal)}>
							<IoMdClose className="absolute top-4 right-4 text-3xl" />
						</button>
						<p className="text-2xl">Log in or create account</p>
						<div className="flex flex-col justify-center items-center gap-y-5 w-full">
							<button
								className="w-[90%] py-3 border border-gray-300 flex justify-center items-center gap-x-3 rounded bg-white text-black font-medium"
								onClick={handleGoogleAuth}
							>
								<FaGoogle className="text-yellow-400 text-lg" />
								<p className="">
									Sign in through <span className="font-bold">google</span>
								</p>
							</button>
							<button
								className="w-[90%] py-3 border border-gray-300 flex justify-center items-center gap-x-3 rounded bg-white text-black font-medium"
								onClick={handleFacebookAuth}
							>
								<FaFacebook className="text-blue-600 text-xl" />
								<p className="">
									Sign in through <span className="font-bold">facebook</span>
								</p>
							</button>
							<button
								className="w-[90%] py-3 border border-gray-300 flex justify-center items-center gap-x-3 rounded bg-white text-black font-medium"
								onClick={() => setNormalLoginClicked(true)}
							>
                <img src={filmwebLogoSmall} alt="" className="h-[20px] w-[20px]"/>
								<p className="">
									Sign in through{" "}
									<span className="font-bold">filmweb account</span>
								</p>
							</button>
							<Link
								className="w-[90%] py-3 border border-gray-300 flex justify-center items-center gap-x-3 rounded bg-white text-black font-medium"
								onClick={() => setNewAccountClicked(true)}
							>
								<p className="">Create new account</p>
							</Link>
						</div>
					</div>
				) : null}

				{normalLoginClicked && (
					<div className="relative w-full flex flex-col items-center gap-y-5 py-10 h-full">
						<button onClick={() => setNormalLoginClicked(false)}>
							<IoMdClose className="absolute top-4 right-4 text-3xl" />
						</button>
						<h3 className="text-2xl">Log in</h3>

						<form
							id="formElement"
							className="w-full flex flex-col items-center gap-y-5"
						>
							<div className="w-full flex justify-center">
								<input
									type="email"
									name="email"
									placeholder="Email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-[90%] p-2 border-b border-b-gray-400/50 focus:outline-none focus:border-b-yellow-400 focus:border-b-2"
								/>
							</div>
							<div className="relative w-full flex justify-center">
								<input
									type={type}
									name="password"
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-[90%] p-2 border-b border-b-gray-400/50 focus:outline-none focus:border-b-yellow-400 focus:border-b-2"
								/>
								{type === "password" ? (
									<FaEye
										className="absolute top-1/2 right-5 translate-y-[-50%] cursor-pointer"
										onClick={handlePasswordVisibilityChange}
									/>
								) : (
									<FaRegEye
										className="absolute top-1/2 right-5 translate-y-[-50%] cursor-pointer"
										onClick={handlePasswordVisibilityChange}
									/>
								)}
							</div>
							<button
								className={
									"py-2 w-[90%] bg-yellow-400 text-gray-600 rounded-sm"
								}
								disabled={!email || !password ? true : false}
								onClick={(e) => {
									e.preventDefault();
									handleSubmit("sign-in");
								}}
							>
								Log in
							</button>
							<button
								className="py-2 w-[90%] border border-gray-400/50 text-gray-600 rounded-sm"
								onClick={() => {
									handleInputsClear();
									setNormalLoginClicked(false);
									setNewAccountClicked(true);
								}}
							>
								Create new filmweb account
							</button>
							<button
								className="py-2 w-[90%] text-gray-600 rounded-sm"
								onClick={() => {
									handleInputsClear();
									setNormalLoginClicked(false);
								}}
							>
								Change login method
							</button>
						</form>
					</div>
				)}

				{newAccountClicked && (
					<div className="relative w-full flex flex-col items-center gap-y-5 py-10">
						<button
							onClick={() => {
								setNewAccountClicked(false);
								handleInputsClear();
							}}
						>
							<IoMdClose className="absolute top-4 right-4 text-3xl" />
						</button>

						<h3 className="text-2xl lg:text-xl px-5 text-center font-bold">
							Create account in one easy step
						</h3>

						<form
							id="formElement"
							className="w-full flex flex-col items-center gap-y-5"
						>
							<div className="flex items-center px-2">
								<div className="w-1/2 flex justify-center">
									<input
										type="text"
										name="firstName"
										placeholder="First Name"
										value={firstName}
										onChange={(e) => setFirstName(e.target.value)}
										className="w-[90%] p-2 border-b border-b-gray-400/50 focus:outline-none focus:border-b-yellow-400 focus:border-b-2"
									/>
								</div>

								<div className="w-1/2 flex justify-center">
									<input
										type="text"
										name="surname"
										placeholder="Surname"
										value={surname}
										onChange={(e) => setSurname(e.target.value)}
										className="w-[90%] p-2 border-b border-b-gray-400/50 focus:outline-none focus:border-b-yellow-400 focus:border-b-2"
									/>
								</div>
							</div>

							<div className="w-full flex justify-center">
								<input
									type="text"
									name="username"
									placeholder="Username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									className="w-[90%] p-2 border-b border-b-gray-400/50 focus:outline-none focus:border-b-yellow-400 focus:border-b-2"
								/>
							</div>

							<div className="w-full flex justify-center">
								<input
									type="email"
									name="email"
									placeholder="Email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-[90%] p-2 border-b border-b-gray-400/50 focus:outline-none focus:border-b-yellow-400 focus:border-b-2"
								/>
							</div>

							<div className="relative w-full flex justify-center">
								<input
									type={type}
									name="password"
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-[90%] p-2 border-b border-b-gray-400/50 focus:outline-none focus:border-b-yellow-400 focus:border-b-2"
								/>
								{type === "password" ? (
									<FaEye
										className="absolute top-1/2 right-5 translate-y-[-50%] cursor-pointer"
										onClick={handlePasswordVisibilityChange}
									/>
								) : (
									<FaRegEye
										className="absolute top-1/2 right-5 translate-y-[-50%] cursor-pointer"
										onClick={handlePasswordVisibilityChange}
									/>
								)}
							</div>

							<div className="flex w-full px-2 gap-x-5">
								<div className="flex flex-col w-full ml-2">
									<label
										htmlFor="sex1"
										className={
											"py-4 w-full text-center cursor-pointer hover:text-black duration-300 " +
											(sex === "male"
												? "bg-yellow-400 text-black"
												: "bg-gray-200 text-gray-400")
										}
									>
										Male
									</label>
									<input
										type="radio"
										name="sex"
										id="sex1"
										value="male"
										checked={sex === "male"}
										className="hidden"
										onChange={(e) => {
											setSex(e.target.value);
										}}
									/>
								</div>
								<div className="flex flex-col w-full mr-2">
									<label
										htmlFor="sex2"
										className={
											"py-4 w-full mr-6 text-center cursor-pointer hover:text-black duration-300 " +
											(sex === "female"
												? "bg-yellow-400 text-black"
												: "bg-gray-200 text-gray-400")
										}
									>
										Female
									</label>
									<input
										type="radio"
										name="sex"
										id="sex2"
										value="female"
										className="hidden"
										checked={sex === "female"}
										onChange={(e) => {
											setSex(e.target.value);
										}}
									/>
								</div>
							</div>
							<button
								className={"py-2 w-[90%] bg-yellow-400 text-black rounded-sm"}
								type="submit"
								disabled={
									!firstName ||
									!surname ||
									!username ||
									!password ||
									!email ||
									!sex
										? true
										: false
								}
								onClick={(e) => {
									e.preventDefault();
									handleSubmit("sign-up");
								}}
							>
								Sign up
							</button>
							<button
								className={"py-2 w-[90%] text-gray-600 rounded-sm"}
								onClick={() => {
									handleInputsClear();
									setNewAccountClicked(false);
									setNormalLoginClicked(true);
								}}
							>
								Got an account
							</button>
						</form>
					</div>
				)}
			</div>
		</>
	);
};

export default LoginModal;
