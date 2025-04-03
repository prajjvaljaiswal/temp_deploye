const UserAuth = require("../middleware/UserAuth")
const express = require("express")
const User = require("../models/User")

const profileRouter = express.Router()

profileRouter.get("/profile/view/", UserAuth, (req, res) => {
    try {
        res.send(req.user)
    } catch (err) {
        res.status(400).json({ message: "Error: " + err })
    }
})

profileRouter.post("/profile/skills/", UserAuth, async(req,res)=>{
    try {
        const user = req.user
        const {skills} = req.body
        if(!skills)
            throw new Error("Skills are empty!!")
        await User.updateOne(user._id,{skills: skills})
        res.status(200).json({message:"Skills updated!!"})
    } catch (err) {
        res.status(400).json({ message: "Error: " + err })
    }
})

profileRouter.get("/profile", async(req,res)=>{
    try {
        const {id} = req.query
        if(!id)
            throw new Error("Id is empty!!")
        const user = await User.findById( id)
        if(!user)
            throw new Error("User not found")
        res.status(200).json(user)
    } catch (err) {
        res.status(400).json({ message: "Error: " + err })
    }
})


profileRouter.post("/profile/edit/", UserAuth, async(req, res) => {
    try {
        const { firstname, lastname } = req.body

        if(!firstname || !lastname)
            throw new Error("Fileds are empty!")

        const user = req.user
        const update = await User.updateOne(user._id,{firstname: firstname, lastname: lastname})
        res.send("updated")
    } catch (err) {
        res.status(400).json({ message: "Error: " + err })
    }
})

profileRouter.post("/profile/edit/password/", UserAuth, async(req, res)=>{
    try {
        const { password } = req.body
        if(!password)
            throw new Error("field is empty!!")
        const user = req.user
        const update = await User.updateOne(user._id,{password: password})
        res.send("password updated")

    } catch (error) {
        res.status(400).json({ message: "Error: " + err })
    }
})

module.exports = profileRouter