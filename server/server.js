import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import aws from "aws-sdk";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import axios from "axios";
import { load } from "cheerio";
import puppeteer from "puppeteer";
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
import Character from "./Schema/Character.js";
import Comment from "./Schema/Comment.js";
import Game from "./Schema/Game.js";
import Movie from "./Schema/Movie.js";
import Review from "./Schema/Review.js";
import Role from "./Schema/Role.js";
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
mongoose.connect(process.env.DB_LOCATION, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	autoIndex: true,
});

// Regex for identifying whether the email and password are correctly formatted
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

// WARNING:DELETE THIS AFTER U R DONE WITH IT
async function copyMoviesToSeries() {
	try {
		// Step 1: Fetch all documents from the 'movies' collection
		const movies = await Movie.find({});

		// Step 2: Remove the `_id` field from each document to avoid conflicts
		const moviesWithoutId = movies.map((movie) => {
			const movieObj = movie.toObject(); // Convert to plain JS object
			delete movieObj._id; // Remove the original _id
			return movieObj;
		});

		// Step 3: Insert the documents into the 'series' collection
		await Serie.insertMany(moviesWithoutId);
		await Anime.insertMany(moviesWithoutId);

		console.log("Movies copied to Series collection successfully.");
	} catch (error) {
		console.error("Error copying movies to series:", error);
	}
}
async function changeCollection() {
	try {
		// Step 1: Fetch all documents from the 'movies' collection
		const animes = await Anime.find({});
		const series = await Serie.find({});
		for (const anime of animes) {
			anime.set("year", undefined, { strict: false });
			anime.set("length", undefined, { strict: false });
			anime.year = undefined;
			anime.length = undefined;
			await anime.save();
		}
		for (const anime of series) {
			anime.set("year", undefined, { strict: false });
			anime.set("length", undefined, { strict: false });
			anime.year = undefined;
			anime.length = undefined;
			await anime.save();
		}
		console.log("Movies copied to Series collection successfully.");
	} catch (error) {
		console.error("Error copying movies to series:", error);
	}
}
// changeCollection();

async function printActors() {
	let acc;
	try {
		Actor.find().then((actors) => (acc = actors));
		console.log(acc);
	} catch (error) {
		console.error("No actors", error);
	}
}

async function addActivity() {
	const newActivity = {
		rating: 8.4,
		ratedByCount: 12521,
	};
	try {
		Role.updateMany({}, { $set: { activity: newActivity } }).then((movie) =>
			console.log(movie),
		);
		console.log(acc);
	} catch (error) {
		console.error("No actors", error);
	}
}

async function getMoviesFromThemoviedb() {
	const urlTopRatedMovies =
		"https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=3";

	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOWQ2YmZjMzcyY2ZlZjg0YjgyODgwNzE1M2ZhZDY0YiIsIm5iZiI6MTcyNjI1OTU3Ni45MzE4MTIsInN1YiI6IjYyOWM5NGI5Y2FhNTA4MWFlZjdkMzI1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rLbp_pNyYzYdtEkKypNecCMCkTz7F-_-M5Nachm7fw8",
		},
	};

	axios
		.get(urlTopRatedMovies, options)
		.then(async (res) => {
			res.data.results.forEach(async (result) => {
				const {
					id,
					title,
					poster_path,
					backdrop_path,
					overview: description,
					vote_average,
					vote_count: ratedByCount,
					release_date,
				} = result;

				const year = release_date.split("-")[0] * 1;
				const genreArray = [];
				let length;
				const coverUrl = `https://image.tmdb.org/t/p/w342${poster_path}`;
				const bannerUrl = `https://image.tmdb.org/t/p/original${backdrop_path}`;

				console.log(cover);

				const rating = vote_average.toFixed(1) * 1;

				const urlMovieDetails = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
				await axios
					.get(urlMovieDetails, options)
					.then((res) => {
						res.data.genres.forEach((genre) => genreArray.push(genre.name));
						length = res.data.runtime;
					})
					.catch((err) => console.log(err));

				// Check if movie with the same title already exists
				const existingMovie = await Movie.findOne({ title });
				if (existingMovie) {
					console.log(`Movie '${title}' already exists, skipping...`);
					return; // Skip if movie already exists
				}

				const cover = await uploadFileToAWSfromUrl(coverUrl);
				const banner = await uploadFileToAWSfromUrl(bannerUrl);

				const movie = new Movie({
					title,
					cover,
					banner,
					description,
					genre: genreArray,
					year,
					length,
					activity: {
						rating,
						ratedByCount,
					},
				});

				movie
					.save()
					.then(console.log("movie saved in the db"))
					.catch((err) => console.log(err));
			});
		})
		.catch((err) => console.log(err));
}
// getMoviesFromThemoviedb();

async function getMovieFromTheMovieDBById(movieId) {
	const urlMovie = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
	const urlMovieCredits = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`;

	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOWQ2YmZjMzcyY2ZlZjg0YjgyODgwNzE1M2ZhZDY0YiIsIm5iZiI6MTcyNjI1OTU3Ni45MzE4MTIsInN1YiI6IjYyOWM5NGI5Y2FhNTA4MWFlZjdkMzI1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rLbp_pNyYzYdtEkKypNecCMCkTz7F-_-M5Nachm7fw8",
		},
	};

	await axios
		.get(urlMovie, options)
		.then(async (res) => {
			const {
				title,
				poster_path,
				backdrop_path,
				overview: description,
				vote_average,
				vote_count: ratedByCount,
				release_date,
				origin_country,
				status,
				revenue,
				original_title,
				budget,
			} = res.data;

			const releaseDate = new Date(release_date);
			const year = release_date.split("-")[0] * 1;
			const genreArray = [];
			let length;

			const coverUrl = `https://image.tmdb.org/t/p/w342${poster_path}`;
			const bannerUrl = `https://image.tmdb.org/t/p/original${backdrop_path}`;

			const rating = vote_average.toFixed(1) * 1;
			res.data.genres.forEach((genre) => genreArray.push(genre.name));
			length = res.data.runtime;

			let director;
			let screenplay;

			// Check if movie with the same title already exists
			const existingMovie = await Movie.findOne({ title });
			if (existingMovie) {
				console.log(`Movie '${title}' already exists, skipping...`);
				return; // Skip if movie already exists
			}

			await axios
				.get(urlMovieCredits, options)
				.then((res) => {
					director = res.data.crew
						.filter((crew) => crew.job === "Director")
						.map((director) => director.name);
					screenplay = res.data.crew
						.filter((crew) => crew.job === "Screenplay")
						.map((screenplay) => screenplay.name);
				})
				.catch((err) => console.log(err));

			const cover = await uploadFileToAWSfromUrl(coverUrl);
			const banner = await uploadFileToAWSfromUrl(bannerUrl);

			const photos = [];
			let videos = [];

			const urlMovieImages = `https://api.themoviedb.org/3/movie/${movieId}/images`;
			const urlMovieVideos = `https://api.themoviedb.org/3/movie/${movieId}/videos`;

			await axios
				.get(urlMovieImages, options)
				.then(async (res) => {
					const randomImageMaxCount =
						Math.floor(Math.random() * (13 - 5 + 1)) + 5;
					const photoPromises = res.data.backdrops
						.slice(0, randomImageMaxCount)
						.map(async (photo, i) => {
							const bannerUrl = `https://image.tmdb.org/t/p/original${photo.file_path}`;
							// console.log("uploading img" + i);
							const banner = await uploadFileToAWSfromUrl(bannerUrl);
							setTimeout(() => {}, 700);
							photos.push(banner); // Store the uploaded image URL
						});

					await Promise.all(photoPromises);

					const videoRes = await axios.get(urlMovieVideos, options);
					const randomVideoMaxCount =
						Math.floor(Math.random() * (6 - 3 + 1)) + 3;
					console.log("getting videos");

					videos = videoRes.data.results
						.filter((video) => video.type == "Trailer")
						.slice(0, randomVideoMaxCount)
						.map((trailer) => `https://youtube.com/watch?v=${trailer.key}`);
					console.log("got videos");
				})
				.catch((err) => console.log(err));

			const movie = new Movie({
				title,
				cover,
				banner,
				description,
				genre: genreArray,
				year,
				length,
				originCountry: origin_country,
				status,
				director,
				screenplay,
				revenue,
				budget,
				originalTitle: original_title,
				releaseDate,
				activity: {
					rating,
					ratedByCount,
				},
				photos,
				videos,
			});

			movie
				.save()
				.then(console.log(`Movie ${title} saved in the db`))
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
}

// const listOfMoviesByIdToFetch = [98, 4553];

// listOfMoviesByIdToFetch.forEach(async (movie) => {
//   setTimeout(()=>{}, 1000)
// 	await getMovieFromTheMovieDBById(movie);
// });

