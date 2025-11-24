import 'dotenv/config'
import connectDB from './config/mongodb.js'
import createApp from './app.js'

const PORT = process.env.PORT || 4000

const app = createApp()

// Connect to database then start listening (for local/dev)
connectDB()
    .then(() => {
        console.log('Database connected successfully')
        app.listen(PORT, () => console.log('server running on port ' + PORT))
    })
    .catch((error) => {
        console.error('Database connection failed:', error)
    })