import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import aws from "aws-sdk";
import "dotenv/config";

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

// Regex for identifying whether the email and password are correctly formatted
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

app.get("/get-movies", (req, res) => {
	// https://i.imgur.com/0TMqAjM.jpeg

	Movie.find()
		.then((movies) => {
			return res.status(200).json({ movies });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/signup", (req, res) => {
	const { fullname, email, password } = req.body;

	if (fullname.length < 3) {
		return res .status(403) .json({ error: "Fullname must be at least 3 letters long" });
	}
	if (!email.length) {
		return res.status(403).json({ error: "Enter email" });
	}
	if (!emailRegex.test(email)) {
		return res.status(403).json({ error: "Email is invalid" });
	}
	if (!passwordRegex.test(password)) {
		return res.status(403).json({ error: "Password should be 6-20 characters long with a numeric, 1 lowercase and 1 uppercase letters" });
	}

	// Use bcrypt to hash the password
	bcrypt.hash(password, 10, async (_err, hashed_password) => {
		const username = await generateUsername(email);

		const user = new User({
			personal_info: {
				fullname,
				email,
				password: hashed_password,
				username,
			},
		});

		user
			.save()
			.then((u) => {
				return res.status(200).json(formatDataToSend(u));
			})
			.catch((err) => {
				if (err.code === 11000) {
					return res.status(500).json({ error: "Email already exists" });
				}
				return res.status(500).json({ error: err.message });
			});
	});
});
app.listen(PORT, () => {
	console.log(`listening on port: ${PORT}`);
});
