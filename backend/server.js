import express from 'express'
import cors from 'cors'
import users from './routes/users.js'
import userMovieInfo from './routes/userMovieInfo.js'
import movies from './routes/movies.js'
import shows from './routes/shows.js'
import directors from './routes/directors.js'
import actors from './routes/actors.js'
import { dir } from 'console'

const PORT = process.env.PORT || 5050
const app = express()

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE', 'PATCH'] }))
app.use(express.json())
app.use('/users', users)
app.use('/userMovieInfo', userMovieInfo)
app.use('/movies', movies)
app.use('/shows', shows)
app.use('/directors', directors)
app.use('/actors', actors)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

export default app
