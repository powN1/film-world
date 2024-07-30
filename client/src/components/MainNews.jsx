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

const MainNews = () => {
	return (
		<div className="grid grid-rows-[80px_80px_80px_80px_80px_80px] grid-cols-[3fr_3fr_4fr] gap-7 p-4">
			<article className="relative col-start-1 col-span-2 row-start-1 row-end-5 group overflow-hidden cursor-pointer">
				<img
					src={rdj}
					alt="deadpool"
					className="object-cover h-full w-full group-hover:scale-110 duration-700"
				/>
				<div className="absolute bottom-3 left-0 flex flex-col p-3">
					<p className="text-3xl text-white group-hover:text-yellow-400 duration-300 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
						Deadpool 3 out in 2 weeks!
					</p>
					<span className="text-gray-400">13 komentarzy</span>
				</div>
			</article>
			<article className="relative col-start-1 col-span-1 row-start-5 row-span-2 group overflow-hidden cursor-pointer">
				<img
					src={mcu}
					alt="deadpool"
					className="object-cover h-full w-full group-hover:scale-110 duration-700"
				/>
				<div className="absolute bottom-2 left-0 flex flex-col p-3">
					<p className="text-white group-hover:text-yellow-400 duration-300 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
						Russo brothers back in MCU!
					</p>
					<span className="text-xs text-gray-400">13 komentarzy</span>
				</div>
			</article>

			<article className="relative col-start-2 col-span-1 row-start-5 row-span-2 group overflow-hidden cursor-pointer">
				<img
					src={deadpool}
					alt="deadpool"
					className="object-cover w-full h-full group-hover:scale-110 duration-700"
				/>
				<div className="absolute bottom-2 left-0 flex flex-col p-3 ">
					<p className="text-white group-hover:text-yellow-400 duration-300 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
						Deadpool 3 out in 2 weeks!
					</p>
					<span className="text-xs text-gray-400">13 komentarzy</span>
				</div>
			</article>

			<article className="flex col-start-3 col-end-3 col-span-1 group overflow-hidden cursor-pointer">
				<div className="w-[40%] overflow-hidden border border-gray-800">
					<img
						src={hellboy}
						alt="deadpool"
						className="object-cover w-full h-full  group-hover:scale-110 duration-700"
					/>
				</div>
				<div className="flex flex-col px-2 py-1 justify-between w-[60%]">
					<p className="text-white text-sm group-hover:text-yellow-400 duration-300 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
						Forget about Ron Perlman. This is a new "Hellboy" trailer
					</p>
					<span className="text-xs text-gray-400">13 komentarzy</span>
				</div>
			</article>

			<article className="flex col-start-3 col-end-3 col-span-1 group overflow-hidden cursor-pointer">
				<div className="w-[40%] overflow-hidden border border-gray-800">
					<img
						src={reaper}
						alt="deadpool"
						className="object-cover w-full h-full  group-hover:scale-110 duration-700"
					/>
				</div>
				<div className="flex flex-col px-2 py-1 justify-between w-[60%]">
					<p className="text-white text-sm group-hover:text-yellow-400 duration-300 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
						Most brutal movie of the year is getting a sequel
					</p>
					<span className="text-xs text-gray-400">13 komentarzy</span>
				</div>
			</article>

			<article className="flex col-start-3 col-end-3 col-span-1 group overflow-hidden cursor-pointer">
				<div className="w-[40%] overflow-hidden border border-gray-800">
					<img
						src={penguin}
						alt="deadpool"
						className="object-cover w-full h-full  group-hover:scale-110 duration-700"
					/>
				</div>
				<div className="flex flex-col px-2 py-1 justify-between w-[60%]">
					<p className="text-white text-sm group-hover:text-yellow-400 duration-300 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
						Check out a history of infamous "penguin"
					</p>
					<span className="text-xs text-gray-400">13 komentarzy</span>
				</div>
			</article>

			<article className="flex col-start-3 col-end-3 col-span-1 group overflow-hidden cursor-pointer">
				<div className="w-[40%] overflow-hidden border border-gray-800">
					<img
						src={giancarlo}
						alt="deadpool"
						className="object-cover w-full h-full  group-hover:scale-110 duration-700"
					/>
				</div>
				<div className="flex flex-col px-2 py-1 justify-between w-[60%]">
					<p className="text-white text-sm group-hover:text-yellow-400 duration-300 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
						Giancarlo Esposito in an elongated interview
					</p>
					<span className="text-xs text-gray-400">13 komentarzy</span>
				</div>
			</article>

			<article className="flex col-start-3 col-end-3 col-span-1 group overflow-hidden cursor-pointer">
				<div className="w-[40%] overflow-hidden border border-gray-800">
					<img
						src={batman}
						alt="deadpool"
						className="object-cover w-full h-full  group-hover:scale-110 duration-700"
					/>
				</div>
				<div className="flex flex-col px-2 py-1 justify-between w-[60%]">
					<p className="text-white text-sm group-hover:text-yellow-400 duration-300 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">History of Batman in a nutshell</p>
					<span className="text-xs text-gray-400">13 komentarzy</span>
				</div>
			</article>

			<article className="flex col-start-3 col-end-3 col-span-1 group overflow-hidden cursor-pointer">
				<div className="w-[40%] overflow-hidden border border-gray-800">
					<img
						src={dexter}
						alt="deadpool"
						className="object-cover w-full h-full  group-hover:scale-110 duration-700"
					/>
				</div>
				<div className="flex flex-col px-2 py-1 justify-between w-[60%]">
					<p className="text-white text-sm group-hover:text-yellow-400 duration-300 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
						Surprise! Michael C. Hall comes back as Dexter. See the prequel
					</p>
					<span className="text-xs text-gray-400">13 komentarzy</span>
				</div>
			</article>
		</div>
	);
};

export default MainNews;
