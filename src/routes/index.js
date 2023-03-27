import express from 'express'
import user from './user.route.js'
import tokenController from '../controllers/user.controller.js'

const router = express.Router()

router.use('/', user)
// router.get('/token', tokenController.checkRefreshToken)

export default router