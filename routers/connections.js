const express = require("express")
const UserAuth = require("../middleware/UserAuth")
const Connection = require("../models/Connection")
const User = require("../models/User")
const ConnectionRouter = express.Router()

ConnectionRouter.get("/request/get", UserAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const connections = await Connection.find({
            $or: [
                { fromUserId },
                { toUserId: fromUserId }
            ]
        })
        if (!connections)
            res.status(404).json({ message: "Requests not found!!" })
        const data = connections.map((connection) => { if (connection.status == "intrested") return connection })
        res.json(data)
    } catch (error) {
        res.status(400).json({ message: "Erroe: " + error })
    }
})

ConnectionRouter.post("/connection/send/:id/:status", UserAuth, async (req, res) => {
    try {
        const status = req.params.status
        const logedInUser = req.user._id
        const toUserId = req.params.id

        if (!status || !toUserId)
            throw new Error("Fields are empty!")

        const allowedRequest = ["ignored", "intrested"]
        if (!allowedRequest.includes(status))
            throw new Error("Status is invalid!")

        if (logedInUser._id == toUserId)
            throw new Error("both users are same!")

        const toUser = await User.findById(toUserId)
        if (!toUser)
            throw new Error("User does not exist!")

        const existConnectionRequest = await Connection.findOne({
            $or: [
                { fromUserId: logedInUser, toUserId },
                { fromUserId: toUserId, toUserId: logedInUser }
            ],
        });

        if (existConnectionRequest)
            throw new Error("Connection already exist!!")

        const connect = await Connection({ fromUserId: logedInUser, toUserId, status })
        await connect.save()
        res.json({ message: "Request sent!!" })

    } catch (error) {
        res.status(400).json({ message: "Error: " + error })
    }
})

ConnectionRouter.post("/connection/review/:id/:status", UserAuth, async (req, res)=>{
    try {
        const {status} = req.params
        fromUserId = req.user._id
        toUserId = req.params.id

        const allowedStatus= ["intrested","rejected"]
        if(!allowedStatus.includes(status))
            res.status.json({message: "Status is incorrect!"})

        const isUser = User.findById(toUserId)
        if(!isUser)
            res.status.json({message: "User not found!!"})

        const existConnectionRequest = await Connection.find({
            $or: [
                { fromUserId: toUserId, toUserId: fromUserId , status: "accepted"},
            ],
        });
        if (existConnectionRequest)
            throw new Error("Connection already exist!!")
        const pendingRequest = await Connection.findOne({fromUserId: toUserId, toUserId: fromUserId, status: "intrested"})

        pendingRequest.status = status;
        await pendingRequest.save()
        res.json({message: "connection updated!!"})


    } catch (error) {
        res.status.json({message: "Error: "+error})
    }
})


module.exports = ConnectionRouter