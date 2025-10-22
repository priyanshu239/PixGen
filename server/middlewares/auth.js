import jwt from 'jsonwebtoken'


const userAuth = async (req, res, next)=>{
    const authHeader = req.headers.authorization || ''
    let token = req.headers.token

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]
    }

    if(!token){
        return res.json({success: false, message:'Not Authorised. Login Again'})
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if(tokenDecode.id){
            req.userId = tokenDecode.id
        } else{
            return res.json({success: false, message:'Not Authorised. Login Again'})
        }

        next()

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
};

export default userAuth;