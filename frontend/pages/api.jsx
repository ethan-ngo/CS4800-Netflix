/**
 * API Utility Functions
 * 
 * This file contains utility functions for interacting with the backend API and TMDb API.
 * It includes functions for fetching movies, shows, user-specific data, and genre-based data.
 */
import axios from 'axios'

// API and environment configuration
const API_URL = process.env.REACT_APP_API_URL?.replace(/\/$/, '')
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN
const API_KEY = process.env.TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const APP_URL = process.env.APP_URL
const LOCAL_URL = process.env.LOCAL_URL

export { API_URL, ACCESS_TOKEN }

/**
 * Fetches all media items from Emby.
 * @returns {Promise<Array>} Array of item objects.
 */
export const getItems = async () => {
  const response = await fetch(`${API_URL}/Items?Recursive=true`, {
    headers: { 'X-Emby-Token': ACCESS_TOKEN },
  })
  const data = await response.json()
  return data.Items
}

/**
 * Fetches all movies from Emby.
 * @returns {Promise<Array>} Array of movie item objects.
 */
export const getMovies = async () => {
  const response = await fetch(`${API_URL}/Items?Recursive=true&IncludeItemTypes=Movie`, {
    headers: { 'X-Emby-Token': ACCESS_TOKEN },
  })
  const data = await response.json()
  return data.Items
}

/**
 * Fetches all TV shows from Emby.
 * @returns {Promise<Array>} Array of show item objects.
 */
export const getShows = async () => {
  const response = await fetch(`${API_URL}/Items?Recursive=true&IncludeItemTypes=Series`, {
    headers: { 'X-Emby-Token': ACCESS_TOKEN },
  })
  const data = await response.json()
  return data.Items
}

// TMDB API wrapper
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
})

/**
 * Fetches movie details and cast info from TMDB by movie name.
 * @param {string} movieName - The name of the movie.
 * @returns {Promise<Object|null>} Movie and cast details or null if not found.
 */
export const getMovieDetails = async (movieName) => {
  try {
    const response = await tmdbApi.get('/search/movie', { params: { query: movieName } })
    const movie = response.data.results[0]
    if (!movie) return null

    const movieId = movie.id
    const castResponse = await tmdbApi.get(`/movie/${movieId}/credits`)
    return { movieId, movieDetails: movie, cast: castResponse.data.cast }
  } catch (error) {
    console.error('Error fetching movie details and cast:', error)
    return null
  }
}

/**
 * Fetches TV show details and cast info from TMDB by show name.
 * @param {string} showName - The name of the TV show.
 * @returns {Promise<Object|null>} Show and cast details or null if not found.
 */
export const getShowDetails = async (showName) => {
  try {
    const response = await tmdbApi.get('/search/tv', { params: { query: showName } })
    if (response.data.results.length === 0) return null

    const show = response.data.results[0]
    const showId = show.id
    const showDetailsResponse = await tmdbApi.get(`/tv/${showId}`)
    const castResponse = await tmdbApi.get(`/tv/${showId}/credits`)
    return { showId, showDetails: showDetailsResponse.data, cast: castResponse.data.cast }
  } catch (error) {
    console.error('Error fetching show details and cast:', error)
    return null
  }
}

/**
 * Fetch a single user-movie relationship by user ID and movie ID.
 * @param {string} userID 
 * @param {string} movieID 
 * @returns {Promise<Object|null>}
 */
export const getUserMovieByIDS = async (userID, movieID) => {
  try {
    const response = await fetch(`${APP_URL}userMovieInfo/${userID}/${movieID}`)
    if (response.ok) return await response.json()
  } catch (error) {
    console.error('Error fetching UserMovieInfo')
  }
  return null
}

/**
 * Create a new user-movie info record.
 * @returns {Promise<Object|null>}
 */
export const newUserMovie = async (userID, movieID, numWatched, timeStamp, isBookmarked, userMovieRating) => {
  try {
    const response = await fetch(`${APP_URL}userMovieInfo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID, movieID, numWatched, timeStamp, isBookmarked, userMovieRating }),
    })
    if (response.ok) return await response.json()
  } catch (error) {
    console.error(error)
  }
  return null
}

/**
 * Update an existing user-movie info record.
 * @returns {Promise<Object|null>}
 */
export const setUserMovieInfo = async (_id, userID, movieID, numWatched, timeStamp, isBookmarked, userMovieRating) => {
  try {
    const response = await fetch(`${APP_URL}userMovieInfo/${_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID, movieID, numWatched, timeStamp, isBookmarked, userMovieRating }),
    })
    if (response.ok) return await response.json()
  } catch (error) {
    console.error(error)
  }
  return null
}

/**
 * Get all user-movie info entries for a user.
 * @param {string} userID 
 * @returns {Promise<Array>}
 */
export const getUserMovieInfoByUserID = async (userID) => {
  try {
    const response = await fetch(`${APP_URL}userMovieInfo/user/${userID}`)
    if (response.ok) return await response.json()
  } catch (err) {
    console.error('Error fetching all userMovieInfo for user:', err)
  }
  return []
}

/**
 * Fetch a single user-show info by user ID and show ID.
 * @param {string} userID 
 * @param {string} showID 
 * @returns {Promise<Object|null>}
 */
export const getUserShowByIDS = async (userID, showID) => {
  try {
    const response = await fetch(`${APP_URL}userShowInfo/${userID}/${showID}`)
    if (response.ok) return await response.json()
  } catch (error) {
    console.error('Error fetching userShowInfo:', error)
  }
  return null
}

/**
 * Create a new user-show info record.
 * @returns {Promise<Object|undefined>}
 */
export const newUserShow = async (userID, showID, numWatched, timeStamp, isBookmarked, userShowRating) => {
  try {
    const response = await fetch(`${APP_URL}userShowInfo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID, showID, numWatched, timeStamp, isBookmarked, userShowRating }),
    })
    if (response.ok) return await response.json()
  } catch (error) {
    console.error('Error creating userShowInfo:', error)
  }
}

/**
 * Update an existing user-show info record.
 * @returns {Promise<Object|undefined>}
 */
export const setUserShowInfo = async (_id, userID, showID, numWatched, timeStamp, isBookmarked, userShowRating) => {
  try {
    const response = await fetch(`${APP_URL}userShowInfo/${_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID, showID, numWatched, timeStamp, isBookmarked, userShowRating }),
    })
    if (response.ok) return await response.json()
  } catch (error) {
    console.error('Error updating userShowInfo:', error)
  }
}

/**
 * Groups movies by genre and returns a genre-to-movies mapping.
 * @returns {Promise<Object>} Genre map with movies under each genre.
 */
export const getMoviesByGenre = async () => {
  try {
    const movieRes = await fetch(`${APP_URL}movies`)
    const allMovies = await movieRes.json()
    const embyItems = await getItems()
    const genreMap = {}

    allMovies.forEach((movie) => {
      const matchedItem = embyItems.find((item) => item.Id === movie.movieID)
      if (!matchedItem) return

      const combinedMovie = { ...movie, embyInfo: matchedItem }
      movie.genres.forEach((genre) => {
        if (!genreMap[genre]) genreMap[genre] = []
        genreMap[genre].push(combinedMovie)
      })
    })

    return genreMap
  } catch (error) {
    console.error('Error loading movies by genre:', error)
    return {}
  }
}
