import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-200 to-white">
      <div className="w-full px-3 lg:w-[55%] mx-auto flex justify-between items-center">
        <div className="flex gap-x-5 py-5">
          <Link to="/" className="text-3xl text-gray-600 hover:text-gray-900 duration-300">
            <FaInstagram />
          </Link>
          <Link to="/" className="">
            <FaFacebook className="text-3xl text-gray-600 hover:text-gray-900 duration-300" />
          </Link>
        </div>
        <p className="text-xs text-gray-600 px-5 py-2">
          Disclaimer: This project is made for educational purposes only. It is not intended for commercial use or to
          infringe on any copyrights or trademarks.
        </p>
        <p className="text-xs text-gray-600">Copyright© 2024</p>
      </div>
    </footer>
  );
};

export default Footer;
