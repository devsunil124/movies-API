const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
let db = null;
const dbPath = path.join(__dirname, "moviesData.db");
const intializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Sever Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB error : ${e.message}`);
    process.exit(1);
  }
};
intializeDbAndServer();

// api 1 =============================================================

app.get("/movies/", async (request, response) => {
  const getMovieQuery = `
    SELECT
     movie_name
     FROM
     movie;`;
  const moviesArray = await db.all(getMovieQuery);
  response.send(
    moviesArray.map((eachMovie) => ({ movieName: eachMovie.movie_name }))
  );
});

// Api 2===================================================================

app.post("/movies/", async (request, response) => {
  const MovieDetails = request.body;
  const { directorId, movieName, leadActor } = MovieDetails;
  const postMoviesQuey = `
    INSERT INTO
    movie (director_id,movie_name,lead_actor)
    VALUES(${directorId},${movieName},${leadActor});`;
  const dbResponse = await db.run(postMoviesQuey);
  const movieId = dbResponse.lastId;
  response.send("Movie Successfully Added");
});

//api 3==================================================

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  console.log(request.params);
  const getMovieQuery = `
    SELECT 
      * 
    FROM 
     movie
    WHERE
     movie_id = ${movieId};`;
  const Movie = await db.get(getMovieQuery);
  response.send(Movie);
  console.log(Movie);
});

//Api 4======================================================

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateMovieQuery = `
    UPDATE 
     movie
    SET 
     director_id = ${directorId},
     movie_name = ${movieName},
     lead_actor = ${leadActor}
     WHERE
      movie_id = ${movieId};`;
  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

// api 5 ============================================================