async function getRoleImageAndNameFromFilmwebPagePuppeteer(
	type,
	name,
	year,
	actorName,
) {
	const searchUrl =
		type === "movie"
			? `https://www.filmweb.pl/films/search?q=${encodeURIComponent(name)}`
			: `https://www.filmweb.pl/serials/search?q=${encodeURIComponent(name)}`;

	const filmwebHeaders = { headers: { "x-locale": "en-US" } };
	// Launch Puppeteer
	const browser = await puppeteer.launch({ headless: true }); // headless: false will show the browser
	const page = await browser.newPage();

	// Navigate to a search filmweb website
	await page.goto(searchUrl, { waitUntil: "networkidle2" });
	await page.waitForSelector("a.preview__link", { timeout: 6000 }); // Wait for any preview__link anchor

	const mediaYear = year.toString();
	// Fetch the search results page

	// Extract the content of the divs
	const movieLink = await page.evaluate(() => {
		// Get all divs with the specific class
		const movie = document.querySelector('a.preview__link[href^="/film/"]');
		const serie = document.querySelector('a.preview__link[href^="/serial/"]');

		return movie ? movie.href : serie ? serie.href : null;
	});

	// Close the browser
	await browser.close();
	let movieId;

	if (movieLink.length && movieLink.includes(mediaYear)) {
		movieId = movieLink.split("-").at(-1);

		try {
			const movieRolesApiUrl = `https://www.filmweb.pl/api/v1/film/${movieId}/top-roles`;
			let movieActors = await axios.get(movieRolesApiUrl, filmwebHeaders);
			movieActors = movieActors.data;

			for (const actor of movieActors) {
				await new Promise((resolve) => setTimeout(resolve, 150));
				// Insert "name" property into every actor object
				const actorApiUrl = `https://www.filmweb.pl/api/v1/person/${actor.person}/info`;

				try {
					let actorRes = await axios.get(actorApiUrl, filmwebHeaders);
					actorRes = actorRes.data;

					// Update the actor object with "name" property
					const actorName = actorRes.name;
					const imgPath = actorRes.poster
						? actorRes.poster.path
							? actorRes.poster.path.replace("$", "1")
							: null
						: null;

					const actorImgPath = imgPath
						? `https://fwcdn.pl/ppo${imgPath}`
						: null;
					actor.name = actorName;
					actor.actorImgPath = actorImgPath;

					// Delay for 300ms
					await new Promise((resolve) => setTimeout(resolve, 200));
				} catch (err) {
					console.error("Failed getting actor info from filmweb", err);
				}
			}

			const filteredActor = movieActors.filter(
				(actor) =>
					actor.name.toLowerCase().includes(actorName.toLowerCase()) ||
					actorName.toLowerCase().includes(actor.name.toLowerCase()),
			);

			const roleApiUrl = `https://www.filmweb.pl/api/v1/role/${filteredActor[0].id}/preview`;

			let photoId;

			try {
				let roleRes = await axios.get(roleApiUrl, filmwebHeaders);
				roleRes = roleRes.data;
				// Check if there's a photo for the role
				photoId = roleRes.representingPhoto
					? roleRes.representingPhoto.id
					: null;
				const imgPath = roleRes.representingPhoto
					? roleRes.representingPhoto.sourcePath
						? roleRes.representingPhoto.sourcePath.replace("$", "2")
						: null
					: null;
				const roleImgPath = imgPath ? `https://fwcdn.pl/fph${imgPath}` : null;

				// Update the actor object with new properties
				filteredActor[0].roleImgPath = roleImgPath;

				// Delay for 300ms
				await new Promise((resolve) => setTimeout(resolve, 200));
			} catch (err) {
				console.error("Failed getting role info from filmweb", err);
			}

			if (photoId) {
				try {
					const photoApiUrl = `https://www.filmweb.pl/api/v1/photo/${photoId}/info`;
					let photoRes = await axios.get(photoApiUrl, filmwebHeaders);
					photoRes = photoRes.data;
					const characterId = photoRes.captions[0].character
						? photoRes.captions[0].character
						: null;
					// Delay for 300ms
					await new Promise((resolve) => setTimeout(resolve, 300));

					if (characterId) {
						try {
							const characterApiUrl = `https://filmweb.pl/api/v1/character/${characterId}/info`;
							let characterRes = await axios.get(
								characterApiUrl,
								filmwebHeaders,
							);
							characterRes = characterRes.data;
							const characterName = characterRes.name;

							filteredActor[0].characterName = characterName;

							// Delay for 300ms
							await new Promise((resolve) => setTimeout(resolve, 200));
						} catch (err) {
							console.error("Failed getting character info from filmweb", err);
						}
					}
				} catch (err) {
					console.error("Failed getting photo info from filmweb", err);
				}
			}
			console.log("fitered actor array before returning", filteredActor);
			return filteredActor[0];
		} catch (err) {
			console.error("Failed getting top roles", err);
		}
	}
}

async function addMovieRolesToMovies() {
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOWQ2YmZjMzcyY2ZlZjg0YjgyODgwNzE1M2ZhZDY0YiIsIm5iZiI6MTcyNjI1OTU3Ni45MzE4MTIsInN1YiI6IjYyOWM5NGI5Y2FhNTA4MWFlZjdkMzI1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rLbp_pNyYzYdtEkKypNecCMCkTz7F-_-M5Nachm7fw8",
		},
	};

	const findQuery = {
		$and: [
			{ roles: { $exists: true, $type: "array" } },
			{ $expr: { $lt: [{ $size: "$roles" }, 5] } },
		],
	};
	// Get all the movies from the db
	const movies = await Movie.find();
	// Get all the acotrs from the db
	const actors = await Actor.find(findQuery);

	for (const movie of movies) {
		console.log(`Checking movie: ${movie.title}`);
		// await new Promise((resolve) => setTimeout(resolve, 100));
		let movieTitle = movie.title;
		let encodedTitle = encodeURIComponent(movieTitle).replace(/%20/g, "+");
		const movieYear = movie.year;

		// For each movie find a relative movie in the themovieDB database using api
		try {
			const { data } = await axios.get(
				`https://api.themoviedb.org/3/search/movie?query=${encodedTitle}`,
				options,
			);
			const allMovies = data.results;

			// Return a movie that has the same title and release year
			const matchingMovies = allMovies.filter((movie) => {
				const matchingMovieYear = movie["release_date"].substring(0, 4);
				return (
					movie.title.toLowerCase() === movieTitle.toLowerCase() &&
					Number(matchingMovieYear) === Number(movieYear)
				);
			});

			const movieId = matchingMovies.length > 0 ? matchingMovies[0].id : null;

			if (movieId) {
				await new Promise((resolve) => setTimeout(resolve, 100));

				let creditsData;
				try {
					const urlMovieCredits = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`;
					const { data } = await axios.get(urlMovieCredits, options);
					creditsData = data;
				} catch (err) {
					console.error("Error getting credits data from themoviedm", err);
				}

				// Get the actors that played in the movie
				const cast = creditsData.cast;
				const castActing = cast.filter(
					(actor) => actor.known_for_department === "Acting",
				);

				for (const actor of actors) {
					// console.log(`Checking actor: ${actor.personal_info.name}`)
					// await new Promise((resolve) => setTimeout(resolve, 100));

					// For every actor in the db find if he has played in this movie
					const playedActor = castActing.filter(
						(castActor) =>
							castActor.name
								.toLowerCase()
								.includes(actor.personal_info.name.toLowerCase()) ||
							actor.personal_info.name
								.toLowerCase()
								.includes(castActor.name.toLowerCase()),
					);

					if (playedActor.length > 0) {
						try {
							const existingRole = await Role.findOne({
								filmTitle: movie.title,
								characterName: playedActor[0].character,
							});

							if (!existingRole) {
								console.log("Role not in the db, proceeding");
								const filmwebRole =
									await getRoleImageAndNameFromFilmwebPagePuppeteer(
										"movie",
										movie.title,
										movie.year,
										actor.personal_info.name,
									);
								const roleImg = filmwebRole.roleImgPath
									? filmwebRole.roleImgPath
									: null;
								const awsImageUrl = roleImg
									? await uploadFileToAWSfromUrl(roleImg)
									: null;

								const newRole = new Role({
									filmTitle: movie.title,
									characterName: playedActor[0].character,
									characterBanner: awsImageUrl || "",
									actor: actor._id,
									movie: movie._id,
									activity: {
										rating: filmwebRole.rate,
										ratedByCount: filmwebRole.count,
									},
								});

								// Save the new role and wait for the operation to finish
								const savedRole = await newRole.save();
								console.log(
									"Role saved, proceeding to add the role to the actor",
								);

								// Add the role to the actor and wait for the update to finish
								await Actor.findByIdAndUpdate(actor._id, {
									$push: { roles: savedRole._id },
								});
								console.log("Role added to actor");
							} else {
								console.log("Role already in the db");
							}
						} catch (err) {
							console.error(
								`Error processing role for ${playedActor[0].name} in movie ${movie.title}`,
								err,
							);
						}
					} else {
						// console.log("No playedActor found");
					}
				}
			}
		} catch (err) {
			console.error("Something went wrong", err);
		}
	}
	console.log("all movies and actors checked");
}

async function addSerieRolesToSeries() {
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOWQ2YmZjMzcyY2ZlZjg0YjgyODgwNzE1M2ZhZDY0YiIsIm5iZiI6MTcyNjI1OTU3Ni45MzE4MTIsInN1YiI6IjYyOWM5NGI5Y2FhNTA4MWFlZjdkMzI1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rLbp_pNyYzYdtEkKypNecCMCkTz7F-_-M5Nachm7fw8",
		},
	};

	// Get all the series from the db
	const movies = await Serie.find();
	// Get all the acotrs from the db
	const actors = await Actor.find();

	for (const movie of movies) {
		console.log(`Checking serie: ${movie.title}`);
		// await new Promise((resolve) => setTimeout(resolve, 100));
		let movieTitle = movie.title;
		let encodedTitle = encodeURIComponent(movieTitle).replace(/%20/g, "+");

		let date = new Date(movie.firstAirDate);
		let movieYear = date.getFullYear();

		// For each movie find a relative movie in the themovieDB database using api
		try {
			const { data } = await axios.get(
				`https://api.themoviedb.org/3/search/tv?query=${encodedTitle}`,
				options,
			);
			const allMovies = data.results;

			// Return a movie that has the same title and release year
			const matchingMovies = allMovies.filter((movie) => {
				const matchingMovieYear = movie["first_air_date"].substring(0, 4);
				return (
					movie.name.toLowerCase() === movieTitle.toLowerCase() &&
					Number(matchingMovieYear) === Number(movieYear)
				);
			});

			const movieId = matchingMovies.length > 0 ? matchingMovies[0].id : null;

			if (movieId) {
				await new Promise((resolve) => setTimeout(resolve, 100));

				let creditsData;
				try {
					const urlMovieCredits = `https://api.themoviedb.org/3/tv/${movieId}/credits?language=en-US`;
					const { data } = await axios.get(urlMovieCredits, options);
					creditsData = data;
				} catch (err) {
					console.error("Error getting credits data from themoviedm", err);
				}

				// Get the actors that played in the movie
				const cast = creditsData.cast;
				const castActing = cast.filter(
					(actor) => actor.known_for_department === "Acting",
				);

				for (const actor of actors) {
					// await new Promise((resolve) => setTimeout(resolve, 100));

					// For every actor in the db find if he has played in this movie
					const playedActor = castActing.filter(
						(castActor) =>
							castActor.name
								.toLowerCase()
								.includes(actor.personal_info.name.toLowerCase()) ||
							actor.personal_info.name
								.toLowerCase()
								.includes(castActor.name.toLowerCase()),
					);

					if (playedActor.length > 0) {
						try {
							const existingRole = await Role.findOne({
								filmTitle: movie.title,
								characterName: playedActor[0].character,
							});

							if (!existingRole) {
								console.log("Role not in the db, proceeding");
								const filmwebRole =
									await getRoleImageAndNameFromFilmwebPagePuppeteer(
										"serie",
										movie.title,
										movieYear,
										actor.personal_info.name,
									);
								const roleImg = filmwebRole.roleImgPath
									? filmwebRole.roleImgPath
									: null;
								const awsImageUrl = roleImg
									? await uploadFileToAWSfromUrl(roleImg)
									: null;

								const newRole = new Role({
									filmTitle: movie.title,
									characterName: playedActor[0].character,
									characterBanner: awsImageUrl || "",
									actor: actor._id,
									serie: movie._id,
									activity: {
										rating: filmwebRole.rate,
										ratedByCount: filmwebRole.count,
									},
								});

								// Save the new role and wait for the operation to finish
								const savedRole = await newRole.save();
								console.log(
									"Role saved, proceeding to add the role to the actor",
								);

								// Add the role to the actor and wait for the update to finish
								await Actor.findByIdAndUpdate(actor._id, {
									$push: { roles: savedRole._id },
								});
								console.log("Role added to actor");
							} else {
								console.log("Role already in the db");
							}
						} catch (err) {
							console.error("Error processing role:", err);
						}
					} else {
						console.log("No playedActor found");
					}
				}
			}
		} catch (err) {
			console.error("Something went wrong", err);
		}
	}
	console.log("all movies and actors checked");
}
// setTimeout(() => {}, 3000);
// addMovieRolesToMovies();
// addSerieRolesToSeries();

