import express from "express"
import cors from 'cors'
import 'dotenv/config'

import connectDB from "./config/mongodb.js"
import userRouter from "./routes/userRoutes.js"
import imageRouter from "./routes/imageRoutes.js"

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5175', 'https://pix-gen-6gya.vercel.app'],
    credentials: true
}))

// API routes
app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)
app.get('/', (req, res)=> res.send("API Working"))

// Connect to database and start server
connectDB()
    .then(() => {
        console.log('Database connected successfully')
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    })
    .catch((error) => {
        console.error('Database connection failed:', error)
        process.exit(1)
    })