import Actor from "../Schema/Actor.js";

const getActor = async (req, res) => {
  const { nameId } = req.body;

  try {
    const actor = await Actor.findOne({ "personal_info.nameId": nameId })
      .populate({
        path: "roles",
        populate: {
          path: "actor",
        },
      })
      .populate({
        path: "roles",
        populate: {
          path: "movie",
        },
        options: { sort: { "activity.rating": 1 } },
      })
      .populate({
        path: "roles",
        populate: {
          path: "serie",
        },
        options: { sort: { "activity.rating": -1 } },
      });

    if (!actor) {
      return res.status(404).json({ error: "Actor not found." });
    }

    return res.status(200).json({ actor });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getActors = (req, res) => {
  const { count } = req.body;

  Actor.find()
    .limit(count)
    .then((actors) => {
      return res.status(200).json({ actors });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getActorsTopRated = (req, res) => {
  const { count } = req.body;

  const sortQuery = {};
  sortQuery["activity.rating"] = -1;

  Actor.find()
    .limit(count)
    .sort(sortQuery)
    .populate({
      path: "roles",
      select: "characterName characterBanner",
      populate: [
        { path: "movie", select: "title titleId" },
        { path: "serie", select: "title titleId" },
      ],
    })
    .then((actors) => {
      return res.status(200).json({ actors });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export {
  getActor,
  getActors,
  getActorsTopRated,
};
