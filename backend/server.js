import express from 'express'
import cors from 'cors'
import users from './routes/users.js'

const PORT = process.env.PORT || 5050
const app = express()

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE'] }))
app.use(express.json())
app.use('/users', users)

export default app
