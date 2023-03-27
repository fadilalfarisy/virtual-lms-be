import jwt from 'jsonwebtoken'
import config from '../config/config.js';

const {
    MAX_AGE_ACCESS_TOKEN,
    MAX_AGE_REFRESH_TOKEN,
    ACCESS_TOKEN,
    REFRESH_TOKEN } = config

//generate access JWT token contain id and role 
const createAccessToken = ({ id }) => {
    return jwt.sign({ id }, ACCESS_TOKEN, { expiresIn: MAX_AGE_ACCESS_TOKEN });
}

//generate refresh JWT token contain id and role
const createRefreshToken = ({ id }) => {
    return jwt.sign({ id }, REFRESH_TOKEN, { expiresIn: MAX_AGE_REFRESH_TOKEN });
}

//verify access JWT token
const verifyAccessToken = (token, callback) => {
    return jwt.verify(token, ACCESS_TOKEN, callback)
}

//verify refresh JWT token
const verifyRefreshToken = (token, callback) => {
    return jwt.verify(token, REFRESH_TOKEN, callback)
}

export {
    createAccessToken,
    createRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}