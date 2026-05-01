# PixGen - AI Image Generation SaaS

PixGen is a full-stack AI Image Generation platform that allows users to transform text prompts into stunning visual art in seconds. Built with the MERN stack (MongoDB, Express, React, Node.js), it features a robust credit system, user authentication, and a sleek, responsive UI with dark mode support.

## 🚀 Features

- **AI Image Generation**: Powered by the Clipdrop API for high-quality, professional results.
- **User Authentication**: Secure Login/Signup system using JWT and Bcrypt.
- **Credit System**: Users can buy credits (integrated with Razorpay) and spend them to generate images.
- **Past Images Gallery**: Users can view their entire history of generated images in a personal gallery.
- **One-Click Download**: Instantly download generated images directly to your device.
- **Dark & Light Mode**: A beautiful, theme-aware UI that adapts to user preference.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop screens.
- **Smooth Animations**: Interactive UI powered by Framer Motion.

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Tailwind CSS (v4)
- Framer Motion
- Axios
- React Router DOM
- React Toastify

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- Dotenv
- Razorpay API

## 🏁 Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Clipdrop API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd PixGen
   ```

2. **Setup Backend:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLIPDROP_API=your_clipdrop_api_key
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   ```
   Start the server:
   ```bash
   npm run server
   ```

3. **Setup Frontend:**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:3000
   ```
   Start the client:
   ```bash
   npm run dev
   ```

## 📸 Screenshots

*(Add your screenshots here)*

## 📄 License
This project is licensed under the ISC License.