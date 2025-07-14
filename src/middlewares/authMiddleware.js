const jwt=require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    console.log("Verifying token...");
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    }
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try{
        const decode=jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        console.log("Token verified successfully:", decode);
        next();
    }catch(error){
        console.error("Token verification error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = verifyToken;
