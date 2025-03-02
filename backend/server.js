import express from 'express'
import cors from 'cors'
import users from './routes/users.js'
import userMovieInfo from './routes/userMovieInfo.js'
import movies from './routes/movies.js'

const PORT = process.env.PORT || 5050
const app = express()

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE'] }))
app.use(express.json())
app.use('/users', users)
app.use('/userMovieInfo', userMovieInfo)
app.use('/movies', movies)

// start the express server (uncomment when running locally)
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

export default app
