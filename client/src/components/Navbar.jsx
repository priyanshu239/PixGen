import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const { user, setShowLogin, logout, credit, theme, toggleTheme } = useContext(AppContext)
  const navigate = useNavigate()

  return (
    <div className='flex items-center justify-between py-4'>
      
      <Link to='/'>
        <img src={assets.logo} alt="Logo" className='w-28 sm:w-32 lg:w-40 theme-logo' />
      </Link>

      <div className='flex items-center gap-2 sm:gap-5'>

        <button 
          onClick={toggleTheme}
          title="Toggle Theme"
          className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-xl'
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {user ? (
          <div className='flex items-center gap-2 sm:gap-3'>

            <button 
              onClick={() => navigate('/buy')}
              className='flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-2 rounded-full hover:scale-105 transition-all duration-200'
            >
              <img className='w-5' src={assets.credit_star} alt="Credits" />
              <p className='text-xs sm:text-sm font-medium text-gray-600'>
                Credit left: {credit}
              </p>
            </button>

            <p className='text-[var(--text-color)] opacity-80 max-sm:hidden pl-4'>
              Hi, {user?.name || "User"}
            </p>

            <div className='relative group cursor-pointer'>
              <img src={assets.profile_icon} alt="Profile" className='w-10 drop-shadow' />

              <div className='absolute hidden group-hover:block top-0 right-0 z-10 pt-12'>
                <ul className='list-none m-0 p-2 bg-[var(--card-bg)] text-[var(--text-color)] rounded-md border text-sm shadow-lg'>
                  
                  <li onClick={() => navigate('/past-images')} className='py-1 px-2 cursor-pointer border-b hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap pr-10'>
                    Past Images
                  </li>

                  <li onClick={logout} className='py-1 px-2 cursor-pointer mt-1 hover:bg-gray-100 dark:hover:bg-gray-700'>
                    Logout
                  </li>

                </ul>
              </div>
            </div>

          </div>
        ) : (
          <div className='flex items-center gap-2 sm:gap-5'>
            
            <button onClick={() => navigate('/buy')} className='cursor-pointer text-[var(--text-color)]'>
              Pricing
            </button>

            <button 
              onClick={() => setShowLogin(true)} 
              className='bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full'
            >
              Login
            </button>

          </div>
        )}

      </div>
    </div>
  )
}

export default Navbar