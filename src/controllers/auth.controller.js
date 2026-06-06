const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const emailService = require('../services/email.service')

async function userRegisterController(req, res) {

    const { email, username, password } = req.body

    const isExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isExists) {
        return res.status(422).json({
            message: "User already exists",
            status: "failed"
        })
    }

    const user = await userModel.create({
        email,
        username,
        password
    })

    const token = jwt.sign({
        userId: user._id
    }, process.env.JWT_SECRET, {
        expiresIn: '3d'
    })

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
    })

    res.status(201).json({
        message: "User registered successfully",
        user: {
            _id: user._id,
            email: user.email,
            name: user.username
        },
        token
    })

    await emailService.sendRegisterationEmail(user.email, user.username)
}

async function userLoginController(req, res) {

    const { email, username, password } = req.body

    const user = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    }).select("+password")

    if (!user) {
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if(!isValidPassword){
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }

    const token = jwt.sign({
        userId: user._id
    }, process.env.JWT_SECRET, {
        expiresIn: '3d'
    })

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
    })

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            _id: user._id,
            email: user.email,
            name: user.username
        },
        token
    })
}

module.exports = { userRegisterController, userLoginController }