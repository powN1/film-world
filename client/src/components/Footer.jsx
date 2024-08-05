import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import deadpool from "../imgs/deadpool.jpg";
import mcu from "../imgs/mcu.jpg";
import rdj from "../imgs/rdj.jpg";
import batman from "../imgs/batman.jpg";
import giancarlo from "../imgs/giancarlo.jpg";
import dexter from "../imgs/dexter.jpg";
import hellboy from "../imgs/hellboy.jpg";
import penguin from "../imgs/penguin.jpg";
import reaper from "../imgs/reaper.jpg";
const Footer = () => {
	const movies = [
		{
			title: "I am legend 2",
			img: deadpool,
			ranking: 1,
		},
		{
			title: "Awoken",
			img: mcu,
			ranking: 2,
		},
		{
			title: `Code of Evil`,
			img: rdj,
			ranking: 3,
		},
		{
			title: `Twisters`,
			img: batman,
			ranking: 4,
		},
		{
			title: `Black telephone`,
			img: giancarlo,
			ranking: 5,
		},
		{
			title: `Love Lies Bleeding`,
			img: reaper,
			ranking: 6,
		},
		{
			title: `Dexter`,
			img: dexter,
			ranking: 7,
		},
		{
			title: `Hellboy: Hell Unites`,
			img: hellboy,
			ranking: 8,
		},
		{
			title: `Batman: Arkham Vengence`,
			img: penguin,
			ranking: 9,
		},
		{
			title: `Ministry`,
			img: reaper,
			ranking: 10,
		},
		{
			title: `Black organs`,
			img: reaper,
		},
		{
			title: `Blackbird`,
			img: reaper,
		},
		{
			title: `Out of this world`,
			img: reaper,
		},
		{
			title: `Vicious cycle`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
		{
			title: `Perpetual burn`,
			img: reaper,
		},
	];
	return (
		<footer className="bg-gradient-to-b from-gray-200 to-white mt-10">
			<div className="w-[55%] mx-auto flex justify-between items-center">
				<div className="flex gap-x-5 py-5">
					<Link
						to="/"
						className="text-3xl text-gray-600 hover:text-gray-900 duration-300"
					>
						<FaInstagram />
					</Link>
					<Link to="/" className="">
						<FaFacebook className="text-3xl text-gray-600 hover:text-gray-900 duration-300" />
					</Link>
				</div>
        <p className="text-xs text-gray-600">Copyright© 2024</p>
			</div>
		</footer>
	);
};

export default Footer;
