import express from "express"
import authentication from "../middleware/authentication.js"
import userController from "../controllers/user.controller.js"

const user = express.Router()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *       properties:
 *         fullName:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email user
 *         password:
 *           type: string
 *           description: The password account user
 *       example:
 *         fullName: Nasi Goreng
 *         email: nasi@gmail.com
 *         password: '#1Gmail.com'
 */

/**
 * @swagger
 * /user/register:
 *  post:
 *    summary: Register users
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *      responses:
 *        201:
 *          description: The registered user.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        400:
 *          description: The bad request
 *        500:
 *          description: Some server error
 */
user.post('/register', userController.register)

/**
 * @swagger
 * /user/login:
 *  post:
 *    summary: Login user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                description: The email user
 *              password:
 *                type: string
 *                description: The password account user
 *            example:
 *              email: nasi@gmail.com
 *              password: '@Nasi1'
 *    responses:
 *      200:
 *        description: The logged user.
 *      400:
 *        description: The bad request
 *      500:
 *        description: Some server error
 */
user.post('/login', userController.login)

/**
 * @swagger
 * /user/logout:
 *  get:
 *    summary: Logout user
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: The logout user
 *      400:
 *        description: The bad request
 *      500:
 *        description: Some server error
 */
user.get('/logout', userController.logout)

/**
 * @swagger
 * /user:
 *  get:
 *    summary: List all the users
 *    tags: [Users]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Success request
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items: 
 *                $ref: '#/components/schemas/User'
 *      400:
 *        description: The bad request
 *      403:
 *        description: Forbidden request
 *      500:
 *        description: Some server error
 */
user.get('/', authentication, userController.getAllUsers)

/**
 * @swagger
 * /user/{id}:
 *  delete:
 *    summary: Remove the user by id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    responses:
 *      200:
 *        description: The book was deleted
 *      400:
 *        description: The bad request
 *      404:
 *        description: The user not found
 *      500:
 *        description: Some server error
 */
user.delete('/:id', authentication, userController.deleteUser)

/**
 * @swagger
 * /user/refresh:
 *  get:
 *    summary: Regenerate access token user
 *    tags: [Users]
 *    parameters:
 *      - in: cookie
 *        name: token
 *        schema:
 *          type: string
 *        required: true
 *        description: The jwt cookie
 *    responses:
 *      200:
 *        description: The success regenerate acces token
 *      403:
 *        description: Forbidden request
 *      500:
 *        description: Some server error
 */
user.get('/refresh', userController.checkRefreshToken)

export default user