// const listOfMoviesByIdToFetch = [98, 4553];

// listOfMoviesByIdToFetch.forEach(async (movie) => {
//   setTimeout(()=>{}, 1000)
// 	await getMovieFromTheMovieDBById(movie);
// });

async function getActorFromTheMovieDBById(actorId) {
	const urlActor = `https://api.themoviedb.org/3/person/${actorId}?language=en-US`;

	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOWQ2YmZjMzcyY2ZlZjg0YjgyODgwNzE1M2ZhZDY0YiIsIm5iZiI6MTcyNjI1OTU3Ni45MzE4MTIsInN1YiI6IjYyOWM5NGI5Y2FhNTA4MWFlZjdkMzI1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rLbp_pNyYzYdtEkKypNecCMCkTz7F-_-M5Nachm7fw8",
		},
	};

	axios
		.get(urlActor, options)
		.then(async (res) => {
			const {
				name,
				biography: bio,
				birthday,
				deathday,
				place_of_birth: placeOfBirth,
				profile_path,
				known_for_department: knownFor,
			} = res.data;

			const pictureUrl = `https://image.tmdb.org/t/p/w342${profile_path}`;

			// Check if actor with the same name already exists
			const existingActor = await Actor.findOne({ "personal_info.name": name });
			if (existingActor) {
				console.log(`Actor '${name}' already exists, skipping...`);
				return;
			}

			const banner = await uploadFileToAWSfromUrl(pictureUrl);

			const actor = new Actor({
				personal_info: {
					name,
					bio,
					dateOfBirth: birthday !== null ? new Date(birthday) : null,
					dateOfDeath: deathday !== null ? new Date(deathday) : null,
					placeOfBirth,
					knownFor,
				},
				banner,
				activity: {
					rating: 0,
					ratedByCount: 0,
				},
			});

			actor
				.save()
				.then(console.log("actor saved in the db"))
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
}

const listOfActorsByIdToFetch = [
	51329, 73457, 72129, 60898, 3894, 1640, 2478, 4491, 1001657, 51072, 5472,
	1427948, 1922, 56365, 53714, 1590797, 884, 12795, 10860, 84223, 40462, 1327,
	3895, 8167, 8891, 22226, 776, 1003,
];

// listOfActorsByIdToFetch.forEach(async (actor) => {
// 	await getActorFromTheMovieDBById(actor);
// });

async function getSerieFromTheMovieDBById(serieId) {
	const urlSerie = `https://api.themoviedb.org/3/tv/${serieId}?language=en-US`;

	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOWQ2YmZjMzcyY2ZlZjg0YjgyODgwNzE1M2ZhZDY0YiIsIm5iZiI6MTcyNjI1OTU3Ni45MzE4MTIsInN1YiI6IjYyOWM5NGI5Y2FhNTA4MWFlZjdkMzI1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rLbp_pNyYzYdtEkKypNecCMCkTz7F-_-M5Nachm7fw8",
		},
	};

	await axios
		.get(urlSerie, options)
		.then(async (res) => {
			const {
				name: title,
				poster_path,
				backdrop_path,
				created_by,
				overview: description,
				vote_average,
				vote_count: ratedByCount,
				first_air_date,
				last_air_date,
				number_of_episodes: numberOfEpisodes,
				number_of_seasons: numberOfSeasons,
				origin_country,
				status,
				seasons,
			} = res.data;

			const genreArray = [];
			const firstAirDate = new Date(first_air_date);
			const lastAirDate = new Date(last_air_date);
			const createdBy = created_by.map((creator) => creator.name);

			const coverUrl = `https://image.tmdb.org/t/p/w342${poster_path}`;
			const bannerUrl = `https://image.tmdb.org/t/p/original${backdrop_path}`;

			const rating = vote_average.toFixed(1) * 1;
			res.data.genres.forEach((genre) => genreArray.push(genre.name));

			// Check if movie with the same title already exists
			const existingSerie = await Serie.findOne({ title });
			if (existingSerie) {
				console.log(`Serie '${title}' already exists, skipping...`);
				return; // Skip if movie already exists
			}

			const seasonsFormatted = await Promise.all(
				seasons.map(async (season) => {
					const {
						air_date: airDate,
						episode_count: episodeCount,
						name: title,
						overview: description,
						poster_path,
						season_number: seasonNumber,
						vote_average,
					} = season;

					let cover = null;

					if (poster_path) {
						const coverUrl = `https://image.tmdb.org/t/p/w342${poster_path}`;
						cover = await uploadFileToAWSfromUrl(coverUrl);
					}

					return {
						airDate,
						episodeCount,
						title,
						description,
						cover,
						seasonNumber,
						activity: {
							rating: vote_average.toFixed(1) * 1,
							ratedByCount: 0,
						},
					};
				}),
			);

			const cover = await uploadFileToAWSfromUrl(coverUrl);
			const banner = await uploadFileToAWSfromUrl(bannerUrl);

			const photos = [];
			let videos = [];

			const urlSerieImages = `https://api.themoviedb.org/3/tv/${serieId}/images`;
			const urlSerieVideos = `https://api.themoviedb.org/3/tv/${serieId}/videos`;

			await axios
				.get(urlSerieImages, options)
				.then(async (res) => {
					const randomImageMaxCount =
						Math.floor(Math.random() * (13 - 5 + 1)) + 5;
					const photoPromises = res.data.backdrops
						.slice(0, randomImageMaxCount)
						.map(async (photo, i) => {
							const bannerUrl = `https://image.tmdb.org/t/p/original${photo.file_path}`;
							// console.log("uploading img" + i);
							const banner = await uploadFileToAWSfromUrl(bannerUrl);
							setTimeout(() => {}, 700);
							photos.push(banner); // Store the uploaded image URL
						});

					await Promise.all(photoPromises);

					const videoRes = await axios.get(urlSerieVideos, options);
					const randomVideoMaxCount =
						Math.floor(Math.random() * (6 - 3 + 1)) + 3;
					console.log("getting videos");

					videos = videoRes.data.results
						.filter((video) => video.type == "Trailer")
						.slice(0, randomVideoMaxCount)
						.map((trailer) => `https://youtube.com/watch?v=${trailer.key}`);
					console.log("got videos");
				})
				.catch((err) => console.log(err));
			const serie = new Serie({
				title,
				cover,
				banner,
				createdBy,
				description,
				genre: genreArray,
				originCountry: origin_country,
				firstAirDate,
				lastAirDate,
				numberOfEpisodes,
				numberOfSeasons,
				status,
				activity: {
					rating,
					ratedByCount,
				},
				seasons: seasonsFormatted,
				photos,
				videos,
			});

			serie
				.save()
				.then(console.log(`Serie ${title} saved in the db`))
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
}
const listOfSeriesByIdToFetch = [1425, 40008, 71912];
// setTimeout(() => {
//   console.log('fetching now')
// 	listOfSeriesByIdToFetch.forEach(async (serie) => {
// 		await getSerieFromTheMovieDBById(serie);
// 	});
// }, 3000);

async function getGameFromTheIGDBById(gameId) {
	const urlGame = `https://api.igdb.com/v4/games`;
	const searchQuery = `fields category, checksum, collection, collections, cover.url, created_at, dlcs.name, expanded_games, expansions.name, expansions.cover.url, first_release_date, follows, forks, franchise.name, franchises.name, genres.name, hypes, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, name, parent_game, platforms.name, rating, rating_count, screenshots.url, similar_games.name, standalone_expansions.name, status, storyline, summary, url, version_parent, version_title, videos.video_id;where id = ${gameId};`;

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "text/plain",
			"Client-ID": "7l5442ioowsl72nd3t8kcxom4nneu2",
			Authorization: "Bearer qi0ucg8biwwrddmt2a81snmdq3gohf",
		},
	};

	axios
		.post(urlGame, searchQuery, options)
		.then(async (res) => {
			const [
				{
					id,
					cover: { url: coverImg },
					expansions,
					first_release_date,
					franchises,
					genres,
					hypes: peopleAwaiting,
					involved_companies,
					name: title,
					platforms,
					rating,
					rating_count: ratedByCount,
					screenshots,
					similar_games,
					summary,
					videos,
					status,
				},
			] = res.data;

			// Check if movie with the same title already exists
			const existingGame = await Game.findOne({ title });
			if (existingGame) {
				console.log(`Game '${title}' already exists, skipping...`);
				return; // Skip if movie already exists
			}

			const genreArray = [];
			const milliseconds = first_release_date * 1000;
			const releaseDate = new Date(milliseconds);

			const coverUrl = `https://images.igdb.com/igdb/image/upload/t_720p/${coverImg.split("/").pop()}`;
			const bannerUrl = `https://images.igdb.com/igdb/image/upload/t_720p/${screenshots[0].url.split("/").pop()}`;

			const ratingConverted = rating ? rating.toFixed(0) / 10 : null;
			genres.forEach((genre) => genreArray.push(genre.name));

			let universe;
			if (universe) universe = [franchises[0].name];

			let updatedExpansions;
			if (expansions) {
				updatedExpansions = await Promise.all(
					expansions.map(async (expansion) => {
						delete expansion.id;
						delete expansion.cover.id;
						const coverUrlTrimmed = expansion.cover.url.split("/").pop();
						const coverUrl = `https://images.igdb.com/igdb/image/upload/t_720p/${coverUrlTrimmed}`;
						const cover = await uploadFileToAWSfromUrl(coverUrl);
						expansion.cover.url = cover;
						return expansion;
					}),
				);
			}

			const developers = involved_companies
				.filter((company) => company.developer)
				.map((developer) => developer.company.name);

			const publishers = involved_companies
				.filter((company) => company.publisher)
				.map((publisher) => publisher.company.name);

			const uploadedScreenshots = await Promise.all(
				screenshots.map(async (screenshot) => {
					const screenshotUrlTrimmed = screenshot.url.split("/").pop();
					const screenshotUrl = `https://images.igdb.com/igdb/image/upload/t_720p/${screenshotUrlTrimmed}`;
					const screenshotUploaded =
						await uploadFileToAWSfromUrl(screenshotUrl);
					screenshot.url = screenshotUploaded;
					return screenshot.url;
				}),
			);

			const videosLinks = videos.map(
				(video) => `https://youtube.com/watch?v=${video.video_id}`,
			);

			const platformsTrimmed = platforms.map((platform) => platform.name);
			const similarGames = similar_games.map((game) => game.name);

			const cover = await uploadFileToAWSfromUrl(coverUrl);
			const banner = await uploadFileToAWSfromUrl(bannerUrl);

			const game = new Game({
				title,
				banner,
				cover,
				description: summary,
				status,
				activity: {
					rating: ratingConverted,
					ratedByCount,
					peopleAwaiting,
				},
				genre: genreArray,
				releaseDate,
				dlcs: updatedExpansions,
				platforms: platformsTrimmed,
				similarGames,
				universe,
				developers,
				publishers,
				photos: uploadedScreenshots,
				videos: videosLinks,
			});

			game
				.save()
				.then(console.log("game saved in the db"))
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
}
const listOfGamesToFetch = [
	51523, 298526, 300976, 135994, 92550, 37136, 51523, 298526, 302704, 228530,
	152244, 76883, 279661, 250634,
];
// listOfGamesToFetch.forEach(async (game) => {
// 	await getGameFromTheIGDBById(game);
// 	setTimeout(() => {}, 3500);
// });

async function pushReleaseDatesToMovie(movieId) {
	const urlMovie = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;

	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOWQ2YmZjMzcyY2ZlZjg0YjgyODgwNzE1M2ZhZDY0YiIsIm5iZiI6MTcyNjI1OTU3Ni45MzE4MTIsInN1YiI6IjYyOWM5NGI5Y2FhNTA4MWFlZjdkMzI1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rLbp_pNyYzYdtEkKypNecCMCkTz7F-_-M5Nachm7fw8",
		},
	};

	axios
		.get(urlMovie, options)
		.then(async (res) => {
			const { title, release_date } = res.data;

			Movie.findOne({ title })
				.then((movie) => {
					if (movie.releaseDate) return;
					const releaseDate = new Date(release_date);
					movie.releaseDate = releaseDate;
					console.log("movie updated");
					return movie.save();
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
}

const listOfMovies = [
	497, 13, 155, 278, 475557, 603, 157336, 27205, 103663, 121, 423, 120, 807,
	122, 424, 550, 8681, 9800, 203801, 14,
];

// listOfMovies.forEach(async (movie) => {
// 	await pushReleaseDatesToMovie(movie);
// });

async function addMoviesAndSeriesBasedOnActors() {
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOWQ2YmZjMzcyY2ZlZjg0YjgyODgwNzE1M2ZhZDY0YiIsIm5iZiI6MTcyNjI1OTU3Ni45MzE4MTIsInN1YiI6IjYyOWM5NGI5Y2FhNTA4MWFlZjdkMzI1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rLbp_pNyYzYdtEkKypNecCMCkTz7F-_-M5Nachm7fw8",
		},
	};

	const findQuery = {
		$and: [
			{ roles: { $exists: true, $type: "array" } },
			{ $expr: { $lt: [{ $size: "$roles" }, 5] } },
		],
	};
	// Get all the acotrs from the db
	const actors = await Actor.find(findQuery);
	const movies = await Movie.find();
	const series = await Serie.find();

	for (const actor of actors) {
		// Cycle throuh every actor
		let actorName = actor.personal_info.name;
		let encodedName = encodeURIComponent(actorName).replace(/%20/g, "+");
		try {
			// Get actor details from themoviedb api
			const actorResponse = await axios.get(
				`https://api.themoviedb.org/3/search/person?query=${encodedName}`,
				options,
			);
			const actors = actorResponse.data.results;
			const filteredActor = actors.filter(
				(actorRes) =>
					actor.personal_info.name === actorRes.name &&
					actorRes.known_for_department === "Acting",
			);

			if (filteredActor.length > 0) {
				// If actor from the db matches the actor from themoviedb api response
				const actorId = filteredActor[0].id;
				try {
					// Get actor film details
					let actorDetails = await axios.get(
						`https://api.themoviedb.org/3/person/${actorId}/combined_credits`,
						options,
					);
					actorDetails = actorDetails.data.cast;

					// Get actors popular movies and series that he played in
					const actorPopularMovies = actorDetails
						.filter((film) => film.title)
						.filter((film) => film.popularity > 50)
						.sort((a, b) => b.popularity - a.popularity);
					const actorPopularSeries = actorDetails
						.filter((film) => film.name)
						.filter((film) => film.popularity > 50)
						.sort((a, b) => b.popularity - a.popularity);

					// Create a Set of property values from movies array to easily check for duplicates
					const valuesSetMovies = new Set(movies.map((item) => item["title"]));
					const actorMoviesToAdd = actorPopularMovies
						.filter((item) => !valuesSetMovies.has(item["title"]))
						.slice(0, 10);

					// Create a Set of property values from series to easily check for duplicates
					const valuesSetSeries = new Set(movies.map((item) => item["title"]));
					const actorSeriesToAdd = actorPopularSeries
						.filter((item) => !valuesSetSeries.has(item["name"]))
						.slice(0, 5);

					console.log(`Actor: ${actor.personal_info.name}`);
					for (const movieToAdd of actorMoviesToAdd) {
						try {
							await getMovieFromTheMovieDBById(movieToAdd.id);
							await new Promise((resolve) => setTimeout(resolve, 300));
						} catch (err) {
							console.log("Failed adding the movie to the db");
						}
					}

					for (const serieToAdd of actorSeriesToAdd) {
						try {
							await getSerieFromTheMovieDBById(serieToAdd.id);
							await new Promise((resolve) => setTimeout(resolve, 300));
						} catch (err) {
							console.log("Failed adding the movie to the db");
						}
					}
				} catch (err) {
					console.error("Error getting actor movies and series", err);
				}
			} else {
				console.log("No actor with that name found");
			}
		} catch (err) {
			console.error("Error getting actor id", err);
		}
	}
}
// setTimeout(() => {}, 2000);
// addMoviesAndSeriesBasedOnActors();

async function addTitleIdsToMedias(type) {
	try {
		let medias;
		if (type === "movies") medias = await Movie.find();
		else if (type === "series") medias = await Serie.find();
		else if (type === "games") medias = await Game.find();

		for (const media of medias) {
			const mediaTitle = media.title;
			const mediaTitleCoded = mediaTitle
				.replace(/[^a-zA-Z0-9]/g, " ")
				.replace(/\s+/g, "-")
				.trim();

			const mediaReleaseDate =
				type === "movies" || type === "games"
					? media.releaseDate
					: media.firstAirDate;
			let date = new Date(mediaReleaseDate);
			const mediaYear = date.getFullYear();
			const mediaTitleId = `${mediaTitleCoded}-${mediaYear}-${nanoid().slice(0, 6)}`;
			media.titleId = mediaTitleId;

			await media.save();

			console.log(`Updated titleId for ${mediaTitle}:`, mediaTitleId);
		}
		console.log("All media titles updated");
	} catch (err) {
		console.error(err);
	}
}
// addTitleIdsToMedias("movies");

async function addNameIdsToPeople() {
	try {
		const actors = await Actor.find();

		for (const actor of actors) {
			const actorName = actor.personal_info.name;
			const actorNameCoded = actorName
				.replace(/[^a-zA-Z0-9]/g, " ")
				.replace(/\s+/g, "-")
				.trim();

			const actorNameId = `${actorNameCoded}-${nanoid().slice(0, 6)}`;
			actor.personal_info.nameId = actorNameId;

			await actor.save();

			console.log(`Updated nameId for ${actor}:`, actorNameId);
		}
		console.log("All actor nameIds updated");
	} catch (err) {
		console.error(err);
	}
}
// addNameIdsToPeople();

async function pushPhotosAndVideosToMovie(movieId) {
	const urlMovie = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
	const urlMovieImages = `https://api.themoviedb.org/3/movie/${movieId}/images`;
	const urlMovieVideos = `https://api.themoviedb.org/3/movie/${movieId}/videos`;

	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOWQ2YmZjMzcyY2ZlZjg0YjgyODgwNzE1M2ZhZDY0YiIsIm5iZiI6MTcyNjI1OTU3Ni45MzE4MTIsInN1YiI6IjYyOWM5NGI5Y2FhNTA4MWFlZjdkMzI1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rLbp_pNyYzYdtEkKypNecCMCkTz7F-_-M5Nachm7fw8",
		},
	};

	let title;
	await axios
		.get(urlMovie, options)
		.then((res) => (title = res.data.title))
		.catch((err) => console.log(err));

	Movie.findOne({ title })
		.then((movie) => {
			console.log("movie found in the db");
			if (movie.photos.length || movie.videos.length) {
				console.log("photos or videos found! aborting");
				return Promise.resolve();
			}
			const photos = [];
			let videos = [];

			axios
				.get(urlMovieImages, options)
				.then(async (res) => {
					const randomImageMaxCount =
						Math.floor(Math.random() * (13 - 5 + 1)) + 5;
					const photoPromises = res.data.backdrops
						.slice(0, randomImageMaxCount)
						.map(async (photo, i) => {
							const bannerUrl = `https://image.tmdb.org/t/p/original${photo.file_path}`;
							console.log("uploading img" + i);
							const banner = await uploadFileToAWSfromUrl(bannerUrl);
							setTimeout(() => {}, 700);
							photos.push(banner); // Store the uploaded image URL
						});

					await Promise.all(photoPromises);

					const videoRes = await axios.get(urlMovieVideos, options);
					const randomVideoMaxCount =
						Math.floor(Math.random() * (6 - 3 + 1)) + 3;
					console.log("getting videos");

					videos = videoRes.data.results
						.filter((video) => video.type == "Trailer")
						.slice(0, randomVideoMaxCount)
						.map((trailer) => `https://youtube.com/watch?v=${trailer.key}`);
					console.log("got videos");
				})
				.then(() => {
					console.log("saving movie " + title);
					movie.photos = photos;
					movie.videos = videos;
					return movie.save();
				})
				.catch((err) => console.log(err));
			console.log("movie updated");
		})
		.catch((err) => console.log(err));
}

