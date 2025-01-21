import Game from "../Schema/Game.js";

const getGame =  async (req, res) => {
  const { titleId } = req.body;

  // Error checking
  if (!titleId) {
    return res.status(400).json({ error: "Wrong game title. Please provide a correct title." });
  }

  try {
    // Fetch the game by titleId and transform into plain js object
    const game = await Game.findOne({ titleId }).lean();

    // If game not found, return an error
    if (!game) {
      return res.status(404).json({ error: "Game not found." });
    }

    // Return the game object with populated roles
    return res.status(200).json({ game });
  } catch (err) {
    console.error("Error fetching game data:", err);
    return res.status(500).json({ error: "Error getting the game data" });
  }
};

const getGames = (req, res) => {
  const { count } = req.body;

  let countQuery = 0;

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong game count. Please type a number" });
    countQuery = count;
  }

  Game.find()
    .sort()
    .limit(countQuery)
    .then((games) => {
      return res.status(200).json({ games });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getGamesAnticipated = (req, res) => {
  const { sortByRating, count } = req.body;

  let countQuery = 0;
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong game count. Please type a number" });
    countQuery = count;
  }

  let sortQuery = {};
  if (sortByRating) {
    if (typeof sortByRating !== "boolean") {
      return res.status(400).json({ error: "Wrong sort value. Please choose a true or false" });
    }
    sortQuery = { "activity.peopleAwaiting": -1 };
  }

  const findQuery = {};
  findQuery["activity.peopleAwaiting"] = { $exists: true };

  Game.find(findQuery)
    .sort(sortQuery)
    .limit(countQuery)
    .then((games) => {
      return res.status(200).json({ games });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getGamesByFilters = (req, res) => {
  const { count, genre, country, year } = req.body;

  let countQuery = 0;

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong game count. Please type a number" });
    countQuery = count;
  }

  const findQuery = [
    {
      $addFields: {
        genre: { $map: { input: "$genre", as: "g", in: { $toLower: "$$g" } } }, // Convert all genre elements to lowercase
      },
    },
    {
      $match: {
        ...(genre && { genre: { $in: [genre.toLowerCase()] } }), // Match lowercase genre
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

  Game.aggregate(findQuery)
    .limit(countQuery)
    .sort(sortQuery)
    .then((games) => {
      return res.status(200).json({ games });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getGamesLatest = (req, res) => {
  const { count } = req.body;

  const sortQuery = {};
  let countQuery = 0;

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong game count. Please type a number" });
    countQuery = count;
  }

  sortQuery["releaseDate"] = -1;

  Game.find()
    .sort(sortQuery)
    .limit(countQuery)
    .then((games) => {
      return res.status(200).json({ games });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getGamesRandom = (req, res) => {
  const { count } = req.body;

  let countQuery = 0;
  let randomQuery = {};

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong game count. Please type a number" });
    countQuery = count;
    randomQuery.size = countQuery;
  }

  Game.aggregate([
    { $sample: { size: randomQuery.size } }, // Random sampling with limit
  ])
    .limit(countQuery)
    .then((games) => {
      return res.status(200).json({ games });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getGamesTopRated = (req, res) => {
  const { count } = req.body;

  const findQuery = {};
  const today = new Date();
  findQuery["releaseDate"] = { $lt: today };

  const sortQuery = {};
  let countQuery = 0;

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong game count. Please type a number" });
    countQuery = count;
  }

  sortQuery["activity.rating"] = -1;

  Game.find(findQuery)
    .sort(sortQuery)
    .limit(countQuery)
    .then((games) => {
      return res.status(200).json({ games });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getGamesUpcoming =  (req, res) => {
  const { count } = req.body;

  const findQuery = {};
  const sortQuery = {};
  let countQuery = 0;

  // Error checking

  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong game count. Please type a number" });
    countQuery = count;
  }

  const today = new Date();
  findQuery.releaseDate = { $gt: today };
  sortQuery["releaseDate"] = 1;

  Game.find(findQuery)
    .sort(sortQuery)
    .limit(countQuery)
    .then((games) => {
      return res.status(200).json({ games });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};


export {
  getGame,
  getGames,
  getGamesAnticipated,
  getGamesByFilters,
  getGamesRandom,
  getGamesLatest,
  getGamesTopRated,
  getGamesUpcoming
}
