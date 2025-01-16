import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MediaQueriesContext, UserContext } from "../App";
import { AiOutlinePicture } from "react-icons/ai";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { IoChevronBack } from "react-icons/io5";
import axios from "axios";

const UserInfoPreview = ({ user, setUser }) => {
  const { mobileView, tabletView } = useContext(MediaQueriesContext);
  const { userAuth: { access_token, username: userAuthUsername }, } = useContext(UserContext);

  const [backgroundImageModalOn, setBackgroundImageModalOn] = useState(false);
  const [modalInputValue, setModalInputValue] = useState("");
  const [foundMedias, setFoundMedias] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [allMedias, setAllMedias] = useState([]);
  const modalInputRef = useRef(null);

  const {
    personal_info: { firstName, surname, username, profile_img, backgroundImg },
    articles,
    reviews,
    ratings,
  } = user;

  const fetchMovies = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-movies");
  const fetchSeries = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-series");
  const fetchGames = async () => await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-games");

  const handleMediaFetch = async () => {
    const movies = await fetchMovies();
    const series = await fetchSeries();
    const games = await fetchGames();
    const allMedias = [...movies.data.movies, ...series.data.series, ...games.data.games];
    const sortedAllMedias = allMedias.sort((a, b) => a.title.localeCompare(b.title));
    setAllMedias(sortedAllMedias);
  };

  const handleBackgroundModal = () => {
    setBackgroundImageModalOn((prevVal) => !prevVal);
    if (allMedias.length === 0) handleMediaFetch();
  };

  const handleInputSearch = (e) => {
    setModalInputValue(e.target.value);
  };

  const handleSearchModal = async () => {
    if (backgroundImageModalOn) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
      setModalInputValue("");
      setFoundMedias([]);
    }
  };

  const handleUserBackgroundAddition = async (photoUrl) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/add-user-background",
        { photoUrl },
        {
          headers: { Authorization: `${access_token}` },
        }
      );
      console.log(userAuthUsername, username);
      console.log(response.data);
      return response.data.userBackgroundUrl;
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserBackgroundRemoval = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/remove-user-background",
        {},
        {
          headers: { Authorization: `${access_token}` },
        }
      );
      const userFront = {
        ...user,
        personal_info: {
          ...user.personal_info,
          backgroundImg: response.data.userBackgroundUrl,
        },
      };
      setUser(userFront);
      handleBackgroundModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhotoSelection = (photo) => {
    setSelectedPhoto(photo);
    setSelectedMedia(null);
  };

  useEffect(() => {
    handleSearchModal();
    if (modalInputValue) {
      setFoundMedias(allMedias.filter((media) => media.title.toLowerCase().includes(modalInputValue)));
    }
  }, [backgroundImageModalOn, modalInputValue]);

  useEffect(() => {
    if (!selectedPhoto) return;

    const setUserBackground = async () => {
      const userPhotoData = await handleUserBackgroundAddition(selectedPhoto);
      if (userPhotoData) {
        const userFront = {
          ...user,
          personal_info: {
            ...user.personal_info,
            backgroundImg: userPhotoData,
          },
        };
        setUser(userFront);
        handleBackgroundModal();
      }
    };

    setUserBackground();
  }, [selectedPhoto]);

  return (
    <div className="w-full">
      {backgroundImageModalOn && (
        <>
          <div className="inset-0 bg-black z-20 fixed bg-opacity-50 backdrop-blur-sm"></div>
          <div className="flex flex-col gap-y-2 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-full lg:w-[35%] min-h-[55%] p-5 bg-white z-20">
            <div className="flex items-center justify-between text-xl uppercase font-sansNarrow tracking-wider">
              <h3 className="text-2xl lg:text-xl">Set image</h3>
              <div className="cursor-pointer p-1" onClick={handleBackgroundModal}>
                <IoMdClose className="text-2xl" />
              </div>
            </div>
            <p className="text-gray-500/90">Find a film from which you want to change the background to</p>
            {backgroundImg && (
              <button
                className="font-bold self-start py-1 px-2 rounded-sm bg-red-400/70"
                onClick={handleUserBackgroundRemoval}
              >
                Remove background image
              </button>
            )}
            <div className="flex flex-col gap-y-4">
              {selectedMedia ? (
                <div className="flex flex-col gap-y-4">
                  <div className="flex items-center gap-x-1 cursor-pointer" onClick={() => setSelectedMedia(null)}>
                    <IoChevronBack className="mt-[1px]" />
                    <h3 className="font-bold">{selectedMedia.title}</h3>
                  </div>
                  <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                    {selectedMedia.photos.map((photo, i) => (
                      <div
                        key={i}
                        className="h-[150px] lg:h-[140px] cursor-pointer"
                        onClick={() => handlePhotoSelection(photo)}
                      >
                        <img src={photo} alt="media photo" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative flex">
                    <input
                      type="text"
                      className="input-box pl-0 grow border-b border-gray-400 focus:border-yellow-400 duration-300 focus:[box-shadow:_2px_2px_6px_rgb(250_204_21/_15%)]"
                      placeholder="Search..."
                      ref={modalInputRef}
                      onChange={handleInputSearch}
                      value={modalInputValue}
                    />
                    <FaMagnifyingGlass
                      className={"absolute right-3 top-1/2 translate-y-[-50%] text-lg text-yellow-400 opacity-75"}
                    />
                  </div>
                  <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                    {modalInputValue &&
                      foundMedias.slice(0, mobileView ? 6 : 12).map((media, i) => {
                        return (
                          <div
                            key={i}
                            className="h-[150px] lg:h-[140px] cursor-pointer"
                            onClick={() => setSelectedMedia(media)}
                          >
                            <img src={media.cover} alt="media cover" className="w-full h-full object-cover" />
                          </div>
                        );
                      })}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
      <div className="h-[50vh] lg:w-[55%] w-full mx-auto relative text-white">
        <div
          to={""}
          style={{
            backgroundImage: `linear-gradient(to bottom ,rgba(0,0,0,1) 2%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 98%), ${mobileView ? "" : "linear-gradient(to right, rgba(0,0,0,1) 5%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 95%),"} url(${user.personal_info.backgroundImg})`,
          }}
          className="h-full w-full block bg-cover bg-center bg-no-repeat transition-opactiy duration-500 "
        ></div>
        {userAuthUsername === username && (
          <button
            className="flex items-center gap-x-2 absolute top-5 lg:top-0 right-1/2 translate-x-1/2 lg:right-0 lg:trsnalte-x-0 hover:text-yellow-400 duration-200 cursor-pointer"
            onClick={handleBackgroundModal}
          >
            <AiOutlinePicture className="text-xl mt-[1px]" />
            <p className="whitespace-nowrap">Change background image</p>
          </button>
        )}
        <div className="w-full absolute left-1/2 lg:left-0 bottom-[50%] translate-y-[50%] translate-x-[-50%] lg:translate-x-[0] px-3 md:px-12 lg:px-0 flex flex-col items-center lg:flex-row gap-x-6 gap-y-1 lg:gap-y-2 transition-opacity duration-500">
          <div className="h-[160px] w-[160px] lg:h-[120px] lg:w-[120px] rounded-full border border-gray-400 p-1">
            <img src={profile_img} alt="user image" className="w-full h-full object-cover rounded-full" />{" "}
          </div>
          <div className="flex flex-col gap-y-1">
            <h2 className="font-bold text-5xl capitalize font-sansNarrow">
              {firstName} {surname}{" "}
            </h2>
            <p className="text-center lg:text-left">{username}</p>
          </div>
        </div>

        {(articles || reviews || ratings) && (
          <div className="w-full flex items-center justify-evenly z-10 md:justify-center md:gap-x-6 absolute left-0 bottom-0 translate-y-[50%] h-[60px] lg:rounded-md bg-white [box-shadow:_2px_2px_6px_rgb(0_0_0_/_15%)] text-black">
            {articles && (
              <>
                <Link
                  to="texts"
                  state={{ category: "articles" }}
                  className="capitalize hover:bg-gray-400/40 py-1 px-4 cursor-pointer flex flex-col items-center lg:flex-row gap-x-1"
                >
                  articles <span className="font-bold">{articles.length}</span>{" "}
                </Link>
                <span className="w-[1px] h-3/4 bg-gray-400/30 first:hidden last:hidden"></span>
              </>
            )}
            {reviews && (
              <>
                <Link
                  to="texts"
                  state={{ category: "reviews" }}
                  className="capitalize hover:bg-gray-400/40 py-1 px-4 cursor-pointer flex flex-col items-center lg:flex-row gap-x-1"
                >
                  reviews <span className="font-bold">{reviews.length}</span>{" "}
                </Link>

                <span className="w-[1px] h-3/4 bg-gray-400/30 first:hidden last:hidden"></span>
              </>
            )}
            {ratings && (
              <>
                <Link
                  to="details"
                  className="capitalize hover:bg-gray-400/40 py-1 px-4 cursor-pointer flex flex-col items-center lg:flex-row gap-x-1"
                >
                  ratings <span className="font-bold">{ratings.length}</span>{" "}
                </Link>
                <span className="w-[1px] h-3/4 bg-gray-400/30 first:hidden last:hidden"></span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfoPreview;
