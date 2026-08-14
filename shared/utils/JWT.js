const jwt = require("jsonwebtoken")

const types = {
    accessToken: "ACCESS_TOKEN_EXPIRES_IN",
    refreshToken: "REFRESH_TOKEN_EXPIRES_IN",
    tapToken: "TAP_TOKEN_EXPIRES_IN",
}

function generateJWT(payload, tokenType) {  //where type is either "accessToken" or "refreshToken"
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: process.env[types[tokenType]]
        }
    );
}


module.exports = generateJWT