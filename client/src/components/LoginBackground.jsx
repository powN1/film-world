const LoginBackground = ({ covers }) => {
	return (
		<div className="bg-black h-screen w-full absolute top-0 left-0 overflow-hidden">
			<div className="absolute top-0 left-0 h-full opacity-20 grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-5 pt-16 lg:pt-28">
				{covers.map((cover, i) => (
					<img
						key={i}
						src={cover}
						className={"blur-[1px]"}
					/>
				))}
			</div>
		</div>
	);
};

export default LoginBackground;
