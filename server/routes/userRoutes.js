import express from 'express'

import { createUser, deleteUser, getAccountIdList, getUser, loginUser, updateUser } from '../controllers/userControllers.js'
import { auth } from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * @route   GET /api/users/gameProfileId
 * @desc    Get List of Allowed Game Profile Ids by Username
 * @access  Public
 */
router.route('/getAccountIdList')
    .get(getAccountIdList)

/**
 * @route   POST /api/users/login
 * @desc    Login and get token
 * @access  Public
 */
router.route('/login')
    .post(loginUser)

/**
 * @route   POST /api/users/signup
 * @desc    Create User
 * @access  Public
 */
router.route('/signup')
    .post(createUser)

/**
 * @route   GET /api/users/page
 * @desc    Get User Data
 * @access  Private
 */
router.route('/profile')
    .get(auth, getUser)
    .patch(auth, updateUser)
    .delete(auth, deleteUser)


export default router