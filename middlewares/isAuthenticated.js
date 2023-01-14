const jwt = require("jsonwebtoken");

const isAuthenticated = async (req,res,next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if(!token) {
            return res.status(401).json({ message: "Access denied, Token not provided"});
        }

        jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, validToken) => {
            if (err) {
                return res.status(404).json({ message: "Invalid token" })
            } else {
                req.user = validToken;
                next();
            }
        })

    } catch (e) {
        return res.status(500).send(e);
    }
}

module.exports = isAuthenticated;