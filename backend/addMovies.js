import db from './db/connection.js';

const API_URL = process.env.API_URL; // Replace with your API URL

const addMoviesToDatabase = async () => {
  try {
    // Fetch movies from the API
	const response = await fetch(API_URL + `/Items?Recursive=true&IncludeItemTypes=Movie`, {
	headers: { 'X-Emby-Token': process.env.API_TOKEN },
	})
	console.log('movies')
	const movies = await response.json()
	
    // Connect to the movies collection
    const collection = await db.collection('movies');

    // Prepare movies with default rating
    const moviesToInsert = movies.map((movie) => ({
      movieID: movie.id, // Assuming the API returns an `id` field
      title: movie.title,
      overall_rating: 0, // Default rating
      genres: movie.genres || [],
      movie_length: movie.runtime || 0,
      actors: movie.actors || [],
      directors: movie.directors || [],
    }));

    // Insert movies into the database
    const result = await collection.insertMany(moviesToInsert);
    console.log(`Successfully added ${result.insertedCount} movies to the database.`);
  } catch (error) {
    console.error('Error adding movies to the database:', error);
  } finally {
    // Close the database connection
    console.log("done")
  }
};

addMoviesToDatabase();