const listOfMovies2 = [
	497, 155, 13, 278, 475557, 603, 157336, 27205, 103663, 121, 423, 120, 807,
	122, 424, 550, 8681, 9800, 203801, 14, 347123,
];

// listOfMovies2.forEach(async (movie) => {
// 	await pushPhotosAndVideosToMovie(movie);
// 	setTimeout(() => {}, 3500);
// });

async function pushPhotosAndVideosToSeries() {
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOWQ2YmZjMzcyY2ZlZjg0YjgyODgwNzE1M2ZhZDY0YiIsIm5iZiI6MTcyNjI1OTU3Ni45MzE4MTIsInN1YiI6IjYyOWM5NGI5Y2FhNTA4MWFlZjdkMzI1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rLbp_pNyYzYdtEkKypNecCMCkTz7F-_-M5Nachm7fw8",
		},
	};

	const series = await Serie.find();

	for (const serie of series) {
		// Cycle throuh every actor
		let serieName = serie.title;
		console.log(`serie name is ${serieName}`);
		let encodedName = encodeURIComponent(serieName).replace(/%20/g, "+");
		try {
			// Get actor details from themoviedb api
			const seriesResponse = await axios.get(
				`https://api.themoviedb.org/3/search/tv?query=${encodedName}`,
				options,
			);
			const foundSeries = seriesResponse.data.results;
			const filteredSerie = foundSeries.filter(
				(serieRes) => serie.title === serieRes.name,
			);

			if (filteredSerie.length > 0) {
				// If serie from the db matches the serie from themoviedb api response
				const serieId = filteredSerie[0].id;
				try {
					// Get serie details
					let seriePhotos = await axios.get(
						`https://api.themoviedb.org/3/tv/${serieId}/images`,
						options,
					);

					const photos = [];
					let videos = [];

					const randomImageMaxCount =
						Math.floor(Math.random() * (13 - 5 + 1)) + 5;

					const photoPromises = seriePhotos.data.backdrops
						.slice(0, randomImageMaxCount)
						.map(async (photo, i) => {
							const bannerUrl = `https://image.tmdb.org/t/p/original${photo.file_path}`;
							console.log("uploading img" + i);
							const banner = await uploadFileToAWSfromUrl(bannerUrl);
							setTimeout(() => {}, 700);
							photos.push(banner); // Store the uploaded image URL
						});

					await Promise.all(photoPromises);

					const videoRes = await axios.get(
						`https://api.themoviedb.org/3/tv/${serieId}/videos`,
						options,
					);
					const randomVideoMaxCount =
						Math.floor(Math.random() * (6 - 3 + 1)) + 3;
					console.log("getting videos");

					videos = videoRes.data.results
						.filter((video) => video.type == "Trailer")
						.slice(0, randomVideoMaxCount)
						.map((trailer) => `https://youtube.com/watch?v=${trailer.key}`);
					console.log("got videos");

					console.log("saving serie " + serie.title);
					serie.photos = photos;
					serie.videos = videos;
					await serie.save();
				} catch (err) {
					console.error("Error getting serie images or videos", err);
				}
			} else {
				console.log("No serie with that name found");
			}
		} catch (err) {
			console.error("Error getting serie data", err);
		}
	}
}

