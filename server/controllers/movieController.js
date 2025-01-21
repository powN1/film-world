import Role from "../Schema/Role.js";
import Movie from "../Schema/Movie.js";

const getMovie = async (req, res) => {
  const { titleId } = req.body;

  // Error checking
  if (!titleId) {
    return res.status(400).json({ error: "Wrong movie title. Please provide a correct title." });
  }

  try {
    // Fetch the movie by titleId and transform into plain js object
    const movie = await Movie.findOne({ titleId }).lean();

    // If movie not found, return an error
    if (!movie) {
      return res.status(404).json({ error: "Movie not found." });
    }

    // Fetch all roles for the movie and populate the actors in one query
    const roles = await Role.find({ filmTitle: movie.title }).populate("actor").sort({ "activity.rating": -1 });

    // Attach the roles with populated actors to the movie object
    movie.roles = roles;

    // Return the movie object with populated roles
    return res.status(200).json({ movie });
  } catch (err) {
    console.error("Error fetching movie data:", err);
    return res.status(500).json({ error: "Error getting the movie data" });
  }
};

const getMovies = (req, res) => {
  const { count } = req.body;

  let countQuery = 0;
  let randomQuery = {};

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong movie count. Please type a number" });
    countQuery = count;
    randomQuery.size = countQuery;
  }

  Movie.find()
    .limit(countQuery)
    .then((movies) => {
      return res.status(200).json({ movies });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getMoviesByFilters = (req, res) => {
  const { count, genre, country, year } = req.body;

  let countQuery = 0;

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong movie count. Please type a number" });
    countQuery = count;
  }

  const findQuery = [
    {
      $addFields: {
        genre: { $map: { input: "$genre", as: "g", in: { $toLower: "$$g" } } }, // Convert all genre elements to lowercase
        originCountry: {
          $map: { input: "$originCountry", as: "o", in: { $toLower: "$$o" } },
        }, // Convert all countries elements to lowercase
      },
    },
    {
      $match: {
        ...(genre && { genre: { $in: [genre.toLowerCase()] } }), // Match lowercase genre
        ...(country && { originCountry: { $in: [country.toLowerCase()] } }), // Match lowercase country
        ...(year && {
          $expr: {
            $eq: [{ $year: "$releaseDate" }, Number(year)], // Extract year and compare
          },
        }),
      },
    },
  ];
  const sortQuery = {};
  sortQuery["activity.rating"] = -1;

  Movie.aggregate(findQuery)
    .limit(countQuery)
    .sort(sortQuery)
    .then((movies) => {
      return res.status(200).json({ movies });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getMoviesLatest = (req, res) => {
  const { count } = req.body;

  const findQuery = {};
  const sortQuery = {};
  let countQuery = 0;

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong movie count. Please type a number" });
    countQuery = count;
  }

  const today = new Date();
  findQuery.releaseDate = { $lt: today };
  sortQuery["releaseDate"] = -1;

  Movie.find(findQuery)
    .sort(sortQuery)
    .limit(countQuery)
    .then((movies) => {
      return res.status(200).json({ movies });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getMoviesMostAnticipated = (req, res) => {
  const { count } = req.body;

  const findQuery = {};
  const sortQuery = {};
  let countQuery = 0;

  // Error checking

  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong movie count. Please type a number" });
    countQuery = count;
  }

  const today = new Date();
  findQuery.releaseDate = { $gt: today };
  sortQuery["activity.peopleAwaiting"] = -1;

  Movie.find(findQuery)
    .sort(sortQuery)
    .limit(countQuery)
    .then((movies) => {
      return res.status(200).json({ movies });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getMoviesRandom = (req, res) => {
  const { count } = req.body;

  let countQuery = 0;
  let randomQuery = {};

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong movie count. Please type a number" });
    countQuery = count;
    randomQuery.size = countQuery;
  }

  Movie.aggregate([
    { $sample: { size: randomQuery.size } }, // Random sampling with limit
  ])
    .limit(countQuery)
    .then((movies) => {
      return res.status(200).json({ movies });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getMoviesTopRated = (req, res) => {
  const { count } = req.body;

  const sortQuery = {};
  let countQuery = 0;

  // Error checking

  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong movie count. Please type a number" });
    countQuery = count;
  }

  sortQuery["activity.rating"] = -1;

  Movie.find()
    .sort(sortQuery)
    .limit(countQuery)
    .then((movies) => {
      return res.status(200).json({ movies });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getMoviesUpcoming = (req, res) => {
  const { count } = req.body;

  const findQuery = {};
  const sortQuery = {};
  let countQuery = 0;

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong movie count. Please type a number" });
    countQuery = count;
  }

  const today = new Date();
  findQuery.releaseDate = { $gt: today };
  sortQuery["releaseDate"] = 1;

  Movie.find(findQuery)
    .sort(sortQuery)
    .limit(countQuery)
    .then((movies) => {
      return res.status(200).json({ movies });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export {
  getMovie,
  getMovies,
  getMoviesByFilters,
  getMoviesLatest,
  getMoviesMostAnticipated,
  getMoviesRandom,
  getMoviesTopRated,
  getMoviesUpcoming
}
