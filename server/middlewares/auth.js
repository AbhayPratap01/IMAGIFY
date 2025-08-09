import jwt from 'jsonwebtoken'


const userAuth = async (req, res, next) => {
    // Check for token in both Authorization header and custom token header
    let token = req.headers.token;
    
    // If no token in custom header, check Authorization header
    if (!token && req.headers.authorization) {
        // Handle "Bearer <token>" format
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        } else {
            token = authHeader; // Assume the whole header is the token
        }
    }

    if(!token){
        return res.json({ success: false, message: "Not Authorized. Login Again" });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if(tokenDecode.id){
            // Ensure req.body exists before setting userId
            if (!req.body) {
                req.body = {};
            }
            req.body.userId = tokenDecode.id;
        }else{
            return res.json({ success: false, message: "Not Authorized. Login Again" });
        }

        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.json({ success: false, message: "Token expired. Please login again" });
        } else if (error.name === 'JsonWebTokenError') {
            return res.json({ success: false, message: "Invalid token. Please login again" });
        }
        return res.json({ success: false, message: error.message });
    }

}
export default userAuth;