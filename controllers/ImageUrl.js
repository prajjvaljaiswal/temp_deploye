const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../util/awsS3");
const dotenv = require("dotenv");
const User = require("../models/User");
dotenv.config()

const ImageUrl = async(req, res)=>{
    {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
    
        const fileName = `uploads/${Date.now()}_${req.file.originalname}`;
        
        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };
    
        try {
            await s3.send(new PutObjectCommand(uploadParams));
    
            const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
            
            const user = await User.findById(req.params.id)
            user.photoURL = imageUrl
            await user.save()
            
            res.status(200).json({ message: "File uploaded successfully", user });
        } catch (err) {
            console.error("Upload error:", err);
            res.status(500).json({ error: "Failed to upload file" });
        }
    }
}

module.exports = ImageUrl