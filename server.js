const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")
const authRouter = require("./routers/authRouter.js")
const profileRouter = require("./routers/profile.js")
const ConnectionRouter = require("./routers/connections.js")
const dotenv = require("dotenv")
const User = require("./models/User.js")

app.use(express.json())
app.use(cookieParser())
dotenv.config()

app.use("/test",(req,res)=>{
    res.send("Hello World!!")
})

app.use("/get",async(req,res)=>{
    try {
        const user = await User.findById('67a629603fa94db5d16fc9ef')
        res.send(user)
    } catch (error) {
        res.send(error)
    }
})


app.use(authRouter)
app.use(profileRouter)
app.use(ConnectionRouter)

app.listen(5000, async () => {
    try {
        await mongoose.connect('mongodb+srv://PRAJJVAL:9967138778@namstenode.m3mzr.mongodb.net/DevLink')
        console.log("Server is online!!!")
    } catch (err) {
        console.log("Error: " + err);
    }
})