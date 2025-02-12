const express = require("express")
const authRouter = express.Router()
const User = require("../models/User")
const jwt = require("jsonwebtoken")

authRouter.post("/user/signup", async (req, res) => {
    try {
        //{firstname, lastname, email, password}
        const user = req.body

        //apply validation

        const newUser = await new User(user)
        await newUser.save()

        // const token = await jwt.sign({_id: newUser._id},"DevLink")
        // res.cookie("token", token)

        res.json({ message: "User created successfully!" })

    } catch (err) {
        res.status(400).json({ message: "Error: " + err })
    }
})

authRouter.post("/user/signin", async (req, res) => {
    try {
        const { email, password } = req.body
        //validation..

        if (!email || !password)
            res.json({ message: "fields are empty" })
        const user = await User.findOne({ email: email });
        if (!user)
            res.json({ message: "User not found!" })
        if (user.password != password)
            res.json({ message: "password is wrong" })
        const token = await jwt.sign({ _id: user._id }, "DevLink")
        // res.cookie("token", token)

        res.json({ user, token })
    } catch (err) {
        res.status(400).json({ message: "Error: " + err })
    }
})

authRouter.post("/user/logout", (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
        })
        res.json({ message: "User logged out successfully!" })
    } catch (error) {
        res.status(400).json({ message: "Error: " + error })
    }
})

module.exports = authRouter 