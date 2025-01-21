import Article from "../Schema/Article.js";
import User from "../Schema/User.js"

const createArticle = (req, res) => {
  const authorId = req.user;

  let { title, description, banner, tags, content, draft, id } = req.body;

  // validation
  if (!title.length) {
    return res.status(403).json({ error: "You must provide a title" });
  }

  if (!draft) {
    if (!description.length || description.length > 80) {
      return res.status(403).json({
        error: "You must provide article description under 80 characters",
      });
    }

    if (!banner.length) {
      return res.status(403).json({
        error: "You must provide article banner in order to publish it",
      });
    }

    if (!content.blocks.length) {
      return res.status(403).json({ error: "There must be some article content to publish it" });
    }

    if (!tags.length || tags.length > 3) {
      return res.status(403).json({
        error: "You must provide max 3 article tags in order to publish it",
      });
    }
  }

  tags = tags.map((tag) => tag.toLowerCase());

  let articleId = id || title .replace(/[^a-zA-Z0-9]/g, " ") .replace(/\s+/g, "-") .trim() + nanoid();

  if (id) {
    Article.findOneAndUpdate(
      { articleId },
      {
        title,
        description,
        banner,
        content,
        tags,
        draft: draft ? draft : false,
      }
    )
      .then(() => {
        return res.status(200).json({ id: articleId });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  } else {
    let article = new Article({
      title,
      description,
      banner,
      content,
      tags,
      author: authorId,
      articleId,
      draft: Boolean(draft),
    });

    article
      .save()
      .then((article) => {
        let incrementVal = draft ? 0 : 1;

        User.findOneAndUpdate(
          { _id: authorId },
          {
            $inc: { "account_info.total_articles": incrementVal },
            $push: { articles: article._id },
          }
        )
          .then((_user) => {
            return res.status(200).json({ id: article.articleId });
          })
          .catch((_err) => {
            return res.status(500).json({ error: "Failed to update total posts number" });
          });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  }
};

const getArticle = async (req, res) => {
  const { articleId } = req.body;

  // Error checking
  if (!articleId) return res.status(400).json({ error: "Wrong article id. Please provide a correct id." });

  try {
    const article = await Article.findOne({ articleId }).populate("author");
    res.status(200).json({ article });
  } catch (err) {
    return res.status(500).json({ err: "Error getting the article" });
  }
};

const getArticles = (req, res) => {
  const { type, count, category, random } = req.body;

  const findQuery = {};
  const sortQuery = {};
  const randomQuery = {};
  let countQuery = 0;

  // Error checking
  if (category) {
    if (category !== "movies" && category !== "series" && category !== "games") {
      return res.status(400).json({
        error: "Wrong article category. Please choose movies, series or games",
      });
    }
    findQuery.tags = category;
  }

  if (type) {
    if (type !== "latest" && category !== "popular") {
      return res.status(400).json({ error: "Wrong article type. Please choose latest or popular" });
    }
    if (type === "latest") sortQuery.publishedAt = -1;
  }
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong article count. Please type a number" });
    countQuery = count;
  }

  if (random) {
    if (random !== true && random !== false) {
      return res.status(400).json({
        error: "Wrong article random value. Please choose true of false",
      });
    }
    randomQuery.size = countQuery;

    Article.aggregate([
      { $match: findQuery }, // Apply filter
      { $sample: { size: randomQuery.size } }, // Random sampling with limit
    ])
      .then((articles) => {
        return res.status(200).json({ articles });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  } else {
    Article.find(findQuery)
      .sort(sortQuery)
      .limit(countQuery)
      .then((articles) => {
        return res.status(200).json({ articles });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  }
};

const getArticlesLatest = (req, res) => {
  const { count } = req.body;

  const sortQuery = {};
  let countQuery = 0;

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong article count. Please type a number" });
    countQuery = count;
  }

  sortQuery["publishedAt"] = -1;

  Article.find()
    .sort(sortQuery)
    .limit(countQuery)
    .populate("author", "personal_info.fullname, personal_info.profile_img")
    .then((articles) => {
      return res.status(200).json({ articles });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getArticlesLatestGames = (req, res) => {
  const { count } = req.body;

  const findQuery = {};
  const sortQuery = {};
  let countQuery = 0;

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong article count. Please type a number" });
    countQuery = count;
  }

  sortQuery["publishedAt"] = -1;
  findQuery.tags = { $in: ["games"] };

  Article.find(findQuery)
    .sort(sortQuery)
    .limit(countQuery)
    .then((articles) => {
      return res.status(200).json({ articles });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getArticlesLatestMovies = (req, res) => {
  const { count } = req.body;

  const findQuery = {};
  const sortQuery = {};
  let countQuery = 0;

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong article count. Please type a number" });
    countQuery = count;
  }

  sortQuery["publishedAt"] = -1;
  findQuery.tags = { $in: ["movies"] };

  Article.find(findQuery)
    .sort(sortQuery)
    .limit(countQuery)
    .populate("author", "personal_info.fullname, personal_info.profile_img")
    .then((articles) => {
      return res.status(200).json({ articles });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const getArticlesLatestSeries = (req, res) => {
  const { count } = req.body;

  const findQuery = {};
  const sortQuery = {};
  let countQuery = 0;

  // Error checking
  if (count) {
    if (typeof count !== "number") return res.status(400).json({ error: "Wrong article count. Please type a number" });
    countQuery = count;
  }

  sortQuery["publishedAt"] = -1;
  findQuery.tags = { $in: ["series"] };

  Article.find(findQuery)
    .sort(sortQuery)
    .limit(countQuery)
    .then((articles) => {
      return res.status(200).json({ articles });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export {
  createArticle,
  getArticle,
  getArticles,
  getArticlesLatest,
  getArticlesLatestMovies,
  getArticlesLatestSeries,
  getArticlesLatestGames,
};
