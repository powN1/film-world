import { useContext } from "react";
import { Link } from "react-router-dom";
import { ArticlesPageContext } from "../pages/ArticlesPage";

const categories = [{ title: "movies" }, { title: "series" }, { title: "games" }];

const ArticlesReviewsCategories = ({ type, currentCategory, setCurrentCategory }) => {

  const handleShowUnderline = (e) => {
    const category = e.target.innerText.toLowerCase();

    if (category !== currentCategory) setCurrentCategory(category);
  };

  return (
    <>
      <div className="w-full border-t border-gray-400/20">
        <div className="w-full lg:w-[55%] mx-auto flex flex-col gap-y-2">
          <div className="flex flex-col items-center px-2 lg:px-0">
            <h2 className="text-4xl text-center tracking-wide font-sansNarrow text-white py-5 capitalize">{type}</h2>
            {/* Categories */}
            <button className="flex items-center flex-wrap justify-center gap-x-8 cursor-pointer text-white">
              {categories.map((category, i) => {
                return (
                  <li key={i} className="list-none">
                    <div
                      className={
                        "block px-3 py-2 relative duration-300 after:content-[''] after:z-10 after:absolute after:bottom-0 after:h-[3px] after:bg-yellow-400 after:duration-300 after:transition-[width_left] capitalize " +
                        (currentCategory === category.title.toLowerCase()
                          ? "after:w-[100%] after:left-0 "
                          : "after:w-[0%] after:left-[50%] text-gray-400 hover:text-white")
                      }
                      onClick={handleShowUnderline}
                    >
                      {category.title}
                    </div>
                  </li>
                );
              })}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticlesReviewsCategories;
