// function for generating a list of recommended movies and shows based on the user's watching preferences
// parameters: user id

const APP_URL = process.env.APP_URL

export const generateRecommendations = async (userID) => {
  try {
    const movieInfoRes = await fetch(`${APP_URL}userMovieInfo/user/${userID}`)
    const showInfoRes = await fetch(`${APP_URL}userShowInfo/user/${userID}`)
    const moviesRes = await fetch(`${APP_URL}movies`)
    const showsRes = await fetch(`${APP_URL}shows`)

    if (!movieInfoRes.ok || !showInfoRes.ok || !moviesRes.ok || !showsRes.ok) {
      console.error('One or more fetches failed')
      return { movies: [], shows: [] }
    }

    const userMovieInfo = await movieInfoRes.json()
    const userShowInfo = await showInfoRes.json()
    const allMovies = await moviesRes.json()
    const allShows = await showsRes.json()

    const genreWeights = {}

    const movieMap = {}
    allMovies.forEach((movie) => {
      movieMap[movie.movieID] = movie
    })

    const showMap = {}
    allShows.forEach((show) => {
      showMap[show.showID] = show
    })

    const addWeights = (genres, rating, ticks) => {
      const watchTime = ticks / 600000000
      const scaledTime = Math.log1p(watchTime)

      let ratingWeight = rating

      const weight = scaledTime + ratingWeight

      genres.forEach((genre) => {
        if (!genreWeights[genre]) genreWeights[genre] = 0
        genreWeights[genre] += weight
      })
    }

    userMovieInfo.forEach((entry) => {
      const movie = movieMap[entry.movieID]
      if (movie?.genres) {
        addWeights(movie.genres, entry.userMovieRating, entry.timeStamp || 0)
      }
    })

    userShowInfo.forEach((entry) => {
      const show = showMap[entry.showID]
      if (show?.genres) {
        addWeights(show.genres, entry.userShowRating, entry.timeStamp || 0)
      }
    })

    console.log('Weighted genre dictionary:', genreWeights)

    const sortedGenres = Object.entries(genreWeights).sort((a, b) => b[1] - a[1])
    const genreList = sortedGenres.map(([g]) => g)

    const filteredMovies = allMovies.filter((m) => m.genres?.some((g) => genreList.includes(g)))

    const filteredShows = allShows.filter((s) => s.genres?.some((g) => genreList.includes(g)))

    return {
      movies: filteredMovies,
      shows: filteredShows,
    }
  } catch (err) {
    console.error('Error in generateRecommendations:', err)
    return { movies: [], shows: [] }
  }
}
