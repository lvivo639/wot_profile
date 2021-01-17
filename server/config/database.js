import mongoose from 'mongoose'

const configDatabase = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        })
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (err) {
        console.error(`MongoDB error : ${err.message}`)
        process.exit(1)
    }
}

export default configDatabase