// pushPhotosAndVideosToSeries();

async function addSexesToActors() {
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOWQ2YmZjMzcyY2ZlZjg0YjgyODgwNzE1M2ZhZDY0YiIsIm5iZiI6MTcyNjI1OTU3Ni45MzE4MTIsInN1YiI6IjYyOWM5NGI5Y2FhNTA4MWFlZjdkMzI1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rLbp_pNyYzYdtEkKypNecCMCkTz7F-_-M5Nachm7fw8",
		},
	};

	// Get all the acotrs from the db
	const actors = await Actor.find();

	for (const actor of actors) {
		// Cycle throuh every actor
		let actorName = actor.personal_info.name;
		let encodedName = encodeURIComponent(actorName).replace(/%20/g, "+");
		try {
			// Get actor details from themoviedb api
			const actorResponse = await axios.get(
				`https://api.themoviedb.org/3/search/person?query=${encodedName}`,
				options,
			);
			const actors = actorResponse.data.results;
			const filteredActor = actors.filter(
				(actorRes) =>
					actor.personal_info.name === actorRes.name &&
					actorRes.known_for_department === "Acting",
			);

			if (filteredActor.length > 0) {
				// If actor from the db matches the actor from themoviedb api response
				const actorId = filteredActor[0].id;
				try {
					// Get actor film details
					let actorDetails = await axios.get(
						`https://api.themoviedb.org/3/person/${actorId}`,
						options,
					);
					const actorSex = actorDetails.data.gender === 2 ? "male" : "female";
					if (!actor.personal_info.sex) {
						await Actor.updateOne(
							{ _id: actor._id },
							{ "personal_info.sex": actorSex },
						);
						console.log(`Updated ${actorName} with sex: ${actorSex}`);
					}
				} catch (err) {
					console.error("Error getting actor movies and series", err);
				}
			} else {
				console.log("No actor with that name found");
			}
		} catch (err) {
			console.error("Error getting actor id", err);
		}
	}
}
// addSexesToActors();

async function updateRatings() {
	try {
		const medias = await Game.find({});

		// Loop through each document
		for (const media of medias) {
			// Generate a random number between 0.00 and 0.09
			const originalRating = media.activity.rating;
			const randomAddition = parseFloat((Math.random() * 0.09).toFixed(2));
			const newRating = (originalRating + randomAddition).toFixed(2);

			// Update the activity.rating field
			media.activity.rating = newRating; // Add random number to existing rating

			// Save the updated document
			await media.save();
			console.log("movie rating saved!");
		}
	} catch (err) {
		console.log(err);
	}
}

// updateRatings();

