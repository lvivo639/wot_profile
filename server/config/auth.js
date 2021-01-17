import passport from 'passport'
import local from 'passport-local'
import jwtPassport from 'passport-jwt'

import UserModel from "../models/userModel.js"

const SECRET_OT_KEY = 'TOP_SECRET'
const QUERY_TOKEN = 'token'

const configPassport = () => {
    const LocalStrategy = local.Strategy
    const JWTStrategy = jwtPassport.Strategy
    const extractJWT = jwtPassport.ExtractJwt

    passport.use(
        new LocalStrategy(
            async (username, password, done) => {
                try {
                    const user = await UserModel.findOne({username})

                    if (!user) return done(null, false, {message: 'User not found'})

                    if (!await user.matchPassword(password))
                        return done(null, false, {message: 'Wrong Password'})

                    return done(null, user, {message: 'Logged in Successfully'});

                } catch (err) {
                    done(err)
                }

            }
        )
    )

    passport.use(
        new JWTStrategy(
            {
                secretOrKey: SECRET_OT_KEY,
                jwtFromRequest: extractJWT.fromUrlQueryParameter(QUERY_TOKEN)
            },
            async (jwt_payload, done) => {
                try {
                    return done(null, jwt_payload.user)
                } catch (err) {
                    done(err)
                }
            }
        )
    )
}

export { configPassport as default, SECRET_OT_KEY, QUERY_TOKEN }