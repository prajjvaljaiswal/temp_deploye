const mongoose = require("mongoose")

const ConnectionSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    toUserId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status:{
        type: String,
        required: true,
        enum: {
            values: ['ignored','accepted','rejected','intrested'],
            message: '{VALUE} is not not valid'
        }
    }
},{
    timestamps: true,
})

const Connection = mongoose.model("Connections",ConnectionSchema)

module.exports = Connection