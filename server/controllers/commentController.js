import Comment from "../Schema/Comment.js";
import Movie from "../Schema/Movie.js";
import Serie from "../Schema/Serie.js";
import Game from "../Schema/Game.js";
import Article from "../Schema/Article.js";
import Review from "../Schema/Review.js";

const addComment = async (req, res) => {
  const userId = req.user;

  const { type, mediaId, mediaAuthor, comment, replyingTo } = req.body;

  if (!comment.length) {
    res.status(403).json({ error: "Write something to leave a comment" });
  }

  if (!type) {
    return res.status(403).json({
      error: "Please specify what is the comment for (movie, serie, game, article or review)",
    });
  } else {
    if (type !== "movie" && type !== "serie" && type !== "game" && type !== "article" && type !== "review") {
      return res.status(403).json({
        error: `Invalid type. Choose "movie", "serie", "game", "article" or "review"`,
      });
    }
  }

  const mediaType = type + "s";

  const commentObj = {
    mediaId: mediaId,
    mediaAuthor,
    mediaType,
    comment,
    commentedBy: userId,
  };

  if (replyingTo) {
    commentObj.parent = replyingTo;
    commentObj.isReply = true;
  }

  const commentRes = await new Comment(commentObj).save();
  const { comment: commentFromRes, commentedAt, children } = commentRes;

  const mediaModels = {
    movie: Movie,
    serie: Serie,
    game: Game,
    article: Article,
    review: Review,
  };

  const MediaModel = mediaModels[type];
  await MediaModel.findOneAndUpdate(
    { _id: mediaId },
    {
      $push: { comments: commentRes._id },
      $inc: {
        "activity.totalComments": 1,
        "activity.totalParentComments": replyingTo ? 0 : 1,
      },
    }
  );

  if (replyingTo) {
    await Comment.findOneAndUpdate({ _id: replyingTo }, { $push: { children: commentRes._id } });
  }

  return res.status(200).json({
    comment: commentFromRes,
    commentedAt,
    _id: commentRes._id,
    userId,
    children,
  });
};

const getMediaComments = (req, res) => {
  const { mediaId, skip } = req.body;

  const maxLimit = 5;

  Comment.find({ mediaId })
    .populate(
      "commentedBy",
      "personal_info.username personal_info.firstName personal_info.surname personal_info.profile_img"
    )
    .skip(skip)
    .limit(maxLimit)
    .sort({ commentedAt: -1 })
    .then((comment) => {
      return res.status(200).json(comment);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

const getReplies = async (req, res) => {
  const { _id, skip } = req.body;

  const maxLimit = 5;

  try {
    const doc = await Comment.findOne({ _id })
      .populate({
        path: "children",
        options: {
          limit: maxLimit,
          skip: skip,
          sort: { commentedAt: -1 },
        },
        populate: {
          path: "commentedBy",
          select: "personal_info.profile_img personal_info.firstName personal_info.surname personal_info.username",
        },
        select: "-movieId -serieId -gameId -articleId -reviewId -updatedAt",
      })
      .select("children");

    return res.status(200).json({ replies: doc.children });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export {
  addComment,
  getMediaComments,
  getReplies,
}
