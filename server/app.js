import express from 'express'
import cors from 'cors'

import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

const createApp = () => {
  const app = express()
  app.use(express.json())
  app.use(cors())

  app.use('/api/user', userRouter)
  app.use('/api/image', imageRouter)
  app.get('/', (req, res) => res.send('API Working'))

  return app
}

export default createApp
