const express = require("express")
const UserAuth = require("../middleware/UserAuth")
const Connection = require("../models/Connection")
const User = require("../models/User")
const ConnectionRouter = express.Router()

// ConnectionRouter.get("/request/get", UserAuth, async (req, res) => {
//     try {
//         const fromUserId = req.user._id
//         const connections = await Connection.find({
//             $or: [
//                 { fromUserId },
//                 { toUserId: fromUserId }
//             ]
//         })
//         .populate({ path: "fromUserId", select: "firstname lastname" })
//         .populate({ path: "toUserId", select: "firstname lastname" })
        
//         if (!connections)
//             res.status(404).json({ message: "Requests not found!!" })
//         const data = connections.map((connection) => { if (connection.status == "intrested") return connection })
//         res.json(data)
//     } catch (error) {
//         res.status(400).json({ message: "Erroe: " + error })
//     }
// })

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
        res.json({ message: "Request sent!!" , data: connect})

    } catch (error) {
        res.status(400).json({ message: "Error: " + error })
    }
})

ConnectionRouter.post("/connection/review/:status/:requestId", UserAuth, async (req, res) => {
    try {
        const { status, requestId } = req.params
        logedInUserId = req.user._id

        const allowedStatus = ["accepted", "rejected"]
        if (!allowedStatus.includes(status))
            res.status(400).json({ message: "Status is incorrect!" })
        const request = await Connection.findOne({
            _id: requestId,
            toUserId: logedInUserId,
            status: "intrested" 
        });
        if(!request)
            res.status(404).json({ message: "Request not found!" })

        request.status = status;
        const data = await request.save()
        
        res.json({ message: "connection updated!!" , data})


    } catch (error) {
        res.status(400).json({ message: "Error: " + error })
    }
})


module.exports = ConnectionRouter