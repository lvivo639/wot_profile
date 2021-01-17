import expressAsyncHandler from "express-async-handler";
import passport from "passport";

import UserModel from "../models/userModel.js";

const registerUserMiddleware = expressAsyncHandler(async (req, res, next) => {
    const {username, password} = req.body

    const newUser = await UserModel.create({username, password})

    if (newUser) {
        res.locals.userdata = {
            id: newUser._id,
            username: newUser.username
        }
        next()
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

const protectMiddleware = passport.authenticate('jwt', {session: false})

export { registerUserMiddleware, protectMiddleware }
