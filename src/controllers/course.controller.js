import Course from '../models/course.model.js'
import { validateCourse, validateId } from '../helpers/validator.js';

const createCourse = async (req, res, next) => {
    try {
        const { error, value } = validateCourse(req.body);
        if (error) {
            const err = new Error('Invalid request')
            err.code = 400
            err.errors = error.details
            throw err
        }

        const { subject } = value;
        const newCourse = await Course.create({ subject });
        res.status(201).json({
            code: 201,
            status: 'CREATED',
            data: [newCourse]
        });
    } catch (error) {
        next(error)
    }
};


const getAllCourse = async (req, res, next) => {
    try {
        const courses = await Course.find({})
        res.status(200).json({
            code: 200,
            status: 'OK',
            data: courses
        })
    } catch (error) {
        next(error)
    }
}

const getCourseById = async (req, res, next) => {
    try {
        const { error, value } = validateId(req.params)
        if (error) {
            const err = new Error('Invalid id')
            err.code = 400
            err.errors = error.details
            throw err
        }
        const { id } = value
        const course = await Course.findById(id)
        if (course == null) {
            const err = new Error('Invalid id')
            err.code = 404
            err.errors = [{ id: "id course not found" }]
            throw err
        }
        res.status(200).json({
            code: 200,
            status: 'OK',
            data: course
        })
    } catch (error) {
        next(error)
    }
}

const updateCourse = async (req, res, next) => {
    try {
        const { error: errorId, value: valueId } = validateId(req.params)
        if (errorId) {
            const err = new Error('Invalid id')
            err.code = 400
            err.errors = error.details
            throw err
        }
        const { error, value } = validateCourse(req.body);
        if (error) {
            const err = new Error('Invalid request')
            err.code = 400
            err.errors = error.details
            throw err
        }

        const { id } = valueId
        const { subject } = value
        await Course.updateOne({ _id: id }, { subject })
        res.status(200).json({
            code: 200,
            status: 'OK',
            data: [{ message: 'success updated course' }]
        })
    } catch (error) {
        next(error)
    }
}

const deleteCourse = async (req, res, next) => {
    try {
        const { error, value } = validateId(req.params)
        if (error) {
            const err = new Error('Invalid id')
            err.code = 400
            err.errors = error.details
            throw err
        }

        const { id } = value
        const deletedCourse = await Course.deleteOne({ _id: id })
        if (deletedCourse.deletedCount == 0) {
            const err = new Error('Invalid request')
            err.code = 404
            err.errors = [{ id: 'course not found' }]
            throw err
        }

        res.status(200).json({
            code: 200,
            status: 'OK',
            data: [{ message: 'success deleted course' }]
        })
    } catch (error) {
        next(error)
    }
}


const courseController = {
    createCourse,
    getAllCourse,
    getCourseById,
    updateCourse,
    deleteCourse,
}

export default courseController