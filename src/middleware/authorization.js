import Reference from "../models/reference.model.js";
import { validateId } from "../helpers/validator.js";

const authorizationReference = async (req, res, next) => {
    const userData = req.token
    try {
        const { error, value } = validateId(req.params)
        if (error) {
            const err = new Error('Invalid id')
            err.code = 400
            err.errors = error.details
            throw err
        }

        const { id } = value
        const course = await Reference.findById(id).populate('createdBy')
        if (course == null) {
            const err = new Error('Invalid id')
            err.code = 400
            err.errors = [{ 'id': 'Invalid id' }]
            throw err
        }

        if (course.createdBy._id != userData.id) {
            const err = new Error('Unauthorized')
            err.code = 401
            err.errors = [{ 'access token': 'user not allowed edited data' }]
            throw err
        }

        next()
    } catch (error) {
        next(error)
    }
};

export default authorizationReference