import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import { createAccessToken, createRefreshToken, verifyRefreshToken } from '../helpers/token.js'
import { validateRegister, validateLogin } from '../helpers/validator.js';

import config from '../config/config.js';

const { DEVELOPMENT } = config

const register = async (req, res, next) => {
    try {
        //check required field
        const { error, value } = validateRegister(req.body);
        if (error) {
            const err = new Error('Invalid request')
            err.code = 400
            err.errors = error.details
            throw err
        }

        const { fullName, email, password } = value;

        //check duplicate email
        const user = await User.findOne({ email });
        if (user) {
            const err = new Error('Invalid request')
            err.code = 400
            err.errors = [{ email: 'duplicate value' }]
            throw err
        }

        const newUser = await User.create({
            fullName,
            email,
            password
        });

        //create access token and refresh token
        const accessToken = createAccessToken({ id: newUser.id });
        const refreshToken = createRefreshToken({ id: newUser.id })

        //send refresh token as a cookie
        res.cookie("token", refreshToken, {
            expires: new Date(Date.now() + 1000 * 60 * 60), //1d
            // httpOnly: true,
            // sameSite: "none",
            // secure: false,
            domain: DEVELOPMENT ? 'localhost' : '.vercel.app'
        });

        res.status(201).json({
            code: 201,
            status: 'CREATED',
            data: [{ email, accessToken }]
        });

    } catch (error) {
        next(error)
    }
};

const login = async (req, res, next) => {
    try {
        //check required field
        const { error, value } = validateLogin(req.body)
        if (error) {
            console.log(error);
            return res.status(400).json(error.details);
        }

        const { email, password } = value;

        //check username user is exist
        const user = await User.findOne({ email })
        if (!user) {
            const err = new Error('Invalid request')
            err.code = 404
            err.errors = [{ email: 'email is not registered yet' }]
            throw err
        }

        //compare the password
        const hashPassword = await bcrypt.compare(password, user.password)
        if (!hashPassword) {
            const err = new Error('Invalid request')
            err.code = 400
            err.errors = [{ password: 'invalid password' }]
            throw err
        }

        //create access token and refresh token
        const accessToken = createAccessToken({ id: user._id });
        const refreshToken = createRefreshToken({ id: user._id });

        //send refresh token as a cookie 
        res.cookie("token", refreshToken, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24), //1d
            domain: DEVELOPMENT ? 'localhost' : '.vercel.app'
            // httpOnly: true,
            // sameSite: "none",
            // secure: false,
        });

        res.status(200).json({
            code: 200,
            status: 'OK',
            data: [{
                email: user.email,
                accessToken: accessToken
            }]
        });

    } catch (error) {
        next(error)
    }
};

const logout = async (req, res, next) => {
    try {
        res.clearCookie('token', { path: '/' })
        res.status(200).json({
            code: 200,
            status: 'OK',
            data: [{ message: 'success logout' }]
        })
    } catch (error) {
        next(error)
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('fullName')
        res.status(200).json({
            code: 200,
            status: 'OK',
            data: users
        })
    } catch (error) {
        next(error)
    }
}

const deleteUser = async (req, res, next) => {
    const { id } = req.params
    try {
        const deletedUser = await User.deleteOne({ _id: id })
        if (deletedUser.deletedCount == 0) {
            const err = new Error('Invalid request')
            err.code = 404
            err.errors = [{ id: 'user not found' }]
            throw err
        }

        res.status(200).json({
            code: 200,
            status: 'OK',
            data: [{ message: 'success deleted user' }]
        })
    } catch (error) {
        next(error)
    }
}

const checkRefreshToken = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) {
            const err = new Error('Invalid request')
            err.code = 422
            err.errors = [{ cookie: 'cookie is null' }]
            throw err
        }

        const { error, decoded } = verifyRefreshToken(token)
        if (error != null) {
            const err = new Error('Invalid request')
            err.code = 422
            err.errors = [{ token: 'invalid refresh token' }]
            throw err
        }

        const accessToken = createAccessToken({ id: decoded.id })
        res.status(200).json({
            code: 200,
            status: 'OK',
            data: { accessToken: accessToken }
        });

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