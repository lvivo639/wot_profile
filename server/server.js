import bodyParser from 'body-parser'
import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import path from 'path'

dotenv.config()

const __dirname = path.resolve()
const app = express()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
    console.log(`Listening ${ PORT } port on ${ process.env.NODE_ENV } mode`)
})

process.on('SIGINT', () => {
    server.close();
});