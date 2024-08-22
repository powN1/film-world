import { IoMdClose } from "react-icons/io";
import { IoChevronBack } from "react-icons/io5";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useEffect, useState } from "react";

const SpecificFilterModal = (props) => {
	const {
		title,
		children,
		currentFilter,
		setCurrentFilter,
		handleFilter,
		modalVisible,
		setModalVisible,
		disableAllModals,
	} = props;

	const [inputValue, setInputValue] = useState("");

	return (
		<div
			className={
				"w-screen md:w-[70%] lg:w-[30%] h-screen flex flex-col gap-y-3 fixed top-0 right-0 bg-white z-30 overflow-y-scroll duration-100 " +
				(modalVisible ? "translate-x-0" : "translate-x-[100%]")
			}
		>
			<div className="relative flex justify-center items-center text-black py-3 border-b border-gray-400/50">
				<h2 className="text-2xl font-sansNarrow uppercase">{title}</h2>
				<IoChevronBack
					className="absolute top-0 left-2 translate-y-[50%] text-3xl cursor-pointer"
					onClick={() => setModalVisible((prevVal) => !prevVal)}
				/>
				<IoMdClose
					className="absolute top-0 right-2 translate-y-[50%] text-3xl cursor-pointer"
					onClick={disableAllModals}
				/>
			</div>

			<div className="flex flex-col gap-y-3 px-4 md:px-10">
				<div className="relative">
					<FaMagnifyingGlass className="absolute top-1/2 left-3 translate-y-[-50%] text-xl text-yellow-400 opacity-75" />
					<input
						type=""
						placeholder="Search..."
						className="w-full py-2 pl-10 border-b border-gray-400/50 outline-none focus:border-yellow-400"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
					/>
				</div>

				<div className="flex flex-wrap gap-2">
					{children
						.filter((item) =>
							item.toLowerCase().includes(inputValue.toLowerCase()),
						)
						.map((element, i) => (
							<button
								key={i}
								className={
									" py-1 px-3 text-gray-600 whitespace-nowrap capitalize lg:duration-300 " +
									(currentFilter === element.toLowerCase()
										? "bg-yellow-400"
										: "bg-gray-400/20 lg:hover:bg-gray-400/40")
								}
								onClick={handleFilter}
							>
								{element}
							</button>
						))}
				</div>
			</div>

			<div className="flex justify-between mt-auto pb-4 px-3">
				<button
					className="py-3 w-1/3 text-gray-400 font-bold"
					onClick={() => {
						setCurrentFilter(null);
						setModalVisible(false);
					}}
				>
					Clear
				</button>
				<button
					className={
						"py-3 w-1/4 " +
						(currentFilter
							? "bg-yellow-400 font-bold text-black"
							: "text-gray-400 ")
					}
				>
					Save
				</button>
			</div>
		</div>
	);
};

export default SpecificFilterModal;
