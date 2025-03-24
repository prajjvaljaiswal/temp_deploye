const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        immutable: true
    },
    password: {
        type: String,
        required: true
    },
    photoURL: {
        type: String,
        default:""
    }
}, {
    timestamps: true
});

const User = mongoose.model("User",userSchema)

module.exports = User