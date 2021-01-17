import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import ProfileModel from './profileModel.js'

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
})

UserSchema.pre('save',
    async function (next) {
        if (!this.isModified('password')) return next()
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }
)

UserSchema.pre('remove',
    async function (next) {
        console.log(this)
        await ProfileModel.deleteOne({ user: this._id })
        next()
    }
)


UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const UserModel = mongoose.model('User', UserSchema)

export default UserModel