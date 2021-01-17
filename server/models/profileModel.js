import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ProfileSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    account_id: { type: Number, required: true, },
    achievements: {
        type: Map,
        of: Number,
        default: {}
    },
    frags: {
        type: Map,
        of: Number,
        default: {}
    },
    max_series: {
        type: Map,
        of: Number,
        default: {}
    }
})

const ProfileModel = mongoose.model('Profile', ProfileSchema)

export default ProfileModel