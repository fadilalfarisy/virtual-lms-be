import bodyParser from 'body-parser'
import express from 'express'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import router from './src/routes/index.js'
import config from './src/config/config.js'

//config
const { PORT, MONGO_URI, FRONT_END_ORIGIN, FRONT_END_ORIGIN_LOCAL, CSS_URL } = config

try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true })
    console.log('connect to db')
} catch (error) {
    console.log(error)
};

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Digsboard Application',
            version: '1.0.0',
            description: "This is a API for digsboard as management virtual learning system",
        },
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        servers: [
            {
                url: 'http://localhost:3000/',
                description: 'Development'
            },
            {
                url: 'https://be-digsboard.vercel.app/',
                description: 'Production'
            }
        ],
    },
    apis: ['./src/routes/*.js']
}

const swaggerSpec = swaggerJSDoc(options)
const app = express()

//middleware
app.use(cors({
    credentials: true,
    origin: [FRONT_END_ORIGIN, FRONT_END_ORIGIN_LOCAL]
}))
app.use(cookieParser()); //allow to access cookie
app.use(bodyParser.urlencoded({ extended: false })) //allow request with format x-www-form-urlencoded
app.use(bodyParser.json()) //allow request with format json

//api
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, { customCssUrl: CSS_URL }))
app.use('/', router)
app.get('/', (req, res) => {
    res.status(200).json({
        code: 200,
        status: 'OK',
        data: {
            message: 'server running'
        }
    })
})
app.get('*', (req, res) => {
    res.status(404).json({
        code: 404,
        status: 'NOT_FOUND',
        errors: [{ path: 'invalid path' }]
    })
})

//error handlers
app.use((err, req, res, next) => {
    console.log(err.message);
    const code = err.code || 500
    const errors = err.errors
    let status = 'INTERNAL_SERVER_ERROR'
    switch (code) {
        case 400:
            status = 'BAD_REQUEST'
            break
        case 401:
            status = 'UNAUTHORIZED'
            break
        case 403:
            status = 'FORBIDDEN'
            break
        case 404:
            status = 'NOT_FOUND'
            break
    }
    res.status(code).json({
        code,
        status,
        errors
    });
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`))