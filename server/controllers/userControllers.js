import expressAsyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import passport from 'passport'

import { SECRET_OT_KEY } from '../config/auth.js'
import ProfileModel from '../models/profileModel.js'
import UserModel from '../models/userModel.js'
import { getInfo, getList } from '../utils/wotApi.js'


const getAccountIdList = expressAsyncHandler(async (req, res) => {
    if (!req.query.gameUserName) {
        throw Error('\'gameUserName\' is required')
    }

    const result = await getList(req.query.gameUserName)
    res.json(result)
})

const loginUser = expressAsyncHandler(async (req, res, next) => {
    passport.authenticate(
        'local',
        async (err, user, info) => {
            try {
                if (err || !user) {
                    const error = new Error(info.message)
                    return next(error)
                }

                req.login(
                    user,
                    {session: false},
                    async (error) => {
                        if (error) return next(error);

                        const body = {_id: user._id, username: user.username};
                        const token = jwt.sign({user: body}, SECRET_OT_KEY);
                        const {userdata} = res.locals

                        return res.json({ token, userdata })
                    }
                );
            } catch (error) {
                return next(error)
            }
        }
    )(req, res, next);
})

const createUser = expressAsyncHandler(async (req, res) => {
    const { username, password, account_id } = req.body

    if (!username || !password || !account_id) {
        throw Error('username, password, account_id is required')
    }

    const userExists = await UserModel.findOne({ username })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const { achievements, frags, max_series } = await getInfo(account_id)

    const user = await UserModel.create({
        username, password,
    })

    const profile = await ProfileModel.create({
        user, account_id, achievements, frags, max_series
    })

    if (user) {
        res.json({
            id: user._id,
            username: user.username,
            profile: {
                account_id: profile.account_id,
                achievements: profile.achievements,
                frags: profile.frags,
                max_series: profile.max_series
            }
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

const getUser = expressAsyncHandler(async (req, res) => {
    const profile = await ProfileModel
        .findOne({ user: req.user._id })
        .populate({ path: 'user', select: '-password' })

    res.json({
        user: profile.user,
        profile: {
            account_id: profile.account_id,
            achievements: profile.achievements,
            frags: profile.frags,
            max_series: profile.max_series
        }
    })
})

const updateUser = expressAsyncHandler(async (req, res) => {
    const username = req.body.username || null
    const password = req.body.password || null
    const account_id = req.body.account_id || null
    const user = await UserModel.findOne({ _id: req.user._id })

    if (account_id) {
        const { achievements, frags, max_series } = await getInfo(account_id)
        const profile = await ProfileModel.findOne({ user: req.user._id })
        profile.account_id = account_id
        profile.achievements = achievements
        profile.frags = frags
        profile.max_series = max_series
        await profile.save()
    }
    if (username) {
        user.username = username
    }
    if (password) {
        user.password = password
    }

    const updatedUser = await user.save()
    const profile = await ProfileModel.findOne({ user: req.user._id })
    res.json({
        message: 'Success',
        user: {
            id: updatedUser._id,
            username: updatedUser.username,
            profile: {
                account_id: profile.account_id,
                achievements: profile.achievements,
                frags: profile.frags,
                max_series: profile.max_series
            }
        }
    })
})

const deleteUser = expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findOne({ _id: req.user._id })
    await user.remove()
    res.json({ message: 'success' })
})

export { getAccountIdList, loginUser, createUser, getUser, updateUser, deleteUser }
