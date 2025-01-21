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
    Role.updateMany({}, { $set: { activity: newActivity } }).then((movie) => console.log(movie));
    console.log(acc);
  } catch (error) {
    console.error("No actors", error);
  }
}

async function getMoviesFromThemoviedb() {
  const urlTopRatedMovies = "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=3";

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
          director = res.data.crew.filter((crew) => crew.job === "Director").map((director) => director.name);
          screenplay = res.data.crew.filter((crew) => crew.job === "Screenplay").map((screenplay) => screenplay.name);
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
          const randomImageMaxCount = Math.floor(Math.random() * (13 - 5 + 1)) + 5;
          const photoPromises = res.data.backdrops.slice(0, randomImageMaxCount).map(async (photo, i) => {
            const bannerUrl = `https://image.tmdb.org/t/p/original${photo.file_path}`;
            // console.log("uploading img" + i);
            const banner = await uploadFileToAWSfromUrl(bannerUrl);
            setTimeout(() => {}, 700);
            photos.push(banner); // Store the uploaded image URL
          });

          await Promise.all(photoPromises);

          const videoRes = await axios.get(urlMovieVideos, options);
          const randomVideoMaxCount = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
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

async function getRoleImageAndNameFromFilmwebPagePuppeteer(type, name, year, actorName) {
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

          const actorImgPath = imgPath ? `https://fwcdn.pl/ppo${imgPath}` : null;
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
          actorName.toLowerCase().includes(actor.name.toLowerCase())
      );

      const roleApiUrl = `https://www.filmweb.pl/api/v1/role/${filteredActor[0].id}/preview`;

      let photoId;

      try {
        let roleRes = await axios.get(roleApiUrl, filmwebHeaders);
        roleRes = roleRes.data;
        // Check if there's a photo for the role
        photoId = roleRes.representingPhoto ? roleRes.representingPhoto.id : null;
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
          const characterId = photoRes.captions[0].character ? photoRes.captions[0].character : null;
          // Delay for 300ms
          await new Promise((resolve) => setTimeout(resolve, 300));

          if (characterId) {
            try {
              const characterApiUrl = `https://filmweb.pl/api/v1/character/${characterId}/info`;
              let characterRes = await axios.get(characterApiUrl, filmwebHeaders);
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
    $and: [{ roles: { $exists: true, $type: "array" } }, { $expr: { $lt: [{ $size: "$roles" }, 5] } }],
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
      const { data } = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${encodedTitle}`, options);
      const allMovies = data.results;

      // Return a movie that has the same title and release year
      const matchingMovies = allMovies.filter((movie) => {
        const matchingMovieYear = movie["release_date"].substring(0, 4);
        return (
          movie.title.toLowerCase() === movieTitle.toLowerCase() && Number(matchingMovieYear) === Number(movieYear)
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
        const castActing = cast.filter((actor) => actor.known_for_department === "Acting");

        for (const actor of actors) {
          // console.log(`Checking actor: ${actor.personal_info.name}`)
          // await new Promise((resolve) => setTimeout(resolve, 100));

          // For every actor in the db find if he has played in this movie
          const playedActor = castActing.filter(
            (castActor) =>
              castActor.name.toLowerCase().includes(actor.personal_info.name.toLowerCase()) ||
              actor.personal_info.name.toLowerCase().includes(castActor.name.toLowerCase())
          );

          if (playedActor.length > 0) {
            try {
              const existingRole = await Role.findOne({
                filmTitle: movie.title,
                characterName: playedActor[0].character,
              });

              if (!existingRole) {
                console.log("Role not in the db, proceeding");
                const filmwebRole = await getRoleImageAndNameFromFilmwebPagePuppeteer(
                  "movie",
                  movie.title,
                  movie.year,
                  actor.personal_info.name
                );
                const roleImg = filmwebRole.roleImgPath ? filmwebRole.roleImgPath : null;
                const awsImageUrl = roleImg ? await uploadFileToAWSfromUrl(roleImg) : null;

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
                console.log("Role saved, proceeding to add the role to the actor");

                // Add the role to the actor and wait for the update to finish
                await Actor.findByIdAndUpdate(actor._id, {
                  $push: { roles: savedRole._id },
                });
                console.log("Role added to actor");
              } else {
                console.log("Role already in the db");
              }
            } catch (err) {
              console.error(`Error processing role for ${playedActor[0].name} in movie ${movie.title}`, err);
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
      const { data } = await axios.get(`https://api.themoviedb.org/3/search/tv?query=${encodedTitle}`, options);
      const allMovies = data.results;

      // Return a movie that has the same title and release year
      const matchingMovies = allMovies.filter((movie) => {
        const matchingMovieYear = movie["first_air_date"].substring(0, 4);
        return movie.name.toLowerCase() === movieTitle.toLowerCase() && Number(matchingMovieYear) === Number(movieYear);
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
        const castActing = cast.filter((actor) => actor.known_for_department === "Acting");

        for (const actor of actors) {
          // await new Promise((resolve) => setTimeout(resolve, 100));

          // For every actor in the db find if he has played in this movie
          const playedActor = castActing.filter(
            (castActor) =>
              castActor.name.toLowerCase().includes(actor.personal_info.name.toLowerCase()) ||
              actor.personal_info.name.toLowerCase().includes(castActor.name.toLowerCase())
          );

          if (playedActor.length > 0) {
            try {
              const existingRole = await Role.findOne({
                filmTitle: movie.title,
                characterName: playedActor[0].character,
              });

              if (!existingRole) {
                console.log("Role not in the db, proceeding");
                const filmwebRole = await getRoleImageAndNameFromFilmwebPagePuppeteer(
                  "serie",
                  movie.title,
                  movieYear,
                  actor.personal_info.name
                );
                const roleImg = filmwebRole.roleImgPath ? filmwebRole.roleImgPath : null;
                const awsImageUrl = roleImg ? await uploadFileToAWSfromUrl(roleImg) : null;

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
                console.log("Role saved, proceeding to add the role to the actor");

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
  51329, 73457, 72129, 60898, 3894, 1640, 2478, 4491, 1001657, 51072, 5472, 1427948, 1922, 56365, 53714, 1590797, 884,
  12795, 10860, 84223, 40462, 1327, 3895, 8167, 8891, 22226, 776, 1003,
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
      const lastAirDate = last_air_date && new Date(last_air_date);
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
        })
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
          const randomImageMaxCount = Math.floor(Math.random() * (13 - 5 + 1)) + 5;
          const photoPromises = res.data.backdrops.slice(0, randomImageMaxCount).map(async (photo, i) => {
            const bannerUrl = `https://image.tmdb.org/t/p/original${photo.file_path}`;
            // console.log("uploading img" + i);
            const banner = await uploadFileToAWSfromUrl(bannerUrl);
            setTimeout(() => {}, 700);
            photos.push(banner); // Store the uploaded image URL
          });

          await Promise.all(photoPromises);

          const videoRes = await axios.get(urlSerieVideos, options);
          const randomVideoMaxCount = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
          console.log("getting videos");

          videos = videoRes.data.results
            .filter((video) => video.type == "Trailer")
            .slice(0, randomVideoMaxCount)
            .map((trailer) => `https://youtube.com/watch?v=${trailer.key}`);
          console.log("got videos");
        })
        .catch((err) => console.log(err));

      const serieTitleCoded = title
        .replace(/[^a-zA-Z0-9]/g, " ")
        .replace(/\s+/g, "-")
        .trim();
      const serieReleaseDate = new Date(firstAirDate);

      const serieYear = serieReleaseDate.getFullYear();
      const serieTitleId = `${serieTitleCoded}-${serieYear}-${nanoid().slice(0, 6)}`;

      const serie = new Serie({
        title,
        titleId: serieTitleId,
        cover,
        banner,
        createdBy,
        description,
        genre: genreArray,
        originCountry: origin_country,
        firstAirDate,
        lastAirDate: lastAirDate && lastAirDate,
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
        itemType: "series",
      });

      serie
        .save()
        .then(console.log(`Serie ${title} saved in the db`))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}
const listOfSeriesByIdToFetch = [247767, 241609, 209876, 271855, 241114];

// setTimeout(() => {
//   console.log('fetching now')
// 	listOfSeriesByIdToFetch.forEach(async (serie) => {
// 		await getSerieFromTheMovieDBById(serie);
// 	});
// }, 1000);

async function getGameFromTheIGDBById(gameId) {
  const urlGame = `https://api.igdb.com/v4/games`;
  const searchQuery = `fields category, checksum, collection, collections, cover.url, created_at, dlcs.name, expanded_games, expansions.name, expansions.cover.url, first_release_date, follows, forks, franchise.name, franchises.name, genres.name, hypes, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, name, parent_game, platforms.name, rating, rating_count, screenshots.url, similar_games.name, standalone_expansions.name, status, storyline, summary, url, version_parent, version_title, videos.video_id;where id = ${gameId};`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      "Client-ID": "7l5442ioowsl72nd3t8kcxom4nneu2",
      Authorization: "Bearer ii7prjl7w609lypuxh0a0y5zup3zwi",
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
          })
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
          const screenshotUploaded = await uploadFileToAWSfromUrl(screenshotUrl);
          screenshot.url = screenshotUploaded;
          return screenshot.url;
        })
      );

      const videosLinks = videos.map((video) => `https://youtube.com/watch?v=${video.video_id}`);

      const platformsTrimmed = platforms.map((platform) => platform.name);
      const similarGames = similar_games.map((game) => game.name);

      const cover = await uploadFileToAWSfromUrl(coverUrl);
      const banner = await uploadFileToAWSfromUrl(bannerUrl);

      const gameTitleCoded = title
        .replace(/[^a-zA-Z0-9]/g, " ")
        .replace(/\s+/g, "-")
        .trim();
      const gameReleaseDate = new Date(releaseDate);

      const gameYear = gameReleaseDate.getFullYear();
      const gameTitleId = `${gameTitleCoded}-${gameYear}-${nanoid().slice(0, 6)}`;

      const game = new Game({
        title,
        titleId: gameTitleId,
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
        itemType: "games",
      });

      game
        .save()
        .then(console.log("game saved in the db"))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}
