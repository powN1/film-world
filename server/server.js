import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import aws from "aws-sdk";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import axios from "axios";
import "dotenv/config";
// firebase
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import serviceAccountKey from "./movie-database-project-c228a-firebase-adminsdk-byj42-74fe5a0510.json" assert {
	type: "json",
};

// Schemas
import Actor from "./Schema/Actor.js";
import Anime from "./Schema/Anime.js";
import Article from "./Schema/Article.js";
import Comment from "./Schema/Comment.js";
import Game from "./Schema/Game.js";
import Movie from "./Schema/Movie.js";
import Review from "./Schema/Review.js";
import Serie from "./Schema/Serie.js";
import User from "./Schema/User.js";

const PORT = 3000;

const app = express();

// Firebase initialize config
admin.initializeApp({
	credential: admin.credential.cert(serviceAccountKey),
});

// Middleware so the server can process json
app.use(express.json());

// Accept requests from different ports than backend port (3000)
app.use(cors());

// AWS S3 setup
const s3 = new aws.S3({
	region: "eu-central-1",
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Connect mongoose to the database
mongoose.connect(process.env.DB_LOCATION, { autoIndex: true });

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const generateUploadUrl = async () => {
	const date = new Date();
	const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

	return await s3.getSignedUrlPromise("putObject", {
		Bucket: "movie-database-project",
		Key: imageName,
		Expires: 1000,
		ContentType: "image/jpeg",
	});
};

const uploadFileToAWSfromUrl = async (fileUrl) => {
	try {
		const imageResponse = await axios.get(fileUrl, {
			responseType: "arraybuffer",
		});

		const date = new Date();
		const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

		const uploadParams = {
			Bucket: "movie-database-project",
			Key: imageName,
			Body: Buffer.from(imageResponse.data, "binary"),
			ContentType: "image/jpeg",
		};

		const s3Response = await s3.upload(uploadParams).promise();

		return s3Response.Location;
	} catch (err) {
		console.error("Error uploading file: ", err);
		throw new Error("Failed to upload file to S3");
	}
};

const formatDataToSend = (user) => {
	const access_token = jwt.sign(
		{ id: user._id, admin: user.admin },
		process.env.JWT_SECRET_ACCESS_KEY,
	);

	return {
		access_token,
		admin: user.admin,
		profile_img: user.personal_info.profile_img,
		firstName: user.personal_info.firstName,
		surname: user.personal_info.surname,
		username: user.personal_info.username,
	};
};

const generateUsername = async (email) => {
	let username = email.split("@")[0];

	let usernameExists = await User.exists({
		"personal_info.username": username,
	}).then((res) => res);

	usernameExists ? (username += nanoid().substring(0, 5)) : "";

	return username;
};

const verifyJWT = (req, res, next) => {
	const authHeader = req.headers["authorization"];

	// const token = authHeader && authHeader.split(" ")[1];
	const token = authHeader;

	if (token === null) {
		return res.status(401).json({ error: "No access token" });
	}
	jwt.verify(token, process.env.JWT_SECRET_ACCESS_KEY, (err, user) => {
		if (err) {
			return res.status(403).json({ error: "Access token is invalid" });
		}

		req.user = user.id;
		req.admin = user.admin;
		next();
	});
};

app.get("/aws", async (req, res) => {
	const imageUrl =
		"https://lh3.googleusercontent.com/a/ACg8ocLcigctbdVmKSfa_-1EmTY2zeHMj48TujAVIr1MC7DvYT3zO3Q=s384-c";

	const imageResponse = await axios.get(imageUrl, {
		responseType: "arraybuffer",
	});

	const date = new Date();
	const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

	const uploadParams = {
		Bucket: "movie-database-project",
		Key: imageName,
		Body: Buffer.from(imageResponse.data, "binary"),
		ContentType: "image/jpeg",
	};

	const s3Response = await s3.upload(uploadParams).promise();

	console.log(s3Response.Location);

	// const awsRes = await generateUploadUrl();
	// res.status(200).json({ imageResponse });
});

// upload img url route
app.get("/get-upload-url", (req, res) => {
	generateUploadUrl()
		.then((url) => res.status(200).json({ uploadUrl: url }))
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.get("/get-movies", (req, res) => {
	Movie.find()
		.then((movies) => {
			return res.status(200).json({ movies });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.get("/get-articles", (req, res) => {
	Article.find()
		.then((articles) => {
			return res.status(200).json({ articles });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/create-article", verifyJWT, (req, res) => {
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
			return res
				.status(403)
				.json({
					error: "You must provide article banner in order to publish it",
				});
		}

		if (!content.blocks.length) {
			return res
				.status(403)
				.json({ error: "There must be some article content to publish it" });
		}

		if (!tags.length || tags.length > 3) {
			return res.status(403).json({
				error: "You must provide max 3 article tags in order to publish it",
			});
		}
	}

	tags = tags.map((tag) => tag.toLowerCase());

	let article_id =
		id ||
		title
			.replace(/[^a-zA-Z0-9]/g, " ")
			.replace(/\s+/g, "-")
			.trim() + nanoid();

	if (id) {
		Article.findOneAndUpdate(
			{ article_id },
			{
				title,
				description,
				banner,
				content,
				tags,
				draft: draft ? draft : false,
			},
		)
			.then(() => {
				return res.status(200).json({ id: article_id });
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
			article_id,
			draft: Boolean(draft),
		});

		article
			.save()
			.then((article) => {
				let incrementVal = draft ? 0 : 1;

				User.findOneAndUpdate(
					{ _id: authorId },
					{
						$inc: { "account_info.total_posts": incrementVal },
						$push: { articles: article._id },
					},
				)
					.then((_user) => {
						return res.status(200).json({ id: article.article_id });
					})
					.catch((_err) => {
						return res
							.status(500)
							.json({ error: "Failed to update total posts number" });
					});
			})
			.catch((err) => {
				return res.status(500).json({ error: err.message });
			});
	}
});

// Login related routes
app.post("/signup", (req, res) => {
	const { firstName, surname, username, email, password } = req.body;

	if (firstName.length < 2) {
		return res
			.status(403)
			.json({ error: "First name must be at least 2 letters long" });
	}
	if (surname.length < 3) {
		return res
			.status(403)
			.json({ error: "Surname must be at least 3 letters long" });
	}
	if (username.length < 3) {
		return res
			.status(403)
			.json({ error: "Username must be at least 3 letters long" });
	}
	if (!email.length) {
		return res.status(403).json({ error: "Enter email" });
	}
	if (!emailRegex.test(email)) {
		return res.status(403).json({ error: "Email is invalid" });
	}
	if (!passwordRegex.test(password)) {
		return res.status(403).json({
			error:
				"Password should be 6-20 characters long with a numeric, 1 lowercase and 1 uppercase letters",
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
});

app.post("/signin", (req, res) => {
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
				return res
					.status(403)
					.json({
						error:
							"Account was created using google. Try logging in with google.",
					});
			}
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({ error: err.message });
		});
});

app.post("/google-auth", async (req, res) => {
	let { access_token } = req.body;

	getAuth()
		.verifyIdToken(access_token)
		.then(async (decodedUser) => {
			let { email, name, picture } = decodedUser;

			picture = picture.replace("s96-c", "s384-c");

			let user = await User.findOne({ "personal_info.email": email })
				.select(
					"personal_info.firstName personal_info.surname personal_info.username personal_info.profile_img google_auth admin",
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
						error:
							"This email was signed up without google. Please log in with password to access the account.",
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
			console.log(user);
			return res.status(200).json(formatDataToSend(user));
		})
		.catch((_err) => {
			return res.status(500).json({
				error: "Failed to authenticate with google. Try other account.",
			});
		});
});

app.post("/facebook-auth", async (req, res) => {
	let { access_token, facebook_access_token } = req.body;

	getAuth()
		.verifyIdToken(access_token)
		.then(async (decodedUser) => {
			let { email, name, picture } = decodedUser;

			picture = picture.replace("s96-c", "s384-c");

			let user = await User.findOne({ "personal_info.email": email })
				.select(
					"personal_info.firstName personal_info.surname personal_info.username personal_info.profile_img facebook_auth admin",
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
						error:
							"This email was signed up without facebook. Please log in with password to access the account.",
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
});

app.listen(PORT, () => {
	console.log(`listening on port: ${PORT}`);
});
