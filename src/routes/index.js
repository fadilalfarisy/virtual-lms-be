import express from 'express'
import user from './user.route.js'
import reference from './reference.route.js'
import course from './course.route.js'

const router = express.Router()

router.use('/user', user)
router.use('/course', course)
router.use('/reference', reference)

export default router