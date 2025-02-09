const express = require("express")
const app = express()

const authRouter = require("./routers/authRouter")
const profileRouter = require("./routers/profile")
const ConnectionRouter = require("./routers/connections")
const dotenv = require("dotenv")
const mongoose = require("mongoose")

app.use(express.json())
dotenv.config()

const connectdb = async ()=>{
    await mongoose.connect('mongodb+srv://PRAJJVAL:9967138778@namstenode.m3mzr.mongodb.net/DevLink')
}

try{
    connectdb()
    console.log("connected")
}catch(err){
    console.log("Error: "+err)
}


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

app.listen(5000, () => {
    try {
        console.log("Server is online!!!")
    } catch (err) {
        console.log("Error: " + err);
    }
})