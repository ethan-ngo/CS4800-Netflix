import db from './db/connection.js'
import fetch from 'node-fetch'
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL
const API_TOKEN = process.env.REACT_APP_ACCESS_TOKEN
const TMDB_API_KEY = process.env.TMDB_API_KEY

console.log('Using Jellyfin API:', API_URL)

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US',
  },
})

// TMDB: Get movie genres by title and year
const getMovieGenres = async (title, year) => {
  try {
    const res = await tmdbApi.get('/search/movie', {
      params: { query: title, primary_release_year: year },
    })
    const movie = res.data.results[0]
    if (!movie) return []
    const details = await tmdbApi.get(`/movie/${movie.id}`)
    return details.data.genres.map((g) => g.name)
  } catch (err) {
    console.error(`TMDB movie error for "${title}" (${year}):`, err.message)
    return []
  }
}

// TMDB: Get show genres by title and year
const getShowGenres = async (title, year) => {
  try {
    const res = await tmdbApi.get('/search/tv', {
      params: { query: title, first_air_date_year: year },
    })
    const show = res.data.results[0]
    if (!show) return []
    const details = await tmdbApi.get(`/tv/${show.id}`)
    return details.data.genres.map((g) => g.name)
  } catch (err) {
    console.error(`TMDB show error for "${title}" (${year}):`, err.message)
    return []
  }
}

// Insert movies into the "movies" collection
const addMoviesToDatabase = async () => {
  try {
    const collection = await db.collection('movies')
    await collection.deleteMany({})
    console.log('Cleared existing movies from the database.')

    const response = await fetch(`${API_URL}/Items?Recursive=true&IncludeItemTypes=Movie`, {
      headers: { 'X-Emby-Token': API_TOKEN },
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Jellyfin movie fetch failed: ${response.status} - ${text}`)
    }

    const { Items: movies } = await response.json()
    const moviesToInsert = []

    for (const movie of movies) {
      const title = movie.Name
      const year = movie.ProductionYear || undefined
      const genres = await getMovieGenres(title, year)

      const enrichedMovie = {
        movieID: movie.Id,
        title: title,
        overall_rating: 0,
        genres: genres,
        movie_length: movie.RunTimeTicks || 0,
        actors: [],
        directors: [],
      }

      moviesToInsert.push(enrichedMovie)
      console.log(`Prepared movie "${title}" (${year}) with genres: ${genres.join(', ') || 'none'}`)
    }

    const result = await collection.insertMany(moviesToInsert)
    console.log(`Successfully added ${result.insertedCount} movies to the database.`)
  } catch (error) {
    console.error('Error adding movies to the database:', error)
  }
}

// Insert shows into the "shows" collection
const addShowsToDatabase = async () => {
  try {
    const collection = await db.collection('shows')
    await collection.deleteMany({})
    console.log('Cleared existing shows from the database.')

    const response = await fetch(`${API_URL}/Items?Recursive=true&IncludeItemTypes=Series`, {
      headers: { 'X-Emby-Token': API_TOKEN },
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Jellyfin show fetch failed: ${response.status} - ${text}`)
    }

    const { Items: shows } = await response.json()
    const showsToInsert = []

    for (const show of shows) {
      const title = show.Name
      const year = show.ProductionYear || undefined
      const genres = await getShowGenres(title, year)

      const enrichedShow = {
        showID: show.Id,
        title: title,
        overall_rating: 0,
        genres: genres,
        show_length: show.RunTimeTicks || 0,
        actors: [],
        directors: [],
      }

      showsToInsert.push(enrichedShow)
      console.log(`Prepared show "${title}" (${year}) with genres: ${genres.join(', ') || 'none'}`)
    }

    const result = await collection.insertMany(showsToInsert)
    console.log(`Successfully added ${result.insertedCount} shows to the database.`)
  } catch (error) {
    console.error('Error adding shows to the database:', error)
  }
}

await addMoviesToDatabase()
await addShowsToDatabase()
console.log('Script finished.')
