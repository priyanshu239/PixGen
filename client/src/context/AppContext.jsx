import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

    const [credit, setCredit] = useState(0)
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const navigate = useNavigate();

    const loadCreditsData = useCallback(async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/user/credits', {headers : {token}})

            if(data.success){
                setCredit(data.credits)
                setUser(data.user)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }, [backendUrl, token])
    
    const generateImage = async (prompt) =>{
        try {
            const {data} = await axios.post(backendUrl + '/api/image/generate-image', {prompt}, {headers: {token}})
            if(data.success){
                loadCreditsData()
                return data.resultImage
            } else {
                toast.error(data.message)
                loadCreditsData()
                if(data.creditBalance === 0){
                    navigate('/buy')
                }
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    const logout = ()=>{
        localStorage.removeItem('token');
        setToken('')
        setUser(null)
    }

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
    }

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    useEffect(() => {
        if(token){
            loadCreditsData()
        }
    }, [token, loadCreditsData])

    const value = {
        user,setUser,showLogin, setShowLogin,
        backendUrl,token,setToken,
        credit,setCredit, loadCreditsData, logout,
        generateImage, theme, toggleTheme
    };
    
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;