import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import LoginModal from "../components/LoginModal";

const Login = () => {
	const [loginModalVisible, setLoginModalVisible] = useState(false);

	return (
		<>
			<div className="bg-white flex flex-col justify-center items-center gap-y-5 min-h-[50vh]">
				<Link className="w-[80%] lg:w-[20%] py-2 border border-gray-300 flex justify-center items-center gap-x-3 rounded bg-white text-black font-medium">
					<FaGoogle className="text-yellow-400 text-lg" />
					Sign in through google
				</Link>
				<div>
					<p>
						or use other 
						<Link className="text-amber-700" onClick={() => setLoginModalVisible((prevVal) => !prevVal)} >
							 logging in method
						</Link>
					</p>
				</div>
			</div>

			<div
				className={
					"inset-0 bg-black z-30 " +
					(loginModalVisible
						? "fixed bg-opacity-50 backdrop-blur-sm "
						: "invisible bg-opacity-0")
				}
			></div>

			{loginModalVisible && <LoginModal setLoginModalVisible={setLoginModalVisible}/>}
		</>
	);
};

export default Login;
