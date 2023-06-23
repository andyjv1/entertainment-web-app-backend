const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const cloudinary = require("../cloudinary/cloudinary")

// @desc Get all users
// @route GET /users
// @access Private

const getAllUsers = asyncHandler(async (req, res) => {

    // Get all users from the database
    const users = await User.find().select('-password').lean()

    // If there is no users 
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
})

// @desc Create new users
// @route POST /users
// @access Private    

const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, image } = req.body

    // Check if there is an image from the form    
    let uploadedImageId

    if (image) {
        const uploadedImage = await cloudinary.uploader.upload(image,
            {
                upload_preset: 'unsigned_upload',
                allowed_formats: ['png', 'jpg', 'jpeg', 'svg', 'ico', 'jfif', 'webp'],
            },
            function (error, result) {
                if (error) {
                    console.log(error)
                }
                uploadedImageId = result.public_id
            })

        try {
            console.log(uploadedImage)
        } catch (err) {
            console.log(err)

        }
    }

    // Confirm the data received
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username/email 
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Hash the password received
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    // Create and store the new user 
    let user
    if (image) {
        user = await User.create({ username, "password": hashedPwd, "image": uploadedImageId })

    } else {
        user = await User.create({ username, "password": hashedPwd })
    }

    if (user) {
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// @desc Update a user
// @route PATCH /users
// @access Private

const updateUser = asyncHandler(async (req, res) => {
    const { id, username, isBookmarked, image, password } = req.body

    // Confirm the data received
    if (!id) {
        return res.status(400).json({ message: 'ID is required' })
    }

    // Check if the user exist to update?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate username/email 
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Updates user 
    if (username) {
        user.username = username
    }
    if (isBookmarked) {
        user.isBookmarked = isBookmarked
    }
    if (image) {
        user.image = image
    }

    if (password) {
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
})


// @desc Delete a users
// @route DELETE /users
// @access Private

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm the data received
    if (!id) {
        res.status(400).json({ message: 'User ID Required' })

    }

    // Check if the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result.id} deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}