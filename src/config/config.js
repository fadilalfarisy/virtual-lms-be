import dotenv from 'dotenv'
dotenv.config()

const config = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/example',
    ACCESS_TOKEN: process.env.ACCESS_TOKEN || 'qwibu87ewbot4t8oebgw4',
    REFRESH_TOKEN: process.env.REFRESH_TOKEN || '3g8ip32t794tbgou4gt80',
    MAX_AGE_ACCESS_TOKEN: process.env.MAX_AGE_ACCESS_TOKEN || '15m',
    MAX_AGE_REFRESH_TOKEN: process.env.MAX_AGE_REFRESH_TOKEN || '1d',
}

export default config