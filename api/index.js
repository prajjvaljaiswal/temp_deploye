const express = require("express");
const authRouter = require("../routers/authRouter");
const profileRouter = require("../routers/profile");
const ConnectionRouter = require("../routers/connections");
const UserRouter = require("../routers/user");
const dotenv = require("dotenv");
const mongoose = require("mongoose")
// const connectdb = require("../util/database");
const multer = require("multer");
const path = require("path");
const ImageUrl = require("../middleware/ImageUrl");

dotenv.config();

const app = express();
const connectdb = async ()=>{
    await mongoose.connect(process.env.DB_URI)
}
try{
    connectdb()
    console.log("connected")
}catch(err){
    console.log("Error: "+err)
}
// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) return cb(null, true);
        cb(new Error("Only JPEG, JPG, and PNG files are allowed"));
    },
});

app.post("/upload", upload.single("image"), ImageUrl);

app.use(express.json()); // Ensure JSON parsing
app.get("/test", (req, res) => {
    res.json({ message: "Hello World" });
});

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", ConnectionRouter);
app.use("/api", UserRouter);

// Export as a Serverless Function
module.exports = app;
