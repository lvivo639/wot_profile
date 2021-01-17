import expressAsyncHandler from "express-async-handler";
import passport from "passport";
import jwt from "jsonwebtoken";
import { SECRET_OT_KEY, QUERY_TOKEN } from "../config/auth.js";


const loginUser = expressAsyncHandler(async (req, res, next) => {
    passport.authenticate(
        'local',
        async (err, user, info) => {
            try {
                if (err || !user) {
                    const error = new Error(info.message);
                    return next(error);
                }

                req.login(
                    user,
                    {session: false},
                    async (error) => {
                        if (error) return next(error);

                        const body = {_id: user._id, username: user.username};
                        const token = jwt.sign({user: body}, SECRET_OT_KEY);
                        const {userdata} = res.locals

                        return res.json({token, userdata});
                    }
                );
            } catch (error) {
                return next(error);
            }
        }
    )(req, res, next);
})

const getUserProfile = expressAsyncHandler(async (req, res, next) => {
    res.json({
        message: 'Secure route',
        user: req.user,
        token: req.query[QUERY_TOKEN]
    })
})

export { loginUser, getUserProfile }