const listOfGamesToFetch = [297805, 296837, 258065, 258065, 309653, 251771];
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
  497, 13, 155, 278, 475557, 603, 157336, 27205, 103663, 121, 423, 120, 807, 122, 424, 550, 8681, 9800, 203801, 14,
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
    $and: [{ roles: { $exists: true, $type: "array" } }, { $expr: { $lt: [{ $size: "$roles" }, 5] } }],
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
      const actorResponse = await axios.get(`https://api.themoviedb.org/3/search/person?query=${encodedName}`, options);
      const actors = actorResponse.data.results;
      const filteredActor = actors.filter(
        (actorRes) => actor.personal_info.name === actorRes.name && actorRes.known_for_department === "Acting"
      );

      if (filteredActor.length > 0) {
        // If actor from the db matches the actor from themoviedb api response
        const actorId = filteredActor[0].id;
        try {
          // Get actor film details
          let actorDetails = await axios.get(
            `https://api.themoviedb.org/3/person/${actorId}/combined_credits`,
            options
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
          const actorSeriesToAdd = actorPopularSeries.filter((item) => !valuesSetSeries.has(item["name"])).slice(0, 5);

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

      const mediaReleaseDate = type === "movies" || type === "games" ? media.releaseDate : media.firstAirDate;
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
          const randomImageMaxCount = Math.floor(Math.random() * (13 - 5 + 1)) + 5;
          const photoPromises = res.data.backdrops.slice(0, randomImageMaxCount).map(async (photo, i) => {
            const bannerUrl = `https://image.tmdb.org/t/p/original${photo.file_path}`;
            console.log("uploading img" + i);
            const banner = await uploadFileToAWSfromUrl(bannerUrl);
            setTimeout(() => {}, 700);
            photos.push(banner); // Store the uploaded image URL
          });

          await Promise.all(photoPromises);

          const videoRes = await axios.get(urlMovieVideos, options);
          const randomVideoMaxCount = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
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
  497, 155, 13, 278, 475557, 603, 157336, 27205, 103663, 121, 423, 120, 807, 122, 424, 550, 8681, 9800, 203801, 14,
  347123,
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
      const seriesResponse = await axios.get(`https://api.themoviedb.org/3/search/tv?query=${encodedName}`, options);
      const foundSeries = seriesResponse.data.results;
      const filteredSerie = foundSeries.filter((serieRes) => serie.title === serieRes.name);

      if (filteredSerie.length > 0) {
        // If serie from the db matches the serie from themoviedb api response
        const serieId = filteredSerie[0].id;
        try {
          // Get serie details
          let seriePhotos = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}/images`, options);

          const photos = [];
          let videos = [];

          const randomImageMaxCount = Math.floor(Math.random() * (13 - 5 + 1)) + 5;

          const photoPromises = seriePhotos.data.backdrops.slice(0, randomImageMaxCount).map(async (photo, i) => {
            const bannerUrl = `https://image.tmdb.org/t/p/original${photo.file_path}`;
            console.log("uploading img" + i);
            const banner = await uploadFileToAWSfromUrl(bannerUrl);
            setTimeout(() => {}, 700);
            photos.push(banner); // Store the uploaded image URL
          });

          await Promise.all(photoPromises);

          const videoRes = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}/videos`, options);
          const randomVideoMaxCount = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
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
      const actorResponse = await axios.get(`https://api.themoviedb.org/3/search/person?query=${encodedName}`, options);
      const actors = actorResponse.data.results;
      const filteredActor = actors.filter(
        (actorRes) => actor.personal_info.name === actorRes.name && actorRes.known_for_department === "Acting"
      );

      if (filteredActor.length > 0) {
        // If actor from the db matches the actor from themoviedb api response
        const actorId = filteredActor[0].id;
        try {
          // Get actor film details
          let actorDetails = await axios.get(`https://api.themoviedb.org/3/person/${actorId}`, options);
          const actorSex = actorDetails.data.gender === 2 ? "male" : "female";
          if (!actor.personal_info.sex) {
            await Actor.updateOne({ _id: actor._id }, { "personal_info.sex": actorSex });
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

async function addTypeToMedias() {
  try {
    const movies = await Movie.find({});
    const series = await Serie.find({});
    const games = await Game.find({});

    // Loop through each document
    for (const movie of movies) {
      if (movie.itemType) return;
      movie.itemType = "movies";
      // Save the updated document
      await movie.save();
      console.log("movie item type saved!");
    }
    for (const serie of series) {
      if (serie.itemType) return;
      serie.itemType = "series";
      // Save the updated document
      await serie.save();
      console.log("serie item type saved!");
    }
    for (const game of games) {
      if (game.itemType) return;
      game.itemType = "games";

      // Save the updated document
      await game.save();
      console.log("game item type saved!");
    }
  } catch (err) {
    console.log(err);
  }
}

// addTypeToMedias();

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

const renameActivityFields = async () => {
  try {
    const result = await Review.updateMany(
      {},
      {
        $rename: {
          "activity.total_comments": "activity.totalComments",
          "activity.total_parent_comments": "activity.totalParentComments",
        },
      },
      {
        // Strict allows to update keys that do not exist anymore in the schema
        strict: false,
      }
    );
    console.log("Update result:", result);
  } catch (err) {
    console.error("Error:", err);
  }
};

async function findDocumentCollectionById(id) {
  try {
    const db = mongoose.connection.db;

    // Step 1: Get all collection names
    const collections = await db.listCollections().toArray();

    for (const collection of collections) {
      const collectionName = collection.name;

      // Step 2: Dynamically access the collection and search by _id
      const result = await db.collection(collectionName).findOne({ _id: new mongoose.Types.ObjectId(id) });

      if (result) {
        return collectionName; // Found the document
      }
    }

    return null; // Document not found in any collection
  } catch (error) {
    console.error("Error finding document by id:", error);
  }
}

const getGenres = async () => {
  const genres = [];
  try {
    const movies = await Movie.find();

    for (const movie of movies) {
      movie.genre.map((genre) => {
        if (!genres.includes(genre)) genres.push(genre);
      });
    }
    console.log(genres);
  } catch (err) {
    console.log(err);
  }
};
