import express from 'express'
import user from './user.route.js'

const router = express.Router()

router.use('/', user)

export default router