import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { connectDatabase } from './config/database.js'

const app = express()
const port = Number(process.env.PORT || 8000)
const codespaceName = process.env.CODESPACE_NAME
export const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

app.use(cors())
app.use(express.json())
app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', database: 'connected' })
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