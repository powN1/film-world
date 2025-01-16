import { Link } from "react-router-dom";

const SearchPoster = ({ title, img, media, link, year = null, type, setSearchModalVisible }) => {
  const renderSearchPoster = () => {
    switch (type) {
      case "poster":
        return (
          <Link to={`/${media}/${link}`} className="w-full relative group" onClick={() => setSearchModalVisible(false)}>
            <div className="h-[150px] md:h-[220px] border border-gray-400 overflow-hidden">
              <img src={img} alt={title} className="h-full w-full object-cover group-hover:scale-110 duration-700" />
            </div>
          </Link>
        );

      case "searchResult":
        return (
          <Link
            to={`/${media}/${link}`}
            onClick={() => setSearchModalVisible(false)}
            className="w-full flex-col"
          >
            <div className="flex flex-row md:flex-col gap-y-1 gap-x-2 relative group">
              <div className="h-[100px] md:h-[220px] border border-gray-400 overflow-hidden">
                <img src={img} alt={title} className="h-full w-full object-cover group-hover:scale-110 duration-700" />
              </div>
              <div className="flex flex-col gap-y-1">
                <p className="text-center">{title}</p>
                <span className="md:text-center text-xs">{year}</span>
              </div>
            </div>
            <hr className="md:hidden bg-gray-400/30 h-[1px] w-full my-3" />
          </Link>
        );

      default:
        return <article></article>;
    }
  };

  return renderSearchPoster();
};

export default SearchPoster;
