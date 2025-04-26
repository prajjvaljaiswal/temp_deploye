const express = require("express")
const UserRouter = express.Router()

const User = require("../models/User")
const Connection = require("../models/Connection")
const UserAuth = require("../middleware/UserAuth")
const { Chat } = require("../models/Chat")

const USER_SAFE_DATA = "firstname lastname photoURL skills";

UserRouter.get("/user/request/recived", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const requests = await Connection.find({
      toUserId: loggedInUser,
      status: "intrested"
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate({ path: "toUserId", select: USER_SAFE_DATA })

    res.json({
      message: "Data fetched succesfully!!",
      data: requests
    })
  } catch (error) {
    res.status(400).json({ message: "Error :" + error })
  }
})

UserRouter.get("/user/chat", UserAuth, async (req, res)=>{
  try {
    const toUserId = req.query.toUserId;
    const loggedInUser = req.user._id;
    if(!toUserId){
      throw new Error("User id is required!!")
    }
    const chats = await Chat.findOne({
      participants: { $all: [loggedInUser, toUserId]}
    })
    // .populate({path: "messages", select: "senderId text createdAt"})

    if(!chats){
      throw new Error("Chat is Empty!!")
    }

    res.status(200).json({chats: chats.messages})

  } catch (error) {
    res.status(400).json({message: "Error: "+ error})
  }
})

UserRouter.get("/feed", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { skills } = req.query
    const requiredSkillsArray = skills ? skills.split(",") : []
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await Connection.find({
      $or: [
        { fromUserId: loggedInUser._id }, 
        { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const queryArray = [
      { _id: { $nin: Array.from(hideUsersFromFeed) } },
      { _id: { $ne: loggedInUser._id } }
    ];

    if (requiredSkillsArray.length > 0) {
      queryArray.push({ skills: { $in: requiredSkillsArray } })
    }

    const users = await User.find({
      $and: queryArray
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);


    // const data = await User.find({ _id: { $in: users } });
    res.status(200).json({ users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = UserRouter