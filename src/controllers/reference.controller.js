import Reference from '../models/reference.model.js'
import { validateReference, validateId } from '../helpers/validator.js';

const createReference = async (req, res, next) => {
    try {
        const { error, value } = validateReference(req.body);
        if (error) {
            const err = new Error('Invalid request')
            err.code = 400
            err.errors = error.details
            throw err
        }

        const { title, link, semester, courseId } = value;
        const newReference = await Reference.create({
            title,
            link,
            semester,
            courseId,
            createdBy: req.token.id
        });

        res.status(201).json({
            code: 201,
            status: 'CREATED',
            data: [newReference]
        });
    } catch (error) {
        next(error)
    }
};


const getAllReference = async (req, res, next) => {
    try {
        const references = await Reference.find({}).populate("createdBy", "fullName").populate("courseId", "subject")
        res.status(200).json({
            code: 200,
            status: 'OK',
            data: references
        })
    } catch (error) {
        next(error)
    }
}

const getReferenceById = async (req, res, next) => {
    try {
        const { error, value } = validateId(req.params)
        if (error) {
            const err = new Error('Invalid id')
            err.code = 400
            err.errors = error.details
            throw err
        }
        const { id } = value
        const reference = await Reference.findById(id).populate('createdBy', 'fullName').populate("courseId", "subject")
        if (reference == null) {
            const err = new Error('Invalid id')
            err.code = 404
            err.errors = [{ id: "id course not found" }]
            throw err
        }
        res.status(200).json({
            code: 200,
            status: 'OK',
            data: reference
        })
    } catch (error) {
        next(error)
    }
}

const updateReference = async (req, res, next) => {
    try {
        const { error: errorId, value: valueId } = validateId(req.params)
        if (errorId) {
            const err = new Error('Invalid id')
            err.code = 400
            err.errors = error.details
            throw err
        }
        const { error, value } = validateReference(req.body);
        if (error) {
            const err = new Error('Invalid request')
            err.code = 400
            err.errors = error.details
            throw err
        }

        const { id } = valueId
        const { title, link, semester, courseId } = value
        await Reference.updateOne({ _id: id }, {
            title,
            link,
            semester,
            courseId
        })

        res.status(200).json({
            code: 200,
            status: 'OK',
            data: [{ message: 'success updated reference' }]
        })
    } catch (error) {
        next(error)
    }
}

const deleteReference = async (req, res, next) => {
    try {
        const { error, value } = validateId(req.params)
        if (error) {
            const err = new Error('Invalid id')
            err.code = 400
            err.errors = error.details
            throw err
        }

        const { id } = value
        const deletedReference = await Reference.deleteOne({ _id: id })
        if (deletedReference.deletedCount == 0) {
            const err = new Error('Invalid request')
            err.code = 404
            err.errors = [{ id: 'reference not found' }]
            throw err
        }

        res.status(200).json({
            code: 200,
            status: 'OK',
            data: [{ message: 'success deleted reference' }]
        })
    } catch (error) {
        next(error)
    }
}


const referenceController = {
    createReference,
    getAllReference,
    getReferenceById,
    updateReference,
    deleteReference,
}

export default referenceController