import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import { createAccessToken, createRefreshToken, verifyRefreshToken } from '../libs/token.js'

const register = async (req, res, next) => {
    const { fullName, email, password } = req.body;
    try {
        //check required field
        if (!fullName || !email || !password) {
            return res.status(400).json({
                code: 400,
                status: 'BAD_REQUEST',
                errors: {
                    fullName: 'must not be null',
                    email: 'must not be null',
                    password: 'must not be null'
                }
            });
        }

        //check duplicated username
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                code: 400,
                status: 'BAD_REQUEST',
                errors: {
                    email: 'email already used'
                }
            });
        }

        const newUser = await User.create({
            fullName,
            email,
            password: password.toString()
        });

        //create access token and refresh token
        const accessToken = createAccessToken({
            id: newUser.id,
        });
        const refreshToken = createRefreshToken({
            id: newUser.id,
        })

        //send refresh token as a cookie
        res.cookie("token", refreshToken, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24), //1d
        });

        res.status(201).json({
            code: 201,
            status: 'CREATED',
            data: {
                email,
                accessToken
            }
        });

    } catch (error) {
        next(error)
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        //check required field
        if (!email || !password) {
            return res.status(400).json({
                code: 400,
                status: 'BAD_REQUEST',
                errors: {
                    email: 'must not be null',
                    password: 'must not be null'
                }
            });
        }

        //check username user is exist
        const user = await User.findOne({ email })

        //when username user is not found
        if (!user) {
            return res.status(404).json({
                code: 404,
                status: 'NOT_FOUND',
                errors: {
                    email: 'email not found'
                }
            });
        }

        //compare the password
        const hashPassword = await bcrypt.compare(password.toString(), user.password)

        //when password is not match
        if (!hashPassword) {
            return res.status(400).json({
                code: 400,
                status: 'BAD_REQUEST',
                errors: {
                    password: 'invalid password'
                }
            });
        }

        //create access token and refresh token
        const accessToken = createAccessToken({
            id: user._id,
        });
        const refreshToken = createRefreshToken({
            id: user._id,
        });

        //send refresh token as a cookie 
        res.cookie("token", refreshToken, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24), //1d
        });

        res.status(200).json({
            code: 200,
            status: 'OK',
            data: {
                email: user.email,
                accessToken: accessToken
            }
        });

    } catch (error) {
        next(error)
    }
};

const logout = async (req, res, next) => {
    try {
        //clear cookie refresh token
        console.log(req.cookies.token)
        res.clearCookie('token', { path: '/' })
        res.status(200).json({
            code: 200,
            status: 'OK',
            data: {
                message: 'success logout'
            }
        })
    } catch (error) {
        next(error)
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({})
        res.status(200).json({
            code: 200,
            status: 'OK',
            data: {
                users
            }
        })
    } catch (error) {
        next(error)
    }
}

const deleteUser = async (req, res, next) => {
    const { id } = req.params
    try {
        const deletedAdmin = await User.deleteOne({ _id: id })
        //when no one admin is deleted
        if (deletedAdmin.deletedCount === 0) {
            return res.status(404).json({
                code: 404,
                status: 'NOT_FOUND',
                errors: {
                    id: 'user not found'
                }
            });
        }
        res.status(200).json({
            code: 200,
            status: 'OK',
            data: {
                message: 'success deleted user'
            }
        })
    } catch (error) {
        next(error)
    }
}

const checkRefreshToken = async (req, res, next) => {
    try {
        const { token } = req.cookies
        console.log(req.cookies)
        //when not sent cookie refresh token
        if (!token) {
            return res.status(403).json({
                code: 403,
                status: 'FORBIDDEN',
                errors: {
                    cookie: 'cookie is null'
                }
            });
        }
        verifyRefreshToken(token, (error, decoded) => {
            if (error) {
                return res.status(403).json({
                    code: 403,
                    status: 'FORBIDDEN',
                    errors: {
                        token: 'invalid refresh token'
                    }
                });
            }
            const accessToken = createAccessToken({ id: decoded.id })
            console.log(`new access token ${accessToken}`)
            res.status(200).json({
                code: 200,
                status: 'OK',
                data: {
                    accessToken: accessToken
                }
            });
        })
    } catch (error) {
        next(error)
    }
}

const usersController = {
    register,
    login,
    logout,
    getAllUsers,
    deleteUser,
    checkRefreshToken
}

export default usersController