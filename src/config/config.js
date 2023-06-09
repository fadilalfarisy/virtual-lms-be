import dotenv from 'dotenv'
dotenv.config()

const config = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vlms',
    ACCESS_TOKEN: process.env.ACCESS_TOKEN || 'qwibu87ewbot4t8oebgw4',
    REFRESH_TOKEN: process.env.REFRESH_TOKEN || '3g8ip32t794tbgou4gt80',
    MAX_AGE_ACCESS_TOKEN: process.env.MAX_AGE_ACCESS_TOKEN || '5s',
    MAX_AGE_REFRESH_TOKEN: process.env.MAX_AGE_REFRESH_TOKEN || '15m',
    FRONT_END_ORIGIN: process.env.FRONT_END_ORIGIN || 'https://digsboard.vercel.app',
    FRONT_END_ORIGIN_LOCAL: process.env.FRONT_END_ORIGIN_LOCAL || 'http://localhost:5173',
    DEVELOPMENT: process.env.DEVELOPMENT || true,
    CSS_URL: process.env.CSS_URL || "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"
}

export default config