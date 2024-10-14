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
mongoose.connect(process.env.DB_LOCATION, { autoIndex: true });

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

	axios
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
				.then(console.log("movie saved in the db"))
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
}

const listOfMoviesByIdToFetch = [152532, 203801];

// listOfMoviesByIdToFetch.forEach(async (movie) => {
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

	axios
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
							console.log("uploading img" + i);
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
				.then(console.log("serie saved in the db"))
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
	console.log("this is sortQuery", sortQuery);
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
