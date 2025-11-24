import createApp from '../app.js'
import connectDB from '../config/mongodb.js'
import serverless from 'serverless-http'

const app = createApp()

// Ensure DB connection is established (fire-and-forget). Vercel may cold-start.
connectDB().then(() => console.log('Database connected (serverless)')).catch(err => console.error('DB connect error (serverless):', err))

export default serverless(app)
