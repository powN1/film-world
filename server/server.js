import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { generateUploadUrl, uploadFileToAWSfromUrl } from "./utils/awsFunctions.js";
import { nanoid } from "nanoid";
import axios from "axios";
import { fileURLToPath } from "url";
import path from "path";
import "dotenv/config";
// firebase
import admin from "firebase-admin";
import serviceAccountKey from "./movie-database-project-c228a-firebase-adminsdk-byj42-74fe5a0510.json" with { type: "json" };

// Schemas
import Actor from "./Schema/Actor.js";
import Character from "./Schema/Character.js";
import Movie from "./Schema/Movie.js";
import Role from "./Schema/Role.js";
import Serie from "./Schema/Serie.js";

import movieRoutes from "./routes/movieRoute.js";
import serieRoutes from "./routes/serieRoute.js";
import gameRoutes from "./routes/gameRoute.js";
import articleRoutes from "./routes/articleRoute.js";
import reviewRoutes from "./routes/reviewRoute.js";
import roleRoutes from "./routes/roleRoute.js";
import actorRoutes from "./routes/actorRoute.js";
import userRoutes from "./routes/userRoute.js";
import commentRoutes from "./routes/commentRoute.js";

const PORT = process.env.PORT || 3002;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  // Accept requests only from pownprojects.site when in production
  app.use(
    cors({
      // origin: "http://patrykkurpiel.pl", // Your frontend URL
      origin: "*", // Your frontend URL
      methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
      allowedHeaders: "Content-Type,Authorization", // Allowed headers
    })
  );

  // const __dirname = import.meta.dirname;

  // Correct path to React build inside Docker
  const clientBuildPath = path.join(__dirname, "client/dist");
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else {
  // Accept requests from different ports than backend port (3000) for development
  app.use(cors());
  app.get("/", (req, res) => res.send("Please set to production"));
  
}

// Firebase initialize config
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

// Middleware so the server can process json
app.use(express.json());

// Connect mongoose to the database
mongoose.connect(process.env.DB_LOCATION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
});

app.get("/film-world/api/aws", async (req, res) => {
  const imageUrl = "https://lh3.googleusercontent.com/a/ACg8ocLcigctbdVmKSfa_-1EmTY2zeHMj48TujAVIr1MC7DvYT3zO3Q=s384-c";

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

app.post("/film-world/api/get-characters", (req, res) => {
  Character.find()
    .then((characters) => {
      return res.status(200).json({ characters });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.get("/film-world/api/get-upload-url", (req, res) => {
  generateUploadUrl()
    .then((url) => res.status(200).json({ uploadUrl: url }))
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

// getGenres();

// app.post("/get-movies-latest", (req, res) => {
//   const { count } = req.body;
//
//   const findQuery = {};
//   const sortQuery = {};
//   let countQuery = 0;
//
//   // Error checking
//   if (count) {
//     if (typeof count !== "number") return res.status(400).json({ error: "Wrong movie count. Please type a number" });
//     countQuery = count;
//   }
//
//   const today = new Date();
//   findQuery.releaseDate = { $lt: today };
//   sortQuery["releaseDate"] = -1;
//
//   Movie.find(findQuery)
//     .sort(sortQuery)
//     .limit(countQuery)
//     .then((movies) => {
//       return res.status(200).json({ movies });
//     })
//     .catch((err) => {
//       return res.status(500).json({ error: err.message });
//     });
// });
//
// app.post("/get-movies-most-anticipated", (req, res) => {
//   const { count } = req.body;
//
//   const findQuery = {};
//   const sortQuery = {};
//   let countQuery = 0;
//
//   // Error checking
//
//   if (count) {
//     if (typeof count !== "number") return res.status(400).json({ error: "Wrong movie count. Please type a number" });
//     countQuery = count;
//   }
//
//   const today = new Date();
//   findQuery.releaseDate = { $gt: today };
//   sortQuery["activity.peopleAwaiting"] = -1;
//
//   Movie.find(findQuery)
//     .sort(sortQuery)
//     .limit(countQuery)
//     .then((movies) => {
//       return res.status(200).json({ movies });
//     })
//     .catch((err) => {
//       return res.status(500).json({ error: err.message });
//     });
// });
//
// app.post("/get-movies-random", (req, res) => {
//   const { count } = req.body;
//
//   let countQuery = 0;
//   let randomQuery = {};
//
//   // Error checking
//   if (count) {
//     if (typeof count !== "number") return res.status(400).json({ error: "Wrong movie count. Please type a number" });
//     countQuery = count;
//     randomQuery.size = countQuery;
//   }
//
//   Movie.aggregate([
//     { $sample: { size: randomQuery.size } }, // Random sampling with limit
//   ])
//     .limit(countQuery)
//     .then((movies) => {
//       return res.status(200).json({ movies });
//     })
//     .catch((err) => {
//       return res.status(500).json({ error: err.message });
//     });
// });
//
// app.post("/get-movies-top-rated", (req, res) => {
//   const { count } = req.body;
//
//   const sortQuery = {};
//   let countQuery = 0;
//
//   // Error checking
//
//   if (count) {
//     if (typeof count !== "number") return res.status(400).json({ error: "Wrong movie count. Please type a number" });
//     countQuery = count;
//   }
//
//   sortQuery["activity.rating"] = -1;
//
//   Movie.find()
//     .sort(sortQuery)
//     .limit(countQuery)
//     .then((movies) => {
//       return res.status(200).json({ movies });
//     })
//     .catch((err) => {
//       return res.status(500).json({ error: err.message });
//     });
// });
//
// app.post("/get-movies-upcoming", (req, res) => {
//   const { count } = req.body;
//
//   const findQuery = {};
//   const sortQuery = {};
//   let countQuery = 0;
//
//   // Error checking
//   if (count) {
//     if (typeof count !== "number") return res.status(400).json({ error: "Wrong movie count. Please type a number" });
//     countQuery = count;
//   }
//
//   const today = new Date();
//   findQuery.releaseDate = { $gt: today };
//   sortQuery["releaseDate"] = 1;
//
//   Movie.find(findQuery)
//     .sort(sortQuery)
//     .limit(countQuery)
//     .then((movies) => {
//       return res.status(200).json({ movies });
//     })
//     .catch((err) => {
//       return res.status(500).json({ error: err.message });
//     });
// });

app.use("/film-world/api", movieRoutes);
app.use("/film-world/api", serieRoutes);
app.use("/film-world/api", gameRoutes);
app.use("/film-world/api", articleRoutes);
app.use("/film-world/api", reviewRoutes);
app.use("/film-world/api", roleRoutes);
app.use("/film-world/api", actorRoutes);
app.use("/film-world/api", userRoutes);
app.use("/film-world/api", commentRoutes);

// unused
app.post("/film-world/api/add-actor", async (req, res) => {
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

app.post("/film-world/api/add-character", async (req, res) => {
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
      Role.updateMany({ _id: { $in: roles } }, { $set: { character: character._id } })
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

app.post("/film-world/api/add-role", async (req, res) => {
  let { filmTitle, characterName, characterBanner, actor, movie, serie, anime } = req.body;
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

app.post("/film-world/api/add-game", async (req, res) => {
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

app.post("/film-world/api/add-movie", async (req, res) => {
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

app.post("/film-world/api/add-serie", async (req, res) => {
  let { title, banner, description, genre, seasons, yearBeginning, yearEnding } = req.body;

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

// end unused

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
