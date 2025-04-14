// function for generating a list of recommended movies and shows based on the user's watching preferences
// parameters: user id
import { getUserMovieInfoByUserID, getMoviesWithGenres, getShowsWithGenres } from '../pages/api'

const APP_URL = process.env.APP_URL
const LOCAL_URL = 'http://localhost:5050/'

export const generateRecommendations = async (userID) => {
  const userInfoURL = `${LOCAL_URL}userMovieInfo/user/${userID}`
  const moviesURL = `${LOCAL_URL}movies`
  const showsURL = `${LOCAL_URL}shows`

  try {
    const [userInfoRes, moviesRes, showsRes] = await Promise.all([
      fetch(userInfoURL),
      fetch(moviesURL),
      fetch(showsURL),
    ])

    if (!userInfoRes.ok || !moviesRes.ok || !showsRes.ok) {
      console.error('fetches failed')
      return { movies: [], shows: [] }
    }

    const userMovieInfo = await userInfoRes.json()
    const allMovies = await moviesRes.json()
    const allShows = await showsRes.json()

    const genreWeights = {}

    // Map movieID => movie object
    const movieMap = {}
    allMovies.forEach((movie) => {
      movieMap[movie.movieID] = movie
    })

    userMovieInfo.forEach((entry) => {
      const movie = movieMap[entry.movieID]
      if (!movie || !movie.genres) return

      const genres = movie.genres
      const rating = entry.userMovieRating
      const timeWatchedTicks = entry.timeStamp || 0
      const watchTimeMinutes = timeWatchedTicks / 600000000
      const scaledWatchTime = Math.log1p(watchTimeMinutes)

      let ratingWeight = 0
      if (rating === 'dislike') ratingWeight = -1
      else if (rating === 'like') ratingWeight = 1
      else if (rating === 'love') ratingWeight = 2

      const weight = scaledWatchTime + ratingWeight

      genres.forEach((genre) => {
        genreWeights[genre] = (genreWeights[genre] || 0) + weight
      })
    })

    const sortedGenres = Object.entries(genreWeights).sort((a, b) => b[1] - a[1])
    const genreList = sortedGenres.map(([genre]) => genre)

    const filteredMovies = allMovies.filter((movie) =>
      movie.genres?.some((genre) => genreList.includes(genre))
    )
    const filteredShows = allShows.filter((show) =>
      show.genres?.some((genre) => genreList.includes(genre))
    )

    return {
      movies: filteredMovies,
      shows: filteredShows,
    }
  } catch (error) {
    console.error('Error in generateRecommendations:', error)
    return { movies: [], shows: [] }
  }
}
