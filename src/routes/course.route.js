import express from "express"
import courseController from "../controllers/course.controller.js"
import authentication from "../middleware/authentication.js"

const course = express.Router()

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: The course managing API
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - subject
 *         - semester
 *       properties:
 *         subject:
 *           type: string
 *           description: The name of course
 *         semester:
 *           type: number
 *           description: The semester of the course
 *       example:
 *         subject: Proyek Minor Sistem Informasi
 *         semester: 3
 */


/**
 * @swagger
 * /course:
 *  get:
 *    summary: List all the course
 *    tags: [Courses]
 *    responses:
 *      201:
 *        description: The list of course.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items: 
 *                $ref: '#/components/schemas/Course'
 *      400:
 *        description: The bad request
 *      500:
 *        description: Some server error
 */
course.get('/', courseController.getAllCourse)

/**
 * @swagger
 * /course/{id}:
 *  get:
 *    summary: Get course by id
 *    tags: [Courses]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The course id
 *    responses:
 *      201:
 *        description: The course
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Course'
 *      400:
 *        description: The bad request
 *      404:
 *        description: The id course not found
 *      500:
 *        description: Some server error
 */
course.get('/:id', courseController.getCourseById)

/**
 * @swagger
 * /course:
 *  post:
 *    summary: Create course
 *    tags: [Courses]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Course'
 *    responses:
 *      200:
 *        description: The course successfully updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Course'
 *      400:
 *        description: The bad request
 *      404:
 *        description: The id course not found
 *      500:
 *        description: Some server error
 */
course.post('/', authentication, courseController.createCourse)

/**
 * @swagger
 * /course:
 *  put:
 *    summary: Update course
 *    tags: [Courses]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The course id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Course'
 *    responses:
 *      200:
 *        description: The course successfully updated.
 *      400:
 *        description: The bad request
 *      404:
 *        description: The id course not found
 *      500:
 *        description: Some server error
 */
course.put('/:id', authentication, courseController.updateCourse)

/**
 * @swagger
 * /course:
 *  delete:
 *    summary: Delete course
 *    tags: [Courses]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The course id
 *    responses:
 *      200:
 *        description: The user successfully deleted.
 *      400:
 *        description: The bad request
 *      500:
 *        description: Some server error
 */
course.delete('/:id', authentication, courseController.deleteCourse)

export default course