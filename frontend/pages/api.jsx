/**
 * API Utility Functions
 * 
 * This file contains utility functions for interacting with the backend API and TMDb API.
 * It includes functions for fetching movies, shows, user-specific data, and genre-based data.
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL?.replace(/\/$/, '');
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const APP_URL = process.env.APP_URL;
const LOCAL_URL = process.env.LOCAL_URL;

export { API_URL, ACCESS_TOKEN };

// TMDb API instance
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

/**
 * Fetches all media items from the backend API.
 * 
 * @returns {Promise<Object[]>} - A list of all media items.
 */
export const getItems = async () => {
  const response = await fetch(`${API_URL}/Items?Recursive=true`, {
    headers: { 'X-Emby-Token': ACCESS_TOKEN },
  });
  const data = await response.json();
  return data.Items;
};

/**
 * Fetches all movies from the backend API.
 * 
 * @returns {Promise<Object[]>} - A list of all movies.
 */
export const getMovies = async () => {
  const response = await fetch(`${API_URL}/Items?Recursive=true&IncludeItemTypes=Movie`, {
    headers: { 'X-Emby-Token': ACCESS_TOKEN },
  });
  const data = await response.json();
  return data.Items;
};

/**
 * Fetches all TV shows from the backend API.
 * 
 * @returns {Promise<Object[]>} - A list of all TV shows.
 */
export const getShows = async () => {
  const response = await fetch(`${API_URL}/Items?Recursive=true&IncludeItemTypes=Series`, {
    headers: { 'X-Emby-Token': ACCESS_TOKEN },
  });
  const data = await response.json();
  return data.Items;
};

/**
 * Fetches detailed information about a movie from TMDb.
 * 
 * @param {string} movieName - The name of the movie to fetch details for.
 * @returns {Promise<Object|null>} - An object containing movie details and cast, or null if not found.
 */
export const getMovieDetails = async (movieName) => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: { query: movieName },
    });

    const movie = response.data.results[0];
    if (!movie) {
      console.error('Movie not found');
      return null;
    }

    const movieId = movie.id;
    const castResponse = await tmdbApi.get(`/movie/${movieId}/credits`);
    const cast = castResponse.data.cast;

    return {
      movieId,
      movieDetails: movie,
      cast,
    };
  } catch (error) {
    console.error('Error fetching movie details and cast:', error);
    return null;
  }
};

/**
 * Fetches detailed information about a TV show from TMDb.
 * 
 * @param {string} showName - The name of the TV show to fetch details for.
 * @returns {Promise<Object|null>} - An object containing show details and cast, or null if not found.
 */
export const getShowDetails = async (showName) => {
  try {
    const response = await tmdbApi.get('/search/tv', {
      params: { query: showName },
    });

    if (response.data.results.length === 0) {
      console.error('TV Show not found');
      return null;
    }

    const show = response.data.results[0];
    const showId = show.id;

    const showDetailsResponse = await tmdbApi.get(`/tv/${showId}`);
    const castResponse = await tmdbApi.get(`/tv/${showId}/credits`);

    return {
      showId,
      showDetails: showDetailsResponse.data,
      cast: castResponse.data.cast,
    };
  } catch (error) {
    console.error('Error fetching show details and cast:', error);
    return null;
  }
};

/**
 * Fetches user-specific movie information based on userID and movieID.
 * 
 * @param {string} userID - The ID of the user.
 * @param {string} movieID - The ID of the movie.
 * @returns {Promise<Object|null>} - The user's movie information, or null if not found.
 */
export const getUserMovieByIDS = async (userID, movieID) => {
  try {
    const response = await fetch(`${APP_URL}userMovieInfo/${userID}/${movieID}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching UserMovieInfo:', error);
    return null;
  }
};

/**
 * Creates a new user-specific movie record.
 * 
 * @param {string} userID - The ID of the user.
 * @param {string} movieID - The ID of the movie.
 * @param {number} numWatched - Number of times the movie has been watched.
 * @param {number} timeStamp - Current playback timestamp.
 * @param {boolean} isBookmarked - Whether the movie is bookmarked.
 * @param {number} userMovieRating - User's rating for the movie.
 * @returns {Promise<Object|null>} - The created user movie record, or null on failure.
 */
export const newUserMovie = async (userID, movieID, numWatched, timeStamp, isBookmarked, userMovieRating) => {
  try {
    const response = await fetch(`${APP_URL}userMovieInfo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userID,
        movieID,
        numWatched,
        timeStamp,
        isBookmarked,
        userMovieRating,
      }),
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error creating user movie record:', error);
    return null;
  }
};

/**
 * Updates an existing user-specific movie record.
 * 
 * @param {string} _id - The ID of the user movie record.
 * @param {string} userID - The ID of the user.
 * @param {string} movieID - The ID of the movie.
 * @param {number} numWatched - Number of times the movie has been watched.
 * @param {number} timeStamp - Current playback timestamp.
 * @param {boolean} isBookmarked - Whether the movie is bookmarked.
 * @param {number} userMovieRating - User's rating for the movie.
 * @returns {Promise<Object|null>} - The updated user movie record, or null on failure.
 */
export const setUserMovieInfo = async (_id, userID, movieID, numWatched, timeStamp, isBookmarked, userMovieRating) => {
  try {
    const response = await fetch(`${APP_URL}userMovieInfo/${_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userID,
        movieID,
        numWatched,
        timeStamp,
        isBookmarked,
        userMovieRating,
      }),
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error updating user movie record:', error);
    return null;
  }
};

/**
 * Fetches movies grouped by genre.
 * 
 * @returns {Promise<Object>} - A map of genres to their respective movies.
 */
export const getMoviesByGenre = async () => {
  try {
    const movieRes = await fetch(`${APP_URL}movies`);
    const allMovies = await movieRes.json();
    const embyItems = await getItems();
    const genreMap = {};

    allMovies.forEach((movie) => {
      const matchedItem = embyItems.find((item) => item.Id === movie.movieID);
      if (!matchedItem) return;

      const combinedMovie = {
        ...movie,
        embyInfo: matchedItem,
      };
      movie.genres.forEach((genre) => {
        if (!genreMap[genre]) {
          genreMap[genre] = [];
        }
        genreMap[genre].push(combinedMovie);
      });
    });

    return genreMap;
  } catch (error) {
    console.error('Error loading movies by genre:', error);
    return {};
  }
};