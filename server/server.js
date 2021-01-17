import bodyParser from 'body-parser'
import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import path from 'path'

import userRoutes from "./routes/userRoutes.js";
import configPassport from "./config/auth.js";
import configDatabase from "./config/database.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config()
configPassport()
configDatabase()

const __dirname = path.resolve()
const app = express()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/user', userRoutes)
//
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
    console.log(`Listening ${ PORT } port on ${ process.env.NODE_ENV } mode`)
})

process.on('SIGINT', () => {
    server.close();
});