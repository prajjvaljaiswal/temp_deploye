const express = require("express")
const app = express()
const authRouter = require("./routers/authRouter")
const profileRouter = require("./routers/profile")
const ConnectionRouter = require("./routers/connections")
const dotenv = require("dotenv")
const UserRouter = require("./routers/user")
const connectdb = require("./util/database")
const multer = require("multer")
const path = require('path')
const ImageUrl = require("./controllers/ImageUrl")
const initializeSocket = require("./util/socket")
dotenv.config()



// Configure Multer for file upload
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


app.post("/upload/:id", upload.single("image"), ImageUrl);


app.use(express.json())



app.use("/test",(req,res)=>{
    res.json({
        message:"Hello World"
    }  )
})

app.use("/api",authRouter)
app.use("/api",profileRouter)
app.use("/api",ConnectionRouter)
app.use("/api",UserRouter)

const server = require("http").createServer(app)
initializeSocket(server)

try{
    connectdb()
    .then(()=> {
        server.listen(5000, () => {
            try {
                console.log("Server is online!!!")
            } catch (err) {
                console.log("Error: " + err);
            }
        })
    })
    
}catch(err){
    console.log("Error: "+err)
}

