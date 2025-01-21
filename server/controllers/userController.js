import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getAuth } from "firebase-admin/auth";
import { uploadFileToAWSfromUrl } from "../utils/awsFunctions.js"
import User from "../Schema/User.js";
import Movie from "../Schema/Movie.js";
import Serie from "../Schema/Serie.js";
import Game from "../Schema/Game.js";
import Comment from "../Schema/Comment.js";
import Article from "../Schema/Article.js";
import Review from "../Schema/Review.js";

// Regex for identifying whether the email and password are correctly formatted
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

// Local functions
const deleteComments = async (_id) => {
  try {
    const comment = await Comment.findOneAndDelete({ _id });

    if (comment.parent) {
      await Comment.findOneAndUpdate({ _id: comment.parent }, { $pull: { children: _id } });
    }
    const mediaModels = {
      movies: Movie,
      series: Serie,
      games: Game,
      articles: Article,
      reviews: Review,
    };

    const MediaModel = mediaModels[comment.mediaType];

    await MediaModel.findOneAndUpdate(
      { _id: comment.mediaId },
      {
        $pull: { comments: _id },
        $inc: {
          "activity.totalComments": -1,
          "activity.totalParentComments": comment.parent ? 0 : -1,
        },
      }
    );

    if (comment.children.length) {
      comment.children.map((replies) => {
        deleteComments(replies);
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const generateUsername = async (email) => {
  let username = email.split("@")[0];

  let usernameExists = await User.exists({
    "personal_info.username": username,
  }).then((res) => res);

  usernameExists ? (username += nanoid().substring(0, 5)) : "";

  return username;
};

const formatDataToSend = (user) => {
  const access_token = jwt.sign({ id: user._id, admin: user.admin }, process.env.JWT_SECRET_ACCESS_KEY);

  return {
    access_token,
    admin: user.admin,
    profile_img: user.personal_info.profile_img,
    firstName: user.personal_info.firstName,
    surname: user.personal_info.surname,
    username: user.personal_info.username,
  };
};

// Routes
const addFavorite = async (req, res) => {
  const userId = req.user;

  let { mediaId, type } = req.body;

  if (!mediaId) {
    return res.status(403).json({ error: "Please choose movie, serie or game to rate" });
  }
  if (!type) {
    return res.status(403).json({
      error: "Please specify what is the like for (movie, serie or game)",
    });
  } else {
    if (type !== "movie" && type !== "serie" && type !== "game") {
      return res.status(403).json({ error: `Invalid type. Choose "movie", "serie" or "game"` });
    }
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const mediaModels = {
      movie: Movie,
      serie: Serie,
      game: Game,
    };

    const MediaModel = mediaModels[type];
    const media = await MediaModel.findById(mediaId);

    if (!media) return res.status(404).json({ error: `No ${type} found with this ID` });

    const existingLikeIndex = user.favoriteMedias.findIndex((media) => media.item_id.toString() === mediaId);

    if (existingLikeIndex !== -1) {
      // If the user has already liked
      user.favoriteMedias = user.favoriteMedias.filter((media) => media.item_id.toString() !== mediaId);
      await user.save();

      res.status(200).json({ isLiked: false });
    } else {
      const likeEntry = {
        item_id: media._id,
        itemType: type === "movie" ? "movies" : type === "serie" ? "series" : type === "game" ? "games" : null,
        timestamp: new Date(),
      };

      user.favoriteMedias.push(likeEntry);
      await user.save();

      res.status(200).json({ isLiked: true });
    }
  } catch (err) {
    res.status(500).json({ error: "An error occurred while processing the like" });
  }
};

const addRating = async (req, res) => {
  const userId = req.user;

  let { mediaId, type, userRating, reviewText } = req.body;

  if (!mediaId) {
    return res.status(403).json({ error: "Please choose movie, serie or game to rate" });
  }
  if (!type) {
    return res.status(403).json({
      error: "Please specify what is the rating for (movie, serie or game)",
    });
  } else {
    if (type !== "movie" && type !== "serie" && type !== "game") {
      return res.status(403).json({ error: `Invalid type. Choose "movie", "serie" or "game"` });
    }
  }
  if (!userRating || userRating > 10 || userRating < 1) {
    return res.status(403).json({ error: "Please select a rating from 1 to 10" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const mediaModels = {
      movie: Movie,
      serie: Serie,
      game: Game,
    };

    const MediaModel = mediaModels[type];
    const media = await MediaModel.findById(mediaId);

    if (!media) return res.status(404).json({ error: `No ${type} found with this ID` });

    const existingRating = user.ratings.find((rating) => rating.item_id.toString() === mediaId);

    // Calculate new rating for the movie/serie/game
    const { rating: currentRating, ratedByCount } = media.activity;
    let newRating;

    if (existingRating) {
      // If the user has already rated, update the rating
      const oldUserRating = existingRating.rating;
      existingRating.rating = userRating;
      existingRating.reviewText = reviewText || existingRating.reviewText;
      existingRating.timestamp = new Date();

      // Recalculate the average by replacing old rating with new one
      newRating = (currentRating * ratedByCount - oldUserRating + userRating) / ratedByCount;

      media.activity.rating = newRating;
      await media.save();
      await user.save();

      res.status(200).json({ rating: existingRating });
    } else {
      newRating = (currentRating * ratedByCount + userRating) / (ratedByCount + 1);
      media.activity.ratedByCount = ratedByCount + 1;

      const ratingEntry = {
        item_id: media._id,
        itemType: type === "movie" ? "movies" : type === "serie" ? "series" : type === "game" ? "games" : null,
        rating: userRating,
        reviewText: reviewText || "",
        timestamp: new Date(),
      };

      media.activity.rating = newRating;
      user.ratings.push(ratingEntry);

      await media.save();
      await user.save();

      res.status(200).json({ rating: ratingEntry });
    }
  } catch (err) {
    res.status(500).json({ error: "An error occurred while processing the rating" });
  }
};

const addUserBackground = async (req, res) => {
  const userId = req.user;

  let { photoUrl } = req.body;

  if (!photoUrl) {
    return res.status(403).json({ error: "Please provie photo url to change user background" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.personal_info.backgroundImg = photoUrl;
    await user.save();

    res.status(200).json({ userBackgroundSet: true, userBackgroundUrl: photoUrl });
  } catch (err) {
    res.status(500).json({
      error: "An error occurred while processing user's background image",
    });
  }
};

const addWantToSee = async (req, res) => {
  const userId = req.user;
  console.log(userId)

  let { mediaId, type } = req.body;

  if (!mediaId) {
    return res.status(403).json({ error: "Please choose movie, serie or game to rate" });
  }
  if (!type) {
    return res.status(403).json({
      error: "Please specify what is the like for (movie, serie or game)",
    });
  } else {
    if (type !== "movie" && type !== "serie" && type !== "game") {
      return res.status(403).json({ error: `Invalid type. Choose "movie", "serie" or "game"` });
    }
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: `User not found` });

    const mediaModels = {
      movie: Movie,
      serie: Serie,
      game: Game,
    };

    const MediaModel = mediaModels[type];
    const media = await MediaModel.findById(mediaId);

    if (!media) return res.status(404).json({ error: `No ${type} found with this ID` });

    const existingWantToSeeIndex = user.wantToSeeMedias.findIndex((media) => media.item_id.toString() === mediaId);

    if (existingWantToSeeIndex !== -1) {
      // If the user has already liked
      user.wantToSeeMedias = user.wantToSeeMedias.filter((media) => media.item_id.toString() !== mediaId);
      await user.save();

      res.status(200).json({ wantToSee: false });
    } else {
      const wantToSeeEntry = {
        item_id: media._id,
        itemType: type === "movie" ? "movies" : type === "serie" ? "series" : type === "game" ? "games" : null,
        timestamp: new Date(),
      };

      user.wantToSeeMedias.push(wantToSeeEntry);
      await user.save();

      res.status(200).json({ wantToSee: true });
    }
  } catch (err) {
    res.status(500).json({ error: "An error occurred while processing the like" });
  }
};


const deleteComment = async (req, res) => {
  const userId = req.user;

  const { _id } = req.body;

  const comment = await Comment.findOne({ _id });

  if (userId == comment.commentedBy || userId == comment.mediaAuthor) {
    deleteComments(_id);
    return res.status(200).json({ status: "Comment deleted" });
  } else {
    return res.status(403).json({ error: "You cannot delete this comment" });
  }
};

const checkRating = async (req, res) => {
  const userId = req.user;
  const { mediaId } = req.body;

  if (!mediaId) {
    return res.status(400).json({ error: "Please provide both mediaId and type" });
  }

  try {
    // Query to check if the user has rated this specific media item
    const user = await User.findOne({
      _id: userId,
      ratings: {
        $elemMatch: { item_id: mediaId },
      },
    });

    if (user) {
      // User has rated this movie, series, or game
      const rating = user.ratings.find((rating) => rating.item_id.toString() === mediaId);
      const { rating: userRating, reviewText, timestamp } = rating;
      res.status(200).json({
        hasRated: true,
        rating: { rating: userRating, reviewText, timestamp },
      });
    } else {
      // User has not rated this item
      res.status(200).json({ hasRated: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while checking the rating" });
  }
};

const checkFavorite = async (req, res) => {
  const userId = req.user;
  const { mediaId } = req.body;

  if (!mediaId) {
    return res.status(400).json({ error: "Please provide both mediaId and type" });
  }

  try {
    // Query to check if the user has rated this specific media item
    const user = await User.findOne({
      _id: userId,
      favoriteMedias: { $elemMatch: { item_id: mediaId } },
    });

    if (user) {
      // User has rated this movie, series, or game
      const like = user.favoriteMedias.find((media) => media.item_id.toString() === mediaId);
      const liked = like ? true : false;
      res.status(200).json({ isLiked: liked });
    } else {
      // User has not rated this item
      res.status(200).json({ isLiked: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while checking the rating" });
  }
};

const checkWantToSee = async (req, res) => {
  const userId = req.user;
  const { mediaId } = req.body;

  if (!mediaId) {
    return res.status(400).json({ error: "Please provide both mediaId and type" });
  }

  try {
    // Query to check if the user has rated this specific media item
    const user = await User.findOne({
      _id: userId,
      wantToSeeMedias: { $elemMatch: { item_id: mediaId } },
    });

    if (user) {
      // User has rated this movie, series, or game
      const wantToSee = user.wantToSeeMedias.find((media) => media.item_id.toString() === mediaId);
      const wantToSeeBool = wantToSee ? true : false;
      res.status(200).json({ wantToSee: wantToSeeBool });
    } else {
      // User has not rated this item
      res.status(200).json({ wantToSee: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while checking the rating" });
  }
};

const getUser = async (req, res) => {
  const { userId } = req.body;

  // Error checking
  if (!userId) return res.status(400).json({ error: "Wrong user id. Please provide a correct id." });

  try {
    const user = await User.findOne({ "personal_info.username": userId })
      .populate("articles")
      .populate("ratings")
      .populate("favoriteMedias")
      .populate("wantToSeeMedias")
      .populate({
        path: "reviews",
        populate: {
          path: "referredMedia", // Assuming referredMedia contains the ObjectId
        },
      });

    const populatedRatings = await Promise.all(
      user.ratings.map(async (rating) => {
        let populatedItem;

        // Dynamically query the appropriate model based on `itemType`
        switch (rating.itemType) {
          case "movies":
            populatedItem = await Movie.findById(rating.item_id);
            break;
          case "series":
            populatedItem = await Serie.findById(rating.item_id);
            break;
          case "games":
            populatedItem = await Game.findById(rating.item_id);
            break;
          default:
            return rating; // Return unmodified if itemType is invalid
        }

        // Return a new object with the populated item
        return {
          ...rating.toObject(), // Convert to plain object if necessary
          item: populatedItem, // Add the populated item as a new field
        };
      })
    );

    const populatedFavorite = await Promise.all(
      user.favoriteMedias.map(async (media) => {
        let populatedItem;

        // Dynamically query the appropriate model based on `itemType`
        switch (media.itemType) {
          case "movies":
            populatedItem = await Movie.findById(media.item_id);
            break;
          case "series":
            populatedItem = await Serie.findById(media.item_id);
            break;
          case "games":
            populatedItem = await Game.findById(media.item_id);
            break;
          default:
            return media; // Return unmodified if itemType is invalid
        }

        // Return a new object with the populated item
        return {
          ...media.toObject(), // Convert to plain object if necessary
          item: populatedItem, // Add the populated item as a new field
        };
      })
    );

    const populatedWantToSee = await Promise.all(
      user.wantToSeeMedias.map(async (media) => {
        let populatedItem;

        // Dynamically query the appropriate model based on `itemType`
        switch (media.itemType) {
          case "movies":
            populatedItem = await Movie.findById(media.item_id);
            break;
          case "series":
            populatedItem = await Serie.findById(media.item_id);
            break;
          case "games":
            populatedItem = await Game.findById(media.item_id);
            break;
          default:
            return media; // Return unmodified if itemType is invalid
        }

        // Return a new object with the populated item
        return {
          ...media.toObject(), // Convert to plain object if necessary
          item: populatedItem, // Add the populated item as a new field
        };
      })
    );

    const userObj = {
      ...user.toObject(),
      ratings: populatedRatings,
      favoriteMedias: populatedFavorite,
      wantToSeeMedias: populatedWantToSee,
    };

    res.status(200).json({ user: userObj });

  } catch (err) {
    return res.status(500).json({ err: "Error getting the user data" });
  }
};

const googleAuth = async (req, res) => {
  let { access_token } = req.body;

  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      let { email, name, picture } = decodedUser;

      picture = picture.replace("s96-c", "s384-c");

      let user = await User.findOne({ "personal_info.email": email })
        .select(
          "personal_info.firstName personal_info.surname personal_info.username personal_info.profile_img google_auth admin"
        )
        .then((u) => {
          return u || null;
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });

      if (user) {
        //login
        if (!user.google_auth) {
          return res.status(403).json({
            error: "This email was signed up without google. Please log in with password to access the account.",
          });
        }
      } else {
        //signup
        let username = await generateUsername(email);

        const splitName = name.trim().split(" ");
        const firstName = splitName[0];
        const surname = splitName[1];

        // Download the picture from Google
        const awsImageUrl = await uploadFileToAWSfromUrl(picture);

        user = new User({
          personal_info: {
            firstName,
            surname,
            email,
            username,
            profile_img: awsImageUrl,
          },
          // personal_info: { firstName, surname, email, username },
          google_auth: true,
        });

        await user
          .save()
          .then((u) => {
            user = u;
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });
      }
      return res.status(200).json(formatDataToSend(user));
    })
    .catch((_err) => {
      return res.status(500).json({
        error: "Failed to authenticate with google. Try other account.",
      });
    });
};

const facebookAuth = async (req, res) => {
  let { access_token, facebook_access_token } = req.body;

  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      let { email, name, picture } = decodedUser;

      picture = picture.replace("s96-c", "s384-c");

      let user = await User.findOne({ "personal_info.email": email })
        .select(
          "personal_info.firstName personal_info.surname personal_info.username personal_info.profile_img facebook_auth admin"
        )
        .then((u) => {
          return u || null;
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });

      if (user) {
        //login
        if (!user.facebook_auth) {
          return res.status(403).json({
            error: "This email was signed up without facebook. Please log in with password to access the account.",
          });
        }
      } else {
        //signup
        let username = await generateUsername(email);

        const splitName = name.trim().split(" ");
        const firstName = splitName[0];
        const surname = splitName[1];

        // Make the request to the Facebook Graph API
        const url = `https://graph.facebook.com/me?fields=id,name,picture.type(large)&access_token=${facebook_access_token}`;
        const facebookPictureRequest = await fetch(url);
        const facebookResponse = await facebookPictureRequest.json();
        const picture = facebookResponse.picture.data.url;

        const awsImageUrl = await uploadFileToAWSfromUrl(picture);

        // TODO: Get the picture from google or facebook and upload it to S3 AWS server so you don't
        // TODO: use the external link therefore you won't run into avatar not being rendered because the external api throws
        // TODO:too many requests error

        user = new User({
          personal_info: {
            firstName,
            surname,
            email,
            username,
            profile_img: awsImageUrl,
          },
          facebook_auth: true,
        });

        await user
          .save()
          .then((u) => {
            user = u;
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });
      }
      return res.status(200).json(formatDataToSend(user));
    })
    .catch((_err) => {
      return res.status(500).json({
        error: "Failed to authenticate with facebook. Try other methods.",
      });
    });
};

const removeRating = async (req, res) => {
  const userId = req.user;

  let { mediaId, type } = req.body;

  if (!mediaId) {
    return res.status(403).json({ error: "Please choose movie, serie or game to rate" });
  }

  try {
    const mediaModels = {
      movie: Movie,
      series: Serie,
      game: Game,
    };

    const MediaModel = mediaModels[type];
    const media = await MediaModel.findById(mediaId);

    if (!media) return res.status(404).json({ error: `No ${type} found with this ID` });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const existingRating = user.ratings.find((rating) => rating.item_id.toString() === mediaId);
    const userRating = existingRating.rating;

    const { rating, ratedByCount } = media.activity;

    const newMediaRating = (rating * ratedByCount - userRating) / (ratedByCount - 1);
    media.activity.rating = newMediaRating;
    media.activity.ratedByCount = ratedByCount - 1;

    await media.save();

    // Remove the rating from the user's ratings array using $pull
    await User.updateOne({ _id: userId }, { $pull: { ratings: { item_id: mediaId } } });

    res.status(200).json({ message: `User rating deleted successfully` });

    return;
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeUserBackground = async (req, res) => {
  const userId = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.personal_info.backgroundImg = undefined;
    await user.save();

    res.status(200).json({ userBackgroundSet: true, userBackgroundUrl: false });
  } catch (err) {
    res.status(500).json({
      error: "An error occurred while processing user's background image",
    });
  }
};
const signIn = (req, res) => {
  let { email, password } = req.body;

  User.findOne({ "personal_info.email": email })
    .then((user) => {
      if (!user) {
        return res.status(403).json({ error: "Email not found" });
      }

      if (!user.google_auth) {
        bcrypt.compare(password, user.personal_info.password, (err, result) => {
          if (err) {
            return res.status(403).json({
              error: "Error occured while logging in. Please try again.",
            });
          }

          if (!result) {
            return res.status(403).json({ error: "Incorrect password" });
          } else {
            return res.status(200).json(formatDataToSend(user));
          }
        });
      } else {
        return res.status(403).json({
          error: "Account was created using google. Try logging in with google.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.message });
    });
};

const signUp = (req, res) => {
  const { firstName, surname, username, email, password } = req.body;

  if (firstName.length < 2) {
    return res.status(403).json({ error: "First name must be at least 2 letters long" });
  }
  if (surname.length < 3) {
    return res.status(403).json({ error: "Surname must be at least 3 letters long" });
  }
  if (username.length < 3) {
    return res.status(403).json({ error: "Username must be at least 3 letters long" });
  }
  if (!email.length) {
    return res.status(403).json({ error: "Enter email" });
  }
  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Email is invalid" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error: "Password should be 6-20 characters long with a numeric, 1 lowercase and 1 uppercase letters",
    });
  }

  // Use bcrypt to hash the password
  bcrypt.hash(password, 10, async (_err, hashed_password) => {
    const user = new User({
      personal_info: {
        firstName,
        surname,
        username,
        email,
        password: hashed_password,
      },
    });

    user
      .save()
      .then((u) => {
        return res.status(200).json(formatDataToSend(u));
      })
      .catch((err) => {
        if (err.code === 11000) {
          const duplicateField = Object.keys(err.keyValue)[0];

          if (duplicateField === "personal_info.email") {
            return res.status(500).json({ error: "Email already exists" });
          } else if (duplicateField === "personal_info.username") {
            return res.status(500).json({ error: "Username already exists" });
          }
        }
        return res.status(500).json({ error: err.message });
      });
  });
};



export {
  addFavorite,
  addUserBackground,
  addRating,
  addWantToSee,
  checkRating,
  checkFavorite,
  checkWantToSee,
  deleteComment,
  getUser,
  googleAuth,
  facebookAuth,
  removeRating,
  removeUserBackground,
  signIn,
  signUp,
}
