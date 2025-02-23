const jwt = require("jsonwebtoken")
const User = require("../models/User")

const UserAuth = async (req, res, next) => {
    try {
        const {token} = await req.query
        // console.log(token)
        
        if(!req.headers && !req.headers.token)
            throw new Error("Enter token!!")
        
        const {_id}  = await jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(_id)

        if(!user)
            throw new Error("user not found")

        req.user = user
        next()

        // res.send(user)

    } catch (err) {
        res.status(400).json({ message: "Error: " + err })
    }
}

module.exports = UserAuth