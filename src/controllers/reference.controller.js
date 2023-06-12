import mongoose from 'mongoose'
import Reference from '../models/reference.model.js'
import Course from '../models/course.model.js';
import { validateReference, validateId, validateIdCourse } from '../helpers/validator.js';

const createReference = async (req, res, next) => {
    try {
        const { error, value } = validateReference(req.body);
        if (error) {
            const err = new Error('Invalid request')
            err.code = 400
            err.errors = error.details
            throw err
        }

        const { title, link, channel, courseId } = value;
        const newReference = await Reference.create({
            title,
            link,
            channel,
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
    let { courseId, search, skip, limit, page } = req.query
    let query = {}
    try {
        if (courseId) {
            const { error, value } = validateIdCourse(req.query)
            if (error) {
                const err = new Error('Invalid id')
                err.code = 400
                err.errors = error.details
                throw err
            }
            const { courseId } = value
            query = {
                "course._id": new mongoose.Types.ObjectId(courseId)
            }
        }

        let querySkip = 0
        let queryLimit = 10
        let queryPage = 1
        if (skip) {
            querySkip = Number(skip)
        }
        if (limit) {
            queryLimit = Number(limit)
        }
        if (page) {
            queryPage = Number(page)
        }

        //filter by search keyword
        if (search) {
            query = {
                ...query,
                $or: [{
                    'title': {
                        $regex: search,
                        $options: "i"
                    },
                }, {
                    'channel': {
                        $regex: search,
                        $options: "i"
                    },
                }]
            }
        }

        const course = await Course.findById(courseId)
        const reference = await Reference.where({ 'courseId': courseId }).countDocuments()
        const references = await Reference.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'author'
                },
            }, {
                $lookup: {
                    from: 'courses',
                    localField: 'courseId',
                    foreignField: '_id',
                    as: 'course'
                },
            }, {
                $unwind: '$course'
            }, {
                $unwind: '$author'
            }, {
                $match: query
            },
            // {
            //     $facet: {
            //         pagination: [
            //             {
            //                 $count: "total"
            //             }, {
            //                 $addFields: { page: queryPage }
            //             }, {
            //                 $addFields: { skip: querySkip }
            //             }, {
            //                 $addFields: { limit: queryLimit }
            //             }
            //         ],
            //         reference: [{
            //             $skip: (queryPage - 1) * querySkip
            //         }, {
            //             $limit: queryLimit
            //         }],
            //     },
            // }, {
            //     $unwind: '$pagination'
            // }
            //{
            //     $project: {
            //         total: '$pagination.total',
            //         page: '$pagination.page',
            //         skip: '$pagination.skip',
            //         limit: '$pagination.limit',
            //         references: '$reference'
            //     }
            // }
            {
                $project: {
                    _id: 1,
                    title: 1,
                    link: 1,
                    channel: 1,
                    author: "$author.fullName",
                    course: "$course.subject"
                }
            }
        ])
        res.status(200).json({
            code: 200,
            status: 'OK',
            info: {
                course,
                total: reference
            },
            references: references
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
        const { title, link, channel, courseId } = value
        await Reference.updateOne({ _id: id }, {
            title,
            channel,
            link,
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