import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PastImages = () => {
  const { backendUrl, token, user } = useContext(AppContext)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await axios.get(backendUrl + '/api/image/user-images', { headers: { token } })
        if (data.success) {
          setImages(data.images)
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchImages()
    } else {
      setLoading(false)
    }
  }, [backendUrl, token])

  if (!token) {
    return <div className='text-center mt-20 text-gray-600'>Please login to view your past images.</div>
  }

  return (
    <div className='pb-20 mt-10 max-w-5xl mx-auto'>
      <h1 className='text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-8'>Your Past Generated Images</h1>
      
      {loading ? (
        <div className='flex justify-center mt-20'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
        </div>
      ) : images.length === 0 ? (
        <div className='text-center mt-20 text-gray-500 text-lg'>You haven't generated any images yet.</div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {images.map((img) => (
            <div key={img._id} className='bg-[var(--card-bg)] text-[var(--text-color)] rounded-lg shadow-md overflow-hidden hover:scale-[1.02] transition-all duration-300'>
              <img src={img.resultImage} alt={img.prompt} className='w-full h-64 object-cover' />
              <div className='p-4'>
                <p className='text-sm font-medium truncate' title={img.prompt}>
                  "{img.prompt}"
                </p>
                <div className='flex justify-between items-center mt-2'>
                  <p className='text-xs text-gray-400'>
                    {new Date(img.createdAt).toLocaleDateString()}
                  </p>
                  <a href={img.resultImage} download={`pixgen-${img._id}.png`} className='text-xs bg-zinc-800 text-white px-3 py-1 rounded-full hover:scale-105 transition-all'>
                    Download
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PastImages
