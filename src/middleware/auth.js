import { verifyAccessToken } from '../libs/token.js';

const auth = (req, res, next) => {
    let accessToken = req.headers.authorization
    if (!accessToken) {
        return res.status(403).json({
            code: 403,
            status: 'FORBIDDEN',
            errors: {
                token: 'token is null'
            }
        });
    }

    try {
        accessToken = accessToken.split(' ')[1];
        verifyAccessToken(accessToken, (error, decoded) => {
            if (error) {
                return res.status(403).json({
                    code: 403,
                    status: 'FORBIDDEN',
                    errors: {
                        token: 'invalid token'
                    }
                });
            }
            req.token = decoded
            next()
        })

    } catch (error) {
        next(error)
    }
};

export {
    auth,
}