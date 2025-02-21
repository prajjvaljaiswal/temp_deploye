const express = require("express")
const UserRouter = express.Router()

const User = require("../models/User")
const Connection = require("../models/Connection")
const UserAuth = require("../middleware/UserAuth")

const USER_SAFE_DATA = "firstName lastName photoUrl age";

UserRouter.get("/user/request/recived", UserAuth, async(req, res)=>{
    try {
        const loggedInUser = req.user._id;
        
        const requests = await Connection.find({
            toUserId: loggedInUser,
            status: "intrested" 
        }).populate("fromUserId", USER_SAFE_DATA)

        res.json({
            message: "Data fetched succesfully!!",
            data: requests
        })
    } catch (error) {
        res.status(400).json({message: "Error :"+error})
    }
})

UserRouter.get("/feed", UserAuth, async (req, res) => {
    try {
      const loggedInUser = req.user;
  
      const page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      limit = limit > 50 ? 50 : limit;
      const skip = (page - 1) * limit;
  
      const connectionRequests = await Connection.find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      }).select("fromUserId  toUserId");
  
      const hideUsersFromFeed = new Set();
      connectionRequests.forEach((req) => {
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
      });
  
      const users = await User.find({
        $and: [
          { _id: { $nin: Array.from(hideUsersFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);
    
      const data = users.map(async(user)=>{
        const data = await User.findById(user._id)
        return data;
      })

      res.json({ data: data , users});
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

module.exports = UserRouter