function hasMoreThanTwoDecimals(number) {
	const numStr = number.toString();
	const parts = numStr.split(".");

	// Check if there is a decimal part and if it has more than 2 digits
	if (parts[1] && parts[1].length > 2) {
		return true;
	}
	return false;
}

async function fixDecimals() {
	try {
		const series = await Serie.find({});

		// Loop through each document
		for (const serie of series) {
			// Update the activity.rating field
			if (hasMoreThanTwoDecimals(serie.activity.rating)) {
				const ratingFixed = parseFloat(serie.activity.rating.toFixed(2));
				serie.activity.rating = ratingFixed;
			}

			// Save the updated document
			await serie.save();
			console.log("serie rating fixed!");
		}
	} catch (err) {
		console.log(err);
	}
}

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
const imagesUrl = [
	"https://i.imgur.com/VfZYNV8.jpeg",
	"https://i.imgur.com/p0N0mgx.jpeg",
	"https://i.imgur.com/v8KAQsb.jpeg",
	"https://i.imgur.com/NA3UbFp.jpeg",
	"https://i.imgur.com/IywxNqG.jpeg",
	"https://i.imgur.com/azjHqEy.jpeg",
	"https://i.imgur.com/P2RobyE.jpeg",
	"https://i.imgur.com/Y3e17oI.jpeg",
];
// imagesUrl.forEach(async (image) => {
// 	await uploadFileToAWSfromUrl(image);
// });

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

	// const awsRes = await generateUploadUrl();
	// res.status(200).json({ imageResponse });
});

app.post("/get-actor", async (req, res) => {
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
});

