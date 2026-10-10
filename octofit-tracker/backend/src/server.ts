import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { connectDatabase } from './config/database.js'
import activity from './models/activity.js'
import leaderboard from './models/leaderboard.js'
import team from './models/team.js'
import user from './models/user.js'
import workout from './models/workout.js'

const app = express()
const port = Number(process.env.PORT || 8000)
const codespaceName = process.env.CODESPACE_NAME
export const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

app.use(cors())
app.use(express.json())
app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    database: user.db.readyState === 1 ? 'connected' : 'disconnected',
  })
})

app.get('/api/users/', async (_request, response) => {
  response.json(await user.find().lean())
})

app.get('/api/teams/', async (_request, response) => {
  response.json(await team.find().populate('members', 'name email').lean())
})

app.get('/api/activities/', async (_request, response) => {
  response.json(await activity.find().populate('user', 'name email').populate('team', 'name').lean())
})

app.get('/api/leaderboard/', async (_request, response) => {
  response.json(await leaderboard.find().sort({ period: 1, rank: 1 })
    .populate('user', 'name')
    .populate('team', 'name')
    .lean())
})

app.get('/api/workouts/', async (_request, response) => {
  response.json(await workout.find().lean())
})

async function start() {
  await connectDatabase()
  app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit API listening at ${baseUrl}`)
  })
}

start().catch((error: unknown) => {
  console.error('Unable to start the OctoFit API:', error)
  process.exitCode = 1
})