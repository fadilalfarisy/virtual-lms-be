import { verifyAccessToken } from '../helpers/token.js';

const authentication = (req, res, next) => {
  let accessToken = req.headers.authorization
  if (!accessToken) {
    const err = new Error('Invalid request')
    err.code = 498
    err.errors = [{ token: 'access token is null' }]
    throw err
  }

  try {
    accessToken = accessToken.split(' ')[1];
    const { error, decoded } = verifyAccessToken(accessToken)
    if (error != null) {
      const err = new Error('Invalid request')
      err.code = 498
      err.errors = [{ token: 'invalid access token' }]
      throw err
    }

    req.token = decoded
    next()

  } catch (error) {
    next(error)
  }
};

export default authentication