app.post("/get-actors", (req, res) => {
	const { count } = req.body;

	Actor.find()
		.limit(count)
		.then((actors) => {
			return res.status(200).json({ actors });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/get-actors-top-rated", (req, res) => {
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
				{ path: "movie", select: "title" },
				{ path: "serie", select: "title" },
			],
		})
		.then((actors) => {
			return res.status(200).json({ actors });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.get("/get-animes", (req, res) => {
	Anime.find()
		.then((animes) => {
			return res.status(200).json({ animes });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/get-article", async (req, res) => {
	const { articleId } = req.body;

	// Error checking
	if (!articleId)
		return res
			.status(400)
			.json({ error: "Wrong article id. Please provide a correct id." });

	try {
		const article = await Article.findOne({ articleId }).populate("author");
		res.status(200).json({ article });
	} catch (err) {
		return res.status(500).json({ err: "Error getting the article" });
	}
});

app.post("/get-articles", (req, res) => {
	const { type, count, category, random } = req.body;

	const findQuery = {};
	const sortQuery = {};
	const randomQuery = {};
	let countQuery = 0;

	// Error checking
	if (category) {
		if (
			category !== "movies" &&
			category !== "series" &&
			category !== "games"
		) {
			return res.status(400).json({
				error: "Wrong article category. Please choose movies, series or games",
			});
		}
		findQuery.tags = category;
	}

	if (type) {
		if (type !== "latest" && category !== "popular") {
			return res
				.status(400)
				.json({ error: "Wrong article type. Please choose latest or popular" });
		}
		if (type === "latest") sortQuery.publishedAt = -1;
	}
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong article count. Please type a number" });
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
});

app.post("/get-articles-latest", (req, res) => {
	const { count } = req.body;

	const sortQuery = {};
	let countQuery = 0;

	// Error checking
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong article count. Please type a number" });
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
});

app.post("/get-articles-latest-movies", (req, res) => {
	const { count } = req.body;

	const findQuery = {};
	const sortQuery = {};
	let countQuery = 0;

	// Error checking
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong article count. Please type a number" });
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
});

app.post("/get-articles-latest-series", (req, res) => {
	const { count } = req.body;

	const findQuery = {};
	const sortQuery = {};
	let countQuery = 0;

	// Error checking
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong article count. Please type a number" });
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
});

app.post("/get-articles-latest-games", (req, res) => {
	const { count } = req.body;

	const findQuery = {};
	const sortQuery = {};
	let countQuery = 0;

	// Error checking
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong article count. Please type a number" });
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
});

app.post("/get-characters", (req, res) => {
	Character.find()
		.then((characters) => {
			return res.status(200).json({ characters });
		})
		.catch((err) => res.status(500).json({ error: err.message }));
});

app.post("/get-game", async (req, res) => {
	const { titleId } = req.body;

	// Error checking
	if (!titleId) {
		return res
			.status(400)
			.json({ error: "Wrong game title. Please provide a correct title." });
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
});

app.post("/get-games", (req, res) => {
	const { count } = req.body;

	let countQuery = 0;

	// Error checking
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong game count. Please type a number" });
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
});

app.post("/get-games-random", (req, res) => {
	const { count } = req.body;

	let countQuery = 0;
	let randomQuery = {};

	// Error checking
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong game count. Please type a number" });
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
});

app.post("/get-games-latest", (req, res) => {
	const { count } = req.body;

	const sortQuery = {};
	let countQuery = 0;

	// Error checking
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong game count. Please type a number" });
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
});

app.post("/get-games-top-rated", (req, res) => {
	const { count } = req.body;

	const sortQuery = {};
	let countQuery = 0;

	// Error checking
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong game count. Please type a number" });
		countQuery = count;
	}

	sortQuery["activity.rating"] = -1;

	Game.find()
		.sort(sortQuery)
		.limit(countQuery)
		.then((games) => {
			return res.status(200).json({ games });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/get-games-anticipated", (req, res) => {
	const { sortByRating, count } = req.body;

	let countQuery = 0;
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong game count. Please type a number" });
		countQuery = count;
	}

	let sortQuery = {};
	if (sortByRating) {
		if (typeof sortByRating !== "boolean") {
			return res
				.status(400)
				.json({ error: "Wrong sort value. Please choose a true or false" });
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
});

// upload img url route
app.get("/get-upload-url", (req, res) => {
	generateUploadUrl()
		.then((url) => res.status(200).json({ uploadUrl: url }))
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/get-movie", async (req, res) => {
	const { titleId } = req.body;

	// Error checking
	if (!titleId) {
		return res
			.status(400)
			.json({ error: "Wrong movie title. Please provide a correct title." });
	}

	try {
		// Fetch the movie by titleId and transform into plain js object
		const movie = await Movie.findOne({ titleId }).lean();

		// If movie not found, return an error
		if (!movie) {
			return res.status(404).json({ error: "Movie not found." });
		}

		// Fetch all roles for the movie and populate the actors in one query
		const roles = await Role.find({ filmTitle: movie.title })
			.populate("actor")
			.sort({ "activity.rating": -1 });

		// Attach the roles with populated actors to the movie object
		movie.roles = roles;

		// Return the movie object with populated roles
		return res.status(200).json({ movie });
	} catch (err) {
		console.error("Error fetching movie data:", err);
		return res.status(500).json({ error: "Error getting the movie data" });
	}
});

app.post("/get-movies", (req, res) => {
	const { count } = req.body;

	let countQuery = 0;
	let randomQuery = {};

	// Error checking
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong movie count. Please type a number" });
		countQuery = count;
		randomQuery.size = countQuery;
	}

	Movie.find()
		.limit(countQuery)
		.then((movies) => {
			return res.status(200).json({ movies });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/get-movies-latest", (req, res) => {
	const { count } = req.body;

	const findQuery = {};
	const sortQuery = {};
	let countQuery = 0;

	// Error checking
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong movie count. Please type a number" });
		countQuery = count;
	}

	const today = new Date();
	findQuery.releaseDate = { $lt: today };
	sortQuery["releaseDate"] = -1;

	Movie.find(findQuery)
		.sort(sortQuery)
		.limit(countQuery)
		.then((movies) => {
			return res.status(200).json({ movies });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/get-movies-most-anticipated", (req, res) => {
	const { count } = req.body;

	const findQuery = {};
	const sortQuery = {};
	let countQuery = 0;

	// Error checking

	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong movie count. Please type a number" });
		countQuery = count;
	}

	const today = new Date();
	findQuery.releaseDate = { $gt: today };
	sortQuery["activity.peopleAwaiting"] = -1;

	Movie.find(findQuery)
		.sort(sortQuery)
		.limit(countQuery)
		.then((movies) => {
			return res.status(200).json({ movies });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/get-movies-random", (req, res) => {
	const { count } = req.body;

	let countQuery = 0;
	let randomQuery = {};

	// Error checking
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong movie count. Please type a number" });
		countQuery = count;
		randomQuery.size = countQuery;
	}

	Movie.aggregate([
		{ $sample: { size: randomQuery.size } }, // Random sampling with limit
	])
		.limit(countQuery)
		.then((movies) => {
			return res.status(200).json({ movies });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/get-movies-top-rated", (req, res) => {
	const { count } = req.body;

	const sortQuery = {};
	let countQuery = 0;

	// Error checking

	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong movie count. Please type a number" });
		countQuery = count;
	}

	sortQuery["activity.rating"] = -1;

	Movie.find()
		.sort(sortQuery)
		.limit(countQuery)
		.then((movies) => {
			return res.status(200).json({ movies });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/get-movies-upcoming", (req, res) => {
	const { count } = req.body;

	const findQuery = {};
	const sortQuery = {};
	let countQuery = 0;

	// Error checking
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong movie count. Please type a number" });
		countQuery = count;
	}

	const today = new Date();
	findQuery.releaseDate = { $gt: today };
	sortQuery["releaseDate"] = 1;

	Movie.find(findQuery)
		.sort(sortQuery)
		.limit(countQuery)
		.then((movies) => {
			return res.status(200).json({ movies });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/get-review", async (req, res) => {
	const { reviewId } = req.body;

	// Error checking
	if (!reviewId)
		return res .status(400) .json({ error: "Wrong review id. Please provide a correct id." });

	try {
		const review = await Review.findOne({ review_id: reviewId }).populate("author").populate("referredMedia");
		res.status(200).json({ review });
	} catch (err) {
		return res.status(500).json({ err: "Error getting the review" });
	}
});
app.post("/get-reviews-latest", (req, res) => {
	const { count } = req.body;

	const sortQuery = {};
	let countQuery = 0;

	// Error checking
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong review count. Please type a number" });
		countQuery = count;
	}

	sortQuery["publishedAt"] = -1;

	Review.find()
		.sort(sortQuery)
		.limit(countQuery)
		.populate("author", "personal_info.fullname, personal_info.profile_img")
		.populate("referredMedia", "title releaseDate firstAirDate")
		.then((reviews) => {
			return res.status(200).json({ reviews });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/get-reviews-latest-movies", (req, res) => {
	const { count } = req.body;

	const findQuery = {};
	const sortQuery = {};
	let countQuery = 0;

	// Error checking
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong review count. Please type a number" });
		countQuery = count;
	}

	sortQuery["publishedAt"] = -1;
	findQuery.category = "movies";

	Review.find(findQuery)
		.sort(sortQuery)
		.limit(countQuery)
		.populate("author", "personal_info.fullname, personal_info.profile_img")
		.populate("referredMedia", "title releaseDate firstAirDate")
		.then((reviews) => {
			return res.status(200).json({ reviews });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/get-reviews-latest-series", (req, res) => {
	const { count } = req.body;

	const findQuery = {};
	const sortQuery = {};
	let countQuery = 0;

	// Error checking
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong review count. Please type a number" });
		countQuery = count;
	}

	sortQuery["publishedAt"] = -1;
	findQuery.category = "series";

	Review.find(findQuery)
		.sort(sortQuery)
		.limit(countQuery)
		.populate("author", "personal_info.fullname, personal_info.profile_img")
		.populate("referredMedia", "title releaseDate firstAirDate")
		.then((reviews) => {
			return res.status(200).json({ reviews });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/get-reviews-latest-games", (req, res) => {
	const { count } = req.body;

	const findQuery = {};
	const sortQuery = {};
	let countQuery = 0;

	// Error checking
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong review count. Please type a number" });
		countQuery = count;
	}

	sortQuery["publishedAt"] = -1;
	findQuery.category = "games";

	Review.find(findQuery)
		.sort(sortQuery)
		.limit(countQuery)
		.populate("author", "personal_info.fullname, personal_info.profile_img")
		.populate("referredMedia", "title releaseDate firstAirDate")
		.then((reviews) => {
			return res.status(200).json({ reviews });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/get-reviews-random", (req, res) => {
	const { count } = req.body;

	let countQuery = 0;
	let randomQuery = {};

	// Error checking
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong review count. Please type a number" });
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
});

app.post("/get-roles", (req, res) => {
	const { count } = req.body;

	Role.find()
		.limit(count)
		.populate("actor", "activity personal_info.name")
		.populate("movie", "title year")
		.populate("serie", "title firstAirDate")
		.then((roles) => {
			return res.status(200).json({ roles });
		})
		.catch((err) => res.status(500).json({ error: err.message }));
});

app.post("/get-roles-movie", (req, res) => {
	const { count } = req.body;

	const findQuery = {};
	findQuery.movie = { $exists: true };

	Role.find(findQuery)
		.limit(count)
		.populate("actor", "activity personal_info.name")
		.populate("movie", "title releaseDate")
		.then((roles) => {
			return res.status(200).json({ roles });
		})
		.catch((err) => res.status(500).json({ error: err.message }));
});

app.post("/get-roles-movie-top-rated", (req, res) => {
	const { count } = req.body;

	const findQuery = {};
	findQuery.movie = { $exists: true };

	const sortQuery = {};
	sortQuery["activity.rating"] = -1;

	Role.find(findQuery)
		.limit(count)
		.sort(sortQuery)
		.populate("actor", "activity personal_info.name")
		.populate("movie", "title releaseDate")
		.then((roles) => {
			return res.status(200).json({ roles });
		})
		.catch((err) => res.status(500).json({ error: err.message }));
});

app.post("/get-roles-movie-top-rated-male", async (req, res) => {
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
					"actor.activity.rating": 1,

					// Specific fields from movie document
					"movie.title": 1,
					"movie.releaseDate": 1,
				},
			},
		]);

		return res.status(200).json({ roles });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

app.post("/get-roles-movie-top-rated-female", async (req, res) => {
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
					"actor.activity.rating": 1,

					// Specific fields from movie document
					"movie.title": 1,
					"movie.releaseDate": 1,
				},
			},
		]);

		return res.status(200).json({ roles });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

app.post("/get-roles-serie", (req, res) => {
	const { count } = req.body;

	const findQuery = {};
	findQuery.serie = { $exists: true };

	Role.find(findQuery)
		.limit(count)
		.populate("actor", "activity personal_info.name")
		.populate("serie", "title firstAirDate")
		.then((roles) => {
			return res.status(200).json({ roles });
		})
		.catch((err) => res.status(500).json({ error: err.message }));
});

app.post("/get-roles-serie-top-rated", (req, res) => {
	const { count } = req.body;

	const findQuery = {};
	findQuery.serie = { $exists: true };

	const sortQuery = {};
	sortQuery["activity.rating"] = -1;

	Role.find(findQuery)
		.limit(count)
		.sort(sortQuery)
		.populate("actor", "activity personal_info.name")
		.populate("serie", "title firstAirDate")
		.then((roles) => {
			return res.status(200).json({ roles });
		})
		.catch((err) => res.status(500).json({ error: err.message }));
});

app.post("/get-roles-serie-top-rated-male", async (req, res) => {
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
					"actor.activity.rating": 1,

					// Specific fields from movie document
					"serie.title": 1,
					"serie.firstAirDate": 1,
				},
			},
		]);

		return res.status(200).json({ roles });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

app.post("/get-roles-serie-top-rated-female", async (req, res) => {
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
					"actor.personal_info.name": 1,
					"actor.activity.rating": 1,

					// Specific fields from movie document
					"serie.title": 1,
					"serie.firstAirDate": 1,
				},
			},
		]);

		return res.status(200).json({ roles });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

app.post("/get-serie", async (req, res) => {
	const { titleId } = req.body;

	// Error checking
	if (!titleId) {
		return res
			.status(400)
			.json({ error: "Wrong serie title. Please provide a correct title." });
	}

	try {
		// Fetch the serie by titleId and transform into plain js object
		const serie = await Serie.findOne({ titleId }).lean();

		// If serie not found, return an error
		if (!serie) {
			return res.status(404).json({ error: "Serie not found." });
		}

		// Fetch all roles for the serie and populate the actors in one query
		const roles = await Role.find({ filmTitle: serie.title })
			.populate("actor")
			.sort({ "activity.rating": -1 });

		// Attach the roles with populated actors to the serie object
		serie.roles = roles;

		// Return the serie object with populated roles
		return res.status(200).json({ serie });
	} catch (err) {
		console.error("Error fetching serie data:", err);
		return res.status(500).json({ error: "Error getting the serie data" });
	}
});

app.post("/get-series", (req, res) => {
	const { count } = req.body;

	let countQuery = 0;

	// Error checking
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong serie count. Please type a number" });
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
});

app.post("/get-series-latest", (req, res) => {
	const { sortByRating, count } = req.body;

	const findQuery = {};
	const sortQuery = {};
	let countQuery = 0;

	// Error checking
	if (sortByRating) {
		if (typeof sortByRating !== "boolean") {
			return res.status(400).json({
				error:
					"Wrong serie sorting value. Please type a boolean (true or false)",
			});
		}
		sortQuery["activity.rating"] = -1;
	}

	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong serie count. Please type a number" });
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
});

app.post("/get-series-popular", (req, res) => {
	// NOTE: Work on this route when popular field is introduced to mongo documents
	const { sortByRating, count } = req.body;

	const sortQuery = {};
	let countQuery = 0;

	// Error checking
	if (sortByRating) {
		if (typeof sortByRating !== "boolean") {
			return res.status(400).json({
				error:
					"Wrong serie sorting value. Please type a boolean (true or false)",
			});
		}
		sortQuery["activity.rating"] = -1;
	}

	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong serie count. Please type a number" });
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
});

app.post("/get-series-random", (req, res) => {
	const { count } = req.body;

	let countQuery = 0;
	let randomQuery = {};

	// Error checking
	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong serie count. Please type a number" });
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
});

app.post("/get-series-top-rated", (req, res) => {
	const { count } = req.body;

	const sortQuery = {};
	let countQuery = 0;

	// Error checking

	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong serie count. Please type a number" });
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
});

// NOTE: THIS IS COPIED FROM THE MOVIES ROUTE AND NEEDS TO BE ADJUSTED CUZ THERE IS NO RELEASEDATE FIELD FOR SERIES DOCUMENTS
app.post("/get-series-most-anticipated", (req, res) => {
	const { count } = req.body;

	const findQuery = {};
	const sortQuery = {};
	let countQuery = 0;

	// Error checking

	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong serie count. Please type a number" });
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
});

// NOTE: THIS IS COPIED FROM THE MOVIES ROUTE AND NEEDS TO BE ADJUSTED CUZ THERE IS NO RELEASEDATE FIELD FOR SERIES DOCUMENTS
app.post("/get-series-upcoming", (req, res) => {
	const { count } = req.body;

	const findQuery = {};
	const sortQuery = {};
	let countQuery = 0;

	// Error checking

	if (count) {
		if (typeof count !== "number")
			return res
				.status(400)
				.json({ error: "Wrong serie count. Please type a number" });
		countQuery = count;
	}

	// NOTE: THIS IS COPIED FROM THE MOVIES ROUTE AND NEEDS TO BE ADJUSTED CUZ THERE IS NO RELEASEDATE FIELD FOR SERIES DOCUMENTS
	const today = new Date();
	findQuery.releaseDate = { $gt: today };
	sortQuery["releaseDate"] = 1;

	Serie.find(findQuery)
		.sort(sortQuery)
		.limit(countQuery)
		.then((series) => {
			return res.status(200).json({ series });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/get-user", async (req, res) => {
	const { userId } = req.body;

	// Error checking
	if (!userId)
		return res
			.status(400)
			.json({ error: "Wrong user id. Please provide a correct id." });

	try {
		const user = await User.findOne({ "personal_info.username": userId })
			.populate("articles")
			.populate("ratings")
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
			}),
		);

		const userObj = { ...user.toObject(), ratings: populatedRatings };
		res.status(200).json({ user: userObj });
	} catch (err) {
		return res.status(500).json({ err: "Error getting the user data" });
	}
});

app.post("/check-rating", verifyJWT, async (req, res) => {
	const userId = req.user;
	const { mediaId } = req.body;

	if (!mediaId) {
		return res
			.status(400)
			.json({ error: "Please provide both mediaId and type" });
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
			const rating = user.ratings.find(
				(rating) => rating.item_id.toString() === mediaId,
			);
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
		res
			.status(500)
			.json({ error: "An error occurred while checking the rating" });
	}
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
			return res.status(403).json({
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
						$inc: { "account_info.total_articles": incrementVal },
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

async function findDocumentCollectionById(id) {
	try {
		const db = mongoose.connection.db;

		// Step 1: Get all collection names
		const collections = await db.listCollections().toArray();

		for (const collection of collections) {
			const collectionName = collection.name;

			// Step 2: Dynamically access the collection and search by _id
			const result = await db
				.collection(collectionName)
				.findOne({ _id: new mongoose.Types.ObjectId(id) });

			if (result) {
				return collectionName; // Found the document
			}
		}

		return null; // Document not found in any collection
	} catch (error) {
		console.error("Error finding document by id:", error);
	}
}

app.post("/create-review", verifyJWT, async (req, res) => {
	const authorId = req.user;

	let {
		title,
		category,
		description,
		banner,
		content,
		referredMediaID,
		activity,
		draft,
		id,
	} = req.body;

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
			return res
				.status(403)
				.json({ error: "There must be some review content to publish it" });
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
	title = title
		.replace(/[^a-zA-Z0-9]/g, " ")
		.replace(/\s+/g, "-")
		.trim();

	let review_id = id || mediaTitle + "-" + title + nanoid();

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
			},
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
					},
				)
					.then(async (_user) => {
						const collectionName =
							await findDocumentCollectionById(referredMediaID);
						console.log(`collection name is: ${collectionName}`);

						if (collectionName === "movies") {
							Movie.findOneAndUpdate(
								{ _id: referredMediaID },
								{ $push: { reviews: review._id } },
							).then();
						} else if (collectionName === "series") {
							Serie.findOneAndUpdate(
								{ _id: referredMediaID },
								{ $push: { reviews: review._id } },
							).then();
						} else if (collectionName === "games") {
							console.log("pushing the review into the games's reviews array");
							Game.findOneAndUpdate(
								{ _id: referredMediaID },
								{ $push: { reviews: review._id } },
							).then();
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
});

app.post("/add-actor", async (req, res) => {
	let { personal_info, banner, activity, roles } = req.body;

	const awsImageUrl = await uploadFileToAWSfromUrl(banner);

	let actor = new Actor({
		personal_info,
		banner: awsImageUrl,
		activity,
		roles,
	});

	actor
		.save()
		.then((actor) => {
			return res.status(200).json({ actor });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/add-character", async (req, res) => {
	let { personal_info, banner, activity, roles, adversaries } = req.body;

	const awsImageUrl = await uploadFileToAWSfromUrl(banner);

	let character = new Character({
		personal_info,
		banner: awsImageUrl,
		activity,
		roles,
		adversaries,
	});

	character
		.save()
		.then((character) => {
			Role.updateMany(
				{ _id: { $in: roles } },
				{ $set: { character: character._id } },
			)
				.then((character) => {
					return res.status(200).json({ character });
				})
				.catch((err) => {
					return res.status(500).json({ error: err.message });
				});
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/add-rating", verifyJWT, async (req, res) => {
	const userId = req.user;

	let { mediaId, type, userRating, reviewText } = req.body;

	if (!mediaId) {
		return res
			.status(403)
			.json({ error: "Please choose movie, serie or game to rate" });
	}
	if (!type) {
		return res.status(403).json({
			error: "Please specify what is the rating for (movie, serie or game)",
		});
	} else {
		if (type !== "movie" && type !== "serie" && type !== "game") {
			return res
				.status(403)
				.json({ error: `Invalid type. Choose "movie", "serie" or "game"` });
		}
	}
	if (!userRating || userRating > 10 || userRating < 1) {
		return res
			.status(403)
			.json({ error: "Please select a rating from 1 to 10" });
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

		if (!media)
			return res.status(404).json({ error: `No ${type} found with this ID` });

		const existingRating = user.ratings.find(
			(rating) => rating.item_id.toString() === mediaId,
		);

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
			newRating =
				(currentRating * ratedByCount - oldUserRating + userRating) /
				ratedByCount;

			media.activity.rating = newRating;
			await media.save();
			await user.save();

			res.status(200).json({ rating: existingRating });
		} else {
			newRating =
				(currentRating * ratedByCount + userRating) / (ratedByCount + 1);
			media.activity.ratedByCount = ratedByCount + 1;

			const ratingEntry = {
				item_id: media._id,
				itemType:
					type === "movie"
						? "movies"
						: type === "serie"
							? "series"
							: type === "game"
								? "games"
								: null,
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
		res
			.status(500)
			.json({ error: "An error occurred while processing the rating" });
	}
});

app.post("/add-role", async (req, res) => {
	let {
		filmTitle,
		characterName,
		characterBanner,
		actor,
		movie,
		serie,
		anime,
	} = req.body;
	const awsImageUrl = await uploadFileToAWSfromUrl(characterBanner);

	let role = new Role({
		filmTitle,
		characterName,
		characterBanner: awsImageUrl,
		actor,
	});

	if (movie) role.movie = movie;
	else if (serie) role.serie = serie;
	else if (anime) role.anime = anime;

	role
		.save()
		.then((role) => {
			Actor.findByIdAndUpdate(actor, { $push: { roles: role._id } })
				.then((user) => res.status(200).json({ role }))
				.catch((err) => res.status(500).json({ error: err.message }));
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/add-game", async (req, res) => {
	let { title, banner, description, genre, length, year } = req.body;

	const awsImageUrl = await uploadFileToAWSfromUrl(banner);

	let movie = new Movie({
		title,
		banner: awsImageUrl,
		description,
		genre,
		length,
		year,
	});

	movie
		.save()
		.then((movie) => {
			return res.status(200).json({ movie });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/add-movie", async (req, res) => {
	let { title, banner, description, genre, length, year } = req.body;

	const awsImageUrl = await uploadFileToAWSfromUrl(banner);

	let movie = new Movie({
		title,
		banner: awsImageUrl,
		description,
		genre,
		length,
		year,
	});

	movie
		.save()
		.then((movie) => {
			return res.status(200).json({ movie });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/add-serie", async (req, res) => {
	let {
		title,
		banner,
		description,
		genre,
		seasons,
		yearBeginning,
		yearEnding,
	} = req.body;

	const awsImageUrl = await uploadFileToAWSfromUrl(banner);

	let serie = new Serie({
		title,
		banner: awsImageUrl,
		description,
		genre,
		seasons,
		yearBeginning,
		yearEnding,
	});

	serie
		.save()
		.then((serie) => {
			return res.status(200).json({ serie });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/add-anime", async (req, res) => {
	let { title, banner, description, genre, length, year } = req.body;

	const awsImageUrl = await uploadFileToAWSfromUrl(banner);

	let anime = new Anime({
		title,
		banner: awsImageUrl,
		description,
		genre,
		length,
		year,
	});

	anime
		.save()
		.then((anime) => {
			return res.status(200).json({ anime });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
});

app.post("/remove-rating", verifyJWT, async (req, res) => {
	const userId = req.user;

	let { mediaId, type } = req.body;

	if (!mediaId) {
		return res
			.status(403)
			.json({ error: "Please choose movie, serie or game to rate" });
	}

	try {
		const mediaModels = {
			movie: Movie,
			series: Serie,
			game: Game,
		};

		const MediaModel = mediaModels[type];
		const media = await MediaModel.findById(mediaId);

		if (!media)
			return res.status(404).json({ error: `No ${type} found with this ID` });

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const existingRating = user.ratings.find(
			(rating) => rating.item_id.toString() === mediaId,
		);
		const userRating = existingRating.rating;

		const { rating, ratedByCount } = media.activity;

		console.log(userRating);
		const newMediaRating =
			(rating * ratedByCount - userRating) / (ratedByCount - 1);
		media.activity.rating = newMediaRating;
		media.activity.ratedByCount = ratedByCount - 1;

		await media.save();

		// Remove the rating from the user's ratings array using $pull
		await User.updateOne(
			{ _id: userId },
			{ $pull: { ratings: { item_id: mediaId } } },
		);

		res.status(200).json({ message: `User rating deleted successfully` });

		return;
	} catch (err) {
		res.status(500).json({ error: err.message });
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
				return res.status(403).json({
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
