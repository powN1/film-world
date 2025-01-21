import Role from "../Schema/Role.js";

const getRoles = (req, res) => {
  const { count } = req.body;

  Role.find()
    .limit(count)
    .populate("actor", "activity personal_info.name personal_info.nameId")
    .populate("movie", "title titleId year")
    .populate("serie", "title firstAirDate")
    .then((roles) => {
      return res.status(200).json({ roles });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

const getRolesMovie = (req, res) => {
  const { count } = req.body;

  const findQuery = {};
  findQuery.movie = { $exists: true };

  Role.find(findQuery)
    .limit(count)
    .populate("actor", "activity personal_info.name personal_info.nameId")
    .populate("movie", "title titleId releaseDate")
    .then((roles) => {
      return res.status(200).json({ roles });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

const getRolesMovieTopRated = (req, res) => {
  const { count } = req.body;

  const findQuery = {};
  findQuery.movie = { $exists: true };

  const sortQuery = {};
  sortQuery["activity.rating"] = -1;

  Role.find(findQuery)
    .limit(count)
    .sort(sortQuery)
    .populate("actor", "activity personal_info.name personal_info.nameId banner")
    .populate("movie", "title titleId releaseDate")
    .then((roles) => {
      return res.status(200).json({ roles });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

const getRolesMovieTopRatedFemale = async (req, res) => {
  const { count } = req.body;
  const limit = Number(count) || 5;

  try {
    const roles = await Role.aggregate([
      // Step 1: Match roles that have a movie associated
      { $match: { movie: { $exists: true } } },

      // Step 2: Populate actor data
      {
        $lookup: {
          from: "actors",
          localField: "actor",
          foreignField: "_id",
          as: "actor",
        },
      },
      // Step 3: Filter for male actors
      { $unwind: "$actor" },
      { $match: { "actor.personal_info.sex": "female" } },

      // Step 4: Populate movie data
      {
        $lookup: {
          from: "movies",
          localField: "movie",
          foreignField: "_id",
          as: "movie",
        },
      },
      { $unwind: "$movie" },

      // Step 5: Sort by role rating
      { $sort: { "activity.rating": -1 } },

      // Step 6: Limit to the requested count
      { $limit: limit },

      // Step 7: Project specific fields from Role, actor, and movie
      {
        $project: {
          // Fields from Role document
          _id: 1, // Role ID
          characterName: 1,
          characterBanner: 1,
          activity: 1,

          // Specific fields from actor document
          "actor.personal_info.name": 1,
          "actor.personal_info.nameId": 1,
          "actor.banner": 1,
          "actor.activity.rating": 1,

          // Specific fields from movie document
          "movie.title": 1,
          "movie.titleId": 1,
          "movie.releaseDate": 1,
        },
      },
    ]);

    return res.status(200).json({ roles });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getRolesMovieTopRatedMale = async (req, res) => {
  const { count } = req.body;
  const limit = Number(count) || 5;

  try {
    const roles = await Role.aggregate([
      // Step 1: Match roles that have a movie associated
      { $match: { movie: { $exists: true } } },

      // Step 2: Populate actor data
      {
        $lookup: {
          from: "actors",
          localField: "actor",
          foreignField: "_id",
          as: "actor",
        },
      },
      // Step 3: Filter for male actors
      { $unwind: "$actor" },
      { $match: { "actor.personal_info.sex": "male" } },

      // Step 4: Populate movie data
      {
        $lookup: {
          from: "movies",
          localField: "movie",
          foreignField: "_id",
          as: "movie",
        },
      },
      { $unwind: "$movie" },

      // Step 5: Sort by role rating
      { $sort: { "activity.rating": -1 } },

      // Step 6: Limit to the requested count
      { $limit: limit },

      // Step 7: Project specific fields from Role, actor, and movie
      {
        $project: {
          // Fields from Role document
          _id: 1, // Role ID
          characterName: 1,
          characterBanner: 1,
          activity: 1,

          // Specific fields from actor document
          "actor.personal_info.name": 1,
          "actor.personal_info.nameId": 1,
          "actor.banner": 1,
          "actor.activity.rating": 1,

          // Specific fields from movie document
          "movie.title": 1,
          "movie.titleId": 1,
          "movie.releaseDate": 1,
        },
      },
    ]);

    return res.status(200).json({ roles });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getRolesSerie = (req, res) => {
  const { count } = req.body;

  const findQuery = {};
  findQuery.serie = { $exists: true };

  Role.find(findQuery)
    .limit(count)
    .populate("actor", "banner activity personal_info.name personal_info.nameId")
    .populate("serie", "title firstAirDate")
    .then((roles) => {
      return res.status(200).json({ roles });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

const getRolesSerieTopRated = (req, res) => {
  const { count } = req.body;

  const findQuery = {};
  findQuery.serie = { $exists: true };

  const sortQuery = {};
  sortQuery["activity.rating"] = -1;

  Role.find(findQuery)
    .limit(count)
    .sort(sortQuery)
    .populate("actor", "banner activity personal_info.name personal_info.nameId")
    .populate("serie", "title titleId firstAirDate")
    .then((roles) => {
      return res.status(200).json({ roles });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

const getRolesSerieTopRatedFemale = async (req, res) => {
  const { count } = req.body;
  const limit = Number(count) || 5;

  try {
    const roles = await Role.aggregate([
      // Step 1: Match roles that have a movie associated
      { $match: { serie: { $exists: true } } },

      // Step 2: Populate actor data
      {
        $lookup: {
          from: "actors",
          localField: "actor",
          foreignField: "_id",
          as: "actor",
        },
      },
      // Step 3: Filter for male actors
      { $unwind: "$actor" },
      { $match: { "actor.personal_info.sex": "female" } },

      // Step 4: Populate movie data
      {
        $lookup: {
          from: "series",
          localField: "serie",
          foreignField: "_id",
          as: "serie",
        },
      },
      { $unwind: "$serie" },

      // Step 5: Sort by role rating
      { $sort: { "activity.rating": -1 } },

      // Step 6: Limit to the requested count
      { $limit: limit },

      // Step 7: Project specific fields from Role, actor, and movie
      {
        $project: {
          // Fields from Role document
          _id: 1, // Role ID
          characterName: 1,
          characterBanner: 1,
          activity: 1,

          // Specific fields from actor document
          "actor.banner": 1,
          "actor.personal_info.name": 1,
          "actor.personal_info.nameId": 1,
          "actor.activity.rating": 1,

          // Specific fields from movie document
          "serie.title": 1,
          "serie.titleId": 1,
          "serie.firstAirDate": 1,
        },
      },
    ]);

    return res.status(200).json({ roles });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getRolesSerieTopRatedMale = async (req, res) => {
  const { count } = req.body;
  const limit = Number(count) || 5;

  try {
    const roles = await Role.aggregate([
      // Step 1: Match roles that have a movie associated
      { $match: { serie: { $exists: true } } },

      // Step 2: Populate actor data
      {
        $lookup: {
          from: "actors",
          localField: "actor",
          foreignField: "_id",
          as: "actor",
        },
      },
      // Step 3: Filter for male actors
      { $unwind: "$actor" },
      { $match: { "actor.personal_info.sex": "male" } },

      // Step 4: Populate movie data
      {
        $lookup: {
          from: "series",
          localField: "serie",
          foreignField: "_id",
          as: "serie",
        },
      },
      { $unwind: "$serie" },

      // Step 5: Sort by role rating
      { $sort: { "activity.rating": -1 } },

      // Step 6: Limit to the requested count
      { $limit: limit },

      // Step 7: Project specific fields from Role, actor, and movie
      {
        $project: {
          // Fields from Role document
          _id: 1, // Role ID
          characterName: 1,
          characterBanner: 1,
          activity: 1,

          // Specific fields from actor document
          "actor.personal_info.name": 1,
          "actor.personal_info.nameId": 1,
          "actor.banner": 1,
          "actor.activity.rating": 1,

          // Specific fields from movie document
          "serie.title": 1,
          "serie.titleId": 1,
          "serie.firstAirDate": 1,
        },
      },
    ]);

    return res.status(200).json({ roles });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export {
  getRoles,
  getRolesMovie,
  getRolesMovieTopRated,
  getRolesMovieTopRatedMale,
  getRolesMovieTopRatedFemale,
  getRolesSerie,
  getRolesSerieTopRated,
  getRolesSerieTopRatedMale,
  getRolesSerieTopRatedFemale,
};
