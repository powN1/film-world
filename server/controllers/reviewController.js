import Review from "../Schema/Review.js";
import User from "../Schema/User.js";
import Game from "../Schema/Game.js"
import Movie from "../Schema/Movie.js"
import Serie from "../Schema/Serie.js"

const createReview = async (req, res) => {
  const authorId = req.user;

  let { title, category, description, banner, content, referredMediaID, activity, draft, id } = req.body;

  // validation
  if (!title.length) {
    return res.status(403).json({ error: "You must provide a title" });
  }

  if (!draft) {
    if (!description.length || description.length > 80) {
      return res.status(403).json({
        error: "You must provide review description under 80 characters",
      });
    }

    if (!banner.length) {
      return res.status(403).json({
        error: "You must provide review banner in order to publish it",
      });
    }

    if (!category.length) {
      return res.status(403).json({
        error: "You must provide review category in order to publish it",
      });
    }

    if (!content.blocks.length) {
      return res.status(403).json({ error: "There must be some review content to publish it" });
    }

    if (activity.rating === 0) {
      return res.status(403).json({
        error: "You must provide review rating in order to publish it",
      });
    }
  }

  // Get movie/serie/game title
  let mediaTitle;

  try {
    if (category === "movies") {
      const media = await Movie.findOne({
        _id: new mongoose.Types.ObjectId(referredMediaID),
      });
      mediaTitle = media ? media.title : null;
    } else if (category === "series") {
      const media = await Serie.findOne({
        _id: new mongoose.Types.ObjectId(referredMediaID),
      });
      mediaTitle = media ? media.title : null;
    } else if (category === "games") {
      const media = await Game.findOne({
        _id: new mongoose.Types.ObjectId(referredMediaID),
      });
      mediaTitle = media ? media.title : null;
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }

  // Create title for the review (url)
  mediaTitle = mediaTitle
    .replace(/[^a-zA-Z0-9]/g, " ")
    .replace(/\s+/g, "-")
    .trim();
  const titleForReview = title
    .replace(/[^a-zA-Z0-9]/g, " ")
    .replace(/\s+/g, "-")
    .trim();

  let review_id = id || mediaTitle + "-" + titleForReview + nanoid();

  if (id) {
    Review.findOneAndUpdate(
      { review_id },
      {
        title,
        category,
        description,
        banner,
        content,
        referredMediaID,
        activity,
        draft: draft ? draft : false,
      }
    )
      .then(() => {
        return res.status(200).json({ id: review_id });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  } else {
    let review = new Review({
      title,
      category,
      description,
      banner,
      content,
      referredMedia: referredMediaID,
      activity,
      author: authorId,
      review_id,
      draft: Boolean(draft),
    });

    review
      .save()
      .then(async (review) => {
        let incrementVal = draft ? 0 : 1;

        User.findOneAndUpdate(
          { _id: authorId },
          {
            $inc: { "account_info.total_reviews": incrementVal },
            $push: { reviews: review._id },
          }
        )
          .then(async (_user) => {
            const collectionName = await findDocumentCollectionById(referredMediaID);
            if (collectionName === "movies") {
              Movie.findOneAndUpdate({ _id: referredMediaID }, { $push: { reviews: review._id } }).then();
            } else if (collectionName === "series") {
              Serie.findOneAndUpdate({ _id: referredMediaID }, { $push: { reviews: review._id } }).then();
            } else if (collectionName === "games") {
              Game.findOneAndUpdate({ _id: referredMediaID }, { $push: { reviews: review._id } }).then();
            }
            return res.status(200).json({ id: review.review_id });
          })
          .catch((_err) => {
            return res.status(500).json({ error: _err });
          });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  }
};

const getReview = async (req, res) => {
  const { reviewId, referredMediaId } = req.body;

  // Error checking
  if (!reviewId && !referredMediaId)
    return res.status(400).json({
      error: "Wrong review or referred media id. Please provide a correct id.",
    });

  try {
    const findQuery = reviewId ? { review_id: reviewId } : { referredMedia: referredMediaId };
    const review = await Review.findOne(findQuery).populate("author").populate("referredMedia");

    res.status(200).json({ review });
  } catch (err) {
    return res.status(500).json({ err: "Error getting the review" });
  }
};

const getReviewsMedia = async (req, res) => {
  const { count, reviewId, referredMediaId } = req.body;

  // Error checking
  if (!reviewId && !referredMediaId)
    return res.status(400).json({
      error: "Wrong review or referred media id. Please provide a correct id.",
    });

  try {
    const findQuery = reviewId ? { review_id: reviewId } : { referredMedia: referredMediaId };
    const reviews = await Review.find(findQuery).limit(count).populate("author").populate("referredMedia");

    res.status(200).json({ reviews });
  } catch (err) {
    return res.status(500).json({ err: "Error getting the review" });
  }
};

const getReviewsLatest = (req, res) => {
  const { count } = req.body;

  const sortQuery = {};
  let countQuery = 0;

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong review count. Please type a number" });
    countQuery = count;
  }

  sortQuery["publishedAt"] = -1;

  Review.find()
    .sort(sortQuery)
    .limit(countQuery)
    .populate(
      "author",
      "personal_info.firstName personal_info.surname personal_info.username personal_info.profile_img"
    )
    .populate("referredMedia", "title releaseDate firstAirDate itemType titleId")
    .then((reviews) => {
      return res.status(200).json({ reviews });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getReviewsLatestGames = (req, res) => {
  const { count } = req.body;

  const findQuery = {};
  const sortQuery = {};
  let countQuery = 0;

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong review count. Please type a number" });
    countQuery = count;
  }

  sortQuery["publishedAt"] = -1;
  findQuery.category = "games";

  Review.find(findQuery)
    .sort(sortQuery)
    .limit(countQuery)
    .populate(
      "author",
      "personal_info.firstName personal_info.surname personal_info.username personal_info.profile_img"
    )
    .populate("referredMedia", "title releaseDate firstAirDate itemType titleId")
    .then((reviews) => {
      return res.status(200).json({ reviews });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getReviewsLatestMovies = (req, res) => {
  const { count } = req.body;

  const findQuery = {};
  const sortQuery = {};
  let countQuery = 0;

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong review count. Please type a number" });
    countQuery = count;
  }

  sortQuery["publishedAt"] = -1;
  findQuery.category = "movies";

  Review.find(findQuery)
    .sort(sortQuery)
    .limit(countQuery)
    .populate(
      "author",
      "personal_info.firstName personal_info.surname personal_info.username personal_info.profile_img"
    )
    .populate("referredMedia", "title releaseDate firstAirDate itemType titleId")
    .then((reviews) => {
      return res.status(200).json({ reviews });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getReviewsLatestSeries = (req, res) => {
  const { count } = req.body;

  const findQuery = {};
  const sortQuery = {};
  let countQuery = 0;

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong review count. Please type a number" });
    countQuery = count;
  }

  sortQuery["publishedAt"] = -1;
  findQuery.category = "series";

  Review.find(findQuery)
    .sort(sortQuery)
    .limit(countQuery)
    .populate(
      "author",
      "personal_info.firstName personal_info.surname personal_info.username personal_info.profile_img"
    )
    .populate("referredMedia", "title releaseDate firstAirDate itemType titleId")
    .then((reviews) => {
      return res.status(200).json({ reviews });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getReviewsRandom = (req, res) => {
  const { count } = req.body;

  let countQuery = 0;
  let randomQuery = {};

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong review count. Please type a number" });
    countQuery = count;
    randomQuery.size = countQuery;
  }

  Review.aggregate([
    { $sample: { size: randomQuery.size } }, // Random sampling with limit
  ])
    .limit(countQuery)
    .then((reviews) => {
      return res.status(200).json({ reviews });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export {
  createReview,
  getReview,
  getReviewsMedia,
  getReviewsLatest,
  getReviewsLatestGames,
  getReviewsLatestMovies,
  getReviewsLatestSeries,
  getReviewsRandom,
};
