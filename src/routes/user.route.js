import express from "express"
import { auth } from "../middleware/auth.js"
import userController from "../controllers/user.controller.js"

const user = express.Router()

user.post('/login', userController.login)
user.get('/logout', userController.logout)
user.post('/register', userController.register)

//crud users
user.get('/users', auth, userController.getAllUsers)
user.delete('/user/:id', auth, userController.deleteUser)

//token
user.get('/token', userController.checkRefreshToken)

export default user