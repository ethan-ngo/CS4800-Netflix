import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL?.replace(/\/$/, '')
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN

// tmdb api
const API_KEY = process.env.TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const APP_URL = process.env.APP_URL
const LOCAL_URL = process.env.LOCAL_URL

export { API_URL, ACCESS_TOKEN }

export const getItems = async () => {
  const response = await fetch(`${API_URL}/Items?Recursive=true`, {
    headers: { 'X-Emby-Token': ACCESS_TOKEN },
  })
  console.log('items')
  const data = await response.json()
  return data.Items
}

export const getMovies = async () => {
  const response = await fetch(`${API_URL}/Items?Recursive=true&IncludeItemTypes=Movie`, {
    headers: { 'X-Emby-Token': ACCESS_TOKEN },
  })
  console.log('movies')
  const data = await response.json()
  return data.Items
}

export const getShows = async () => {
  const response = await fetch(`${API_URL}/Items?Recursive=true&IncludeItemTypes=Series`, {
    headers: { 'X-Emby-Token': ACCESS_TOKEN },
  })
  console.log('shows')
  const data = await response.json()
  return data.Items
}

// tmdb api
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
})

export const getMovieDetails = async (movieName) => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: {
        query: movieName,
      },
    })

    const movie = response.data.results[0]
    if (!movie) {
      console.error('Movie not found')
      return null
    }

    const movieId = movie.id

    const castResponse = await tmdbApi.get(`/movie/${movieId}/credits`)
    const cast = castResponse.data.cast

    return {
      movieId,
      movieDetails: movie,
      cast,
    }
  } catch (error) {
    console.error('Error fetching movie details and cast:', error)
    return null
  }
}

export const getShowDetails = async (showName) => {
  try {
    const response = await tmdbApi.get('/search/tv', {
      params: {
        query: showName,
      },
    })

    if (response.data.results.length === 0) {
      console.error('TV Show not found')
      return null
    }

    const show = response.data.results[0]
    const showId = show.id

    const showDetailsResponse = await tmdbApi.get(`/tv/${showId}`)
    const castResponse = await tmdbApi.get(`/tv/${showId}/credits`)

    return {
      showId,
      showDetails: showDetailsResponse.data,
      cast: castResponse.data.cast,
    }
  } catch (error) {
    console.error('Error fetching show details and cast:', error)
    return null
  }
}

// Returns a single instance of the user movie info based on userID and movieID
export const getUserMovieByIDS = async (userID, movieID) => {
  try {
    const response = await fetch(APP_URL + `userMovieInfo/${userID}/${movieID}`)
    if (response.ok) {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error('Error fetching UserMovieInfo')
    return null
  }
}

export const newUserMovie = async (
  userID,
  movieID,
  numWatched,
  timeStamp,
  isBookmarked,
  userMovieRating
) => {
  try {
    const response = await fetch(APP_URL + 'userMovieInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID: userID,
        movieID: movieID,
        numWatched: numWatched,
        timeStamp: timeStamp,
        isBookmarked: isBookmarked,
        userMovieRating: userMovieRating,
      }),
    })
    if (response.ok) {
      const data = await response.json()
      return data
    }
    return null
  } catch (error) {
    console.error(error)
  }
}

export const setUserMovieInfo = async (
  _id,
  userID,
  movieID,
  numWatched,
  timeStamp,
  isBookmarked,
  userMovieRating
) => {
  try {
    const response = await fetch(APP_URL + `userMovieInfo/${_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID: userID,
        movieID: movieID,
        numWatched: numWatched,
        timeStamp: timeStamp,
        isBookmarked: isBookmarked,
        userMovieRating: userMovieRating,
      }),
    })
    if (response.ok) {
      const data = await response.json()
      return data
    }
    return null
  } catch (error) {
    console.error(error)
  }
}
// get all userMovieInfo instances for a user
export const getUserMovieInfoByUserID = async (userID) => {
  try {
    const response = await fetch(`${APP_URL}userMovieInfo/user/${userID}`)
    if (response.ok) {
      return await response.json()
    }
  } catch (err) {
    console.error('Error fetching all userMovieInfo for user:', err)
    return []
  }
}

export const getUserShowByIDS = async (userID, showID) => {
  try {
    const url = `${APP_URL}userShowInfo/${userID}/${showID}`
    console.log('Fetching userShowInfo from:', url)
    const response = await fetch(url)
    if (response.ok) {
      return await response.json()
    } else {
      console.error('Fetch failed with status:', response.status)
      const text = await response.text()
      console.error('Response text:', text)
    }
  } catch (error) {
    console.error('Error fetching userShowInfo:', error)
    return null
  }
}

export const newUserShow = async (
  userID,
  showID,
  numWatched,
  timeStamp,
  isBookmarked,
  userShowRating
) => {
  try {
    const response = await fetch(`${APP_URL}userShowInfo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userID,
        showID,
        numWatched,
        timeStamp,
        isBookmarked,
        userShowRating,
      }),
    })
    if (response.ok) return await response.json()
  } catch (error) {
    console.error('Error creating userShowInfo:', error)
  }
}

export const setUserShowInfo = async (
  _id,
  userID,
  showID,
  numWatched,
  timeStamp,
  isBookmarked,
  userShowRating
) => {
  try {
    const response = await fetch(`${APP_URL}userShowInfo/${_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userID,
        showID,
        numWatched,
        timeStamp,
        isBookmarked,
        userShowRating,
      }),
    })
    if (response.ok) return await response.json()
  } catch (error) {
    console.error('Error updating userShowInfo:', error)
  }
}


 //genre functions
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

