import Role from "../Schema/Role.js";
import Serie from "../Schema/Serie.js";

const getSerie = async (req, res) => {
  const { titleId } = req.body;

  // Error checking
  if (!titleId) {
    return res.status(400).json({ error: "Wrong serie title. Please provide a correct title." });
  }

  try {
    // Fetch the serie by titleId and transform into plain js object
    const serie = await Serie.findOne({ titleId }).lean();

    // If serie not found, return an error
    if (!serie) {
      return res.status(404).json({ error: "Serie not found." });
    }

    // Fetch all roles for the serie and populate the actors in one query
    const roles = await Role.find({ filmTitle: serie.title }).populate("actor").sort({ "activity.rating": -1 });

    // Attach the roles with populated actors to the serie object
    serie.roles = roles;

    // Return the serie object with populated roles
    return res.status(200).json({ serie });
  } catch (err) {
    console.error("Error fetching serie data:", err);
    return res.status(500).json({ error: "Error getting the serie data" });
  }
};

const getSeries = (req, res) => {
  const { count } = req.body;

  let countQuery = 0;

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong serie count. Please type a number" });
    countQuery = count;
  }

  Serie.find()
    .sort()
    .limit(countQuery)
    .then((series) => {
      return res.status(200).json({ series });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getSeriesByFilters = (req, res) => {
  const { count, genre, country, year } = req.body;

  let countQuery = 0;

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong serie count. Please type a number" });
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
            $eq: [{ $year: "$firstAirDate" }, Number(year)], // Extract year and compare
          },
        }),
      },
    },
  ];
  const sortQuery = {};
  sortQuery["activity.rating"] = -1;

  Serie.aggregate(findQuery)
    .limit(countQuery)
    .sort(sortQuery)
    .then((series) => {
      return res.status(200).json({ series });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getSeriesLatest = (req, res) => {
  const { sortByRating, count } = req.body;

  const findQuery = {};
  const sortQuery = {};
  let countQuery = 0;

  // Error checking
  if (sortByRating) {
    if (typeof sortByRating !== "boolean") {
      return res.status(400).json({
        error: "Wrong serie sorting value. Please type a boolean (true or false)",
      });
    }
    sortQuery["activity.rating"] = -1;
  }

  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong serie count. Please type a number" });
    countQuery = count;
  }

  const today = new Date();
  const yearAgo = new Date();
  // This is set to 2 years ago from today so it finds series that are released between 2 years ago and today
  yearAgo.setFullYear(today.getFullYear() - 2);
  findQuery.status = { $ne: "Ended" };
  findQuery.lastAirDate = { $lt: today, $gt: yearAgo };
  sortQuery["lastAirDate"] = -1;

  Serie.find(findQuery)
    .sort(sortQuery)
    .limit(countQuery)
    .then((series) => {
      return res.status(200).json({ series });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getSeriesPopular = (req, res) => {
  // NOTE: Work on this route when popular field is introduced to mongo documents
  const { sortByRating, count } = req.body;

  const sortQuery = {};
  let countQuery = 0;

  // Error checking
  if (sortByRating) {
    if (typeof sortByRating !== "boolean") {
      return res.status(400).json({
        error: "Wrong serie sorting value. Please type a boolean (true or false)",
      });
    }
    sortQuery["activity.rating"] = -1;
  }

  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong serie count. Please type a number" });
    countQuery = count;
  }
  Serie.find(findQuery)
    .sort(sortQuery)
    .limit(countQuery)
    .then((series) => {
      return res.status(200).json({ series });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getSeriesRandom = (req, res) => {
  const { count } = req.body;

  let countQuery = 0;
  let randomQuery = {};

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong serie count. Please type a number" });
    countQuery = count;
    randomQuery.size = countQuery;
  }

  Serie.aggregate([
    { $sample: { size: randomQuery.size } }, // Random sampling with limit
  ])
    .limit(countQuery)
    .then((series) => {
      return res.status(200).json({ series });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getSeriesTopRated = (req, res) => {
  const { count } = req.body;

  const sortQuery = {};
  let countQuery = 0;

  // Error checking

  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong serie count. Please type a number" });
    countQuery = count;
  }

  sortQuery["activity.rating"] = -1;

  Serie.find()
    .sort(sortQuery)
    .limit(countQuery)
    .then((series) => {
      return res.status(200).json({ series });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

// NOTE: THIS IS COPIED FROM THE MOVIES ROUTE AND NEEDS TO BE ADJUSTED CUZ THERE IS NO RELEASEDATE FIELD FOR SERIES DOCUMENTS
const getSeriesMostAnticipated = (req, res) => {
  const { count } = req.body;

  const findQuery = {};
  const sortQuery = {};
  let countQuery = 0;

  // Error checking

  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong serie count. Please type a number" });
    countQuery = count;
  }

  const today = new Date();
  findQuery.releaseDate = { $gt: today };
  sortQuery["activity.peopleAwaiting"] = -1;

  Serie.find(findQuery)
    .sort(sortQuery)
    .limit(countQuery)
    .then((series) => {
      return res.status(200).json({ series });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getSeriesUpcoming = (req, res) => {
  const { count } = req.body;

  const findQuery = {};
  const sortQuery = {};
  let countQuery = 0;

  // Error checking

  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong serie count. Please type a number" });
    countQuery = count;
  }

  const today = new Date();
  findQuery.firstAirDate = { $gt: today };
  sortQuery["firstAirDate"] = 1;

  Serie.find(findQuery)
    .sort(sortQuery)
    .limit(countQuery)
    .then((series) => {
      return res.status(200).json({ series });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};


export {
  getSerie,
  getSeries,
  getSeriesByFilters,
  getSeriesLatest,
  getSeriesMostAnticipated,
  getSeriesPopular,
  getSeriesRandom,
  getSeriesTopRated,
  getSeriesUpcoming,
}
