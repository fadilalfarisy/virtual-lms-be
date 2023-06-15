import express from "express"
import authorizationReference from "../middleware/authorization.js"
import referenceController from "../controllers/reference.controller.js"
import authentication from "../middleware/authentication.js"

const reference = express.Router()

/**
 * @swagger
 * tags:
 *   name: References
 *   description: The references managing API
 * components:
 *   schemas:
 *     References:
 *       type: object
 *       required:
 *         - title
 *         - link
 *         - courseId
 *         - createdBy
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the reference course
 *         link:
 *           type: string
 *           description: The link video of the reference
 *         courseId:
 *           type: string
 *           description: The id of the course
 *         createdBy:
 *           type: string
 *           description: The id of the user who created
 *       example:
 *         title: Business Process Model and Notation (BPMN) 2.0 Tutorial
 *         channel: BPMN Notation
 *         link: https://www.youtube.com/watch?v=BwkNceoybvA
 *         courseId: 6447dd07081f62b8db71b045
 *         createdBy: 6440d4150a73a915567e44fb
 */


/**
 * @swagger
 * /reference:
 *  get:
 *    summary: List all the references
 *    tags: [References]
 *    parameters:
 *      - in: query
 *        name: courseId
 *        schema:
 *          type: ObjectId
 *        description: id course
 *      - in: query
 *        name: search
 *        schema:
 *          type: string
 *        description: search by title and channel
 *    responses:
 *      201:
 *        description: The list of references.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items: 
 *                $ref: '#/components/schemas/References'
 *      400:
 *        description: The bad request
 *      500:
 *        description: Some server error
 */
reference.get('/', referenceController.getAllReference)

/**
 * @swagger
 * /reference/{id}:
 *  get:
 *    summary: Get the reference by id
 *    tags: [References]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema: 
 *          type: string
 *        required: true
 *        description: The reference id
 *    responses:
 *      201:
 *        description: The result of references.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/References'
 *      400:
 *        description: The bad request
 *      500:
 *        description: Some server error
 */
reference.get('/:id', referenceController.getReferenceById)

/**
 * @swagger
 * /reference/{id}:
 *  post:
 *    summary: Created the reference
 *    tags: [References]
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/References'
 *    responses:
 *      200:
 *        description: Success created of reference
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/References'
 *      400:
 *        description: The bad request
 *      500:
 *        description: Some server error
 */
reference.post('/', authentication, referenceController.createReference)

/**
 * @swagger
 * /reference/{id}:
 *  put:
 *    summary: Update the reference
 *    tags: [References]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema: 
 *          type: string
 *        required: true
 *        description: The reference id
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/References'
 *    responses:
 *      200:
 *        description: Success updated of reference
 *      400:
 *        description: The bad request
 *      500:
 *        description: Some server error
 */
reference.put('/:id', authentication, authorizationReference, referenceController.updateReference)

/**
 * @swagger
 * /reference/{id}:
 *  delete:
 *    summary: Delete the reference
 *    tags: [References]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema: 
 *          type: string
 *        required: true
 *        description: The reference id
 *    responses:
 *      200:
 *        description: Success updated of reference
 *      400:
 *        description: The bad request
 *      500:
 *        description: Some server error
 */
reference.delete('/:id', authentication, authorizationReference, referenceController.deleteReference)

export default reference