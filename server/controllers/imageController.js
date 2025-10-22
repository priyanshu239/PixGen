import axios from "axios"
import userModel from "../models/userModel.js"
import FormData from 'form-data'


export const generateImage = async (req, res)=>{
    try {
        const userId = req.userId || req.body.userId
        const { prompt } = req.body || {}

        if(!prompt){
            return res.json({success: false, message: 'Missing Details: prompt is required'})
        }

        if(!userId){
            return res.json({success: false, message: 'Not Authorised. Login Again'})
        }

        const user = await userModel.findById(userId)
        if(!user){
            return res.json({success: false, message: 'User not found'})
        }

        if(user.creditBalance <= 0){
            return res.json({success: false, message: 'No Credit Balance', creditBalance: user.creditBalance})
        }

        if(!process.env.CLIPDROP_API){
            return res.json({success: false, message: 'Server missing CLIPDROP_API key'})
        }

        const formData = new FormData()
        formData.append('prompt', prompt)

        const { data } = await axios.post(
            'https://clipdrop-api.co/text-to-image/v1',
            formData,
            {
                headers: {
                    ...formData.getHeaders?.(),
                    'x-api-key': process.env.CLIPDROP_API,
                },
                responseType: 'arraybuffer'
            }
        )

        const base64Image = Buffer.from(data, 'binary').toString('base64')
        const resultImage = `data:image/png;base64,${base64Image}`

        await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 })

        res.json({success: true, message: 'Image Generated', creditBalance: user.creditBalance - 1, resultImage})

    } catch (error) {
        console.log('Image generation error:', error.response?.status, error.response?.data, error.message)
        
        if (error.response?.status === 402) {
            return res.json({success: false, message: 'API credits exhausted. Please check your Clipdrop API key or upgrade your plan.'})
        }
        
        if (error.response?.status === 401) {
            return res.json({success: false, message: 'Invalid API key. Please check your Clipdrop API configuration.'})
        }
        
        res.json({success: false, message: error.response?.data?.message || error.message})